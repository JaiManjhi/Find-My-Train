import math
from datetime import datetime
from typing import Any, Optional

import httpx

from app.core.config import get_settings
from app.repositories import mock_repository, train_repository
from app.utils.cache import TTLCache

_cache = TTLCache(ttl_seconds=30)  # respects RailRadar rate limit (10 req/min)


def _resolve_station_coordinates(raw_stations: list[dict]) -> list[dict]:
    """Resolve accurate coordinates for a list of route stations.
    Priority: STATION_COORDS dict -> API lat/lng -> interpolation.
    """
    resolved: list[Optional[dict]] = []
    for st in raw_stations:
        code = st.get("stationCode") or st.get("code")
        known = train_repository.STATION_COORDS.get(code)
        if known:
            resolved.append({"lat": known["lat"], "lon": known["lon"], "state": known["state"], "elev": known["elev"]})
            continue

        try:
            api_lat = float(st.get("lat", st.get("latitude")))
            api_lon = float(st.get("lng", st.get("lon", st.get("longitude"))))
        except (TypeError, ValueError):
            api_lat = api_lon = float("nan")

        if not math.isnan(api_lat) and not math.isnan(api_lon) and api_lat != 0 and api_lon != 0:
            resolved.append({"lat": api_lat, "lon": api_lon, "state": st.get("state", "India"), "elev": st.get("elevation", 100)})
        else:
            resolved.append(None)

    final: list[dict] = []
    for i in range(len(raw_stations)):
        if resolved[i]:
            final.append(resolved[i])
            continue

        prev_idx = next((p for p in range(i - 1, -1, -1) if resolved[p]), -1)
        next_idx = next((n for n in range(i + 1, len(raw_stations)) if resolved[n]), -1)

        prev_c = resolved[prev_idx] if prev_idx != -1 else {"lat": 28.643, "lon": 77.2194, "state": "India", "elev": 100}
        next_c = resolved[next_idx] if next_idx != -1 else prev_c
        rng = max(1, next_idx - (prev_idx if prev_idx != -1 else 0))
        frac = (i - (prev_idx if prev_idx != -1 else 0)) / rng

        final.append({
            "lat": prev_c["lat"] + frac * (next_c["lat"] - prev_c["lat"]),
            "lon": prev_c["lon"] + frac * (next_c["lon"] - prev_c["lon"]),
            "state": "India",
            "elev": 100,
        })

    return final


def _fmt_time(iso: Optional[str]) -> str:
    if not iso:
        return "--"
    try:
        dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
        return dt.strftime("%H:%M")
    except ValueError:
        return "--"


async def _fetch_live_status(train_number: str) -> Optional[dict]:
    settings = get_settings()
    static_route = train_repository.get_static_train_route(train_number)

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.get(
                f"https://api.railradar.in/v1/trains/{train_number}/live",
                headers={
                    "Authorization": f"Bearer {settings.railradar_api_key}",
                    "x-api-key": settings.railradar_api_key,
                },
            )
    except Exception:
        return None

    if res.status_code != 200:
        return None

    json_body = res.json()
    if not json_body.get("success") or not json_body.get("data"):
        return None

    live_data = json_body["data"]
    train_meta = live_data.get("train") or {}
    raw_route: list[dict] = live_data.get("route") or []

    total_distance = train_meta.get("distance") or (static_route["totalDistance"] if static_route else 1380)
    delay_minutes = live_data.get("delayMinutes", 0)

    station_coords = _resolve_station_coordinates(raw_route)

    last_departed_idx = -1
    for i, st in enumerate(raw_route):
        if st.get("status") == "departed":
            last_departed_idx = i

    curr_station_idx = last_departed_idx if last_departed_idx >= 0 else 0
    next_station_idx = min(len(raw_route) - 1, curr_station_idx + 1) if raw_route else 0

    is_halted_at_station = raw_route[curr_station_idx].get("status") == "arrived" if raw_route else False
    if is_halted_at_station:
        next_station_idx = min(len(raw_route) - 1, curr_station_idx + 1)

    stations = []
    for index, st in enumerate(raw_route):
        coords = station_coords[index]
        is_passed = index < curr_station_idx or (index == curr_station_idx and not is_halted_at_station)
        is_current = index == curr_station_idx
        is_next = index == next_station_idx and next_station_idx != curr_station_idx

        stations.append({
            "code": st.get("stationCode") or st.get("code"),
            "name": st.get("stationName") or st.get("name") or st.get("stationCode") or st.get("code"),
            "state": coords["state"],
            "latitude": coords["lat"],
            "longitude": coords["lon"],
            "arrivalTime": _fmt_time(st.get("scheduledArrival")),
            "departureTime": _fmt_time(st.get("scheduledDeparture")),
            "actualArrival": _fmt_time(st["actualArrival"]) if st.get("actualArrival") else None,
            "actualDeparture": _fmt_time(st["actualDeparture"]) if st.get("actualDeparture") else None,
            "delayMinutes": st.get("delayDeparture") or st.get("delayArrival") or delay_minutes,
            "distanceFromOrigin": round(st.get("distance") or (index / max(1, len(raw_route) - 1)) * total_distance),
            "elevation": coords["elev"],
            "platform": st.get("platform", "1"),
            "isHalt": bool(st.get("scheduledDeparture") and st.get("haltMinutes") != 0),
            "isPassed": is_passed,
            "isCurrent": is_current,
            "isNext": is_next,
        })

    if not stations:
        return None

    current_station_obj = stations[curr_station_idx] if curr_station_idx < len(stations) else stations[0]
    next_station_obj = stations[next_station_idx] if next_station_idx < len(stations) else (stations[1] if len(stations) > 1 else stations[0])

    current_location = live_data.get("currentLocation") or {}
    current_position = live_data.get("currentPosition") or {}

    def _to_float(*values) -> float:
        for v in values:
            if v is not None:
                try:
                    return float(v)
                except (TypeError, ValueError):
                    continue
        return float("nan")

    direct_lat = _to_float(current_location.get("lat"), current_location.get("latitude"), current_position.get("lat"), live_data.get("lat"))
    direct_lon = _to_float(current_location.get("lng"), current_location.get("lon"), current_location.get("longitude"), current_position.get("lng"), live_data.get("lng"))

    current_latitude = current_station_obj["latitude"]
    current_longitude = current_station_obj["longitude"]

    if not math.isnan(direct_lat) and not math.isnan(direct_lon) and direct_lat != 0 and direct_lon != 0:
        current_latitude = direct_lat
        current_longitude = direct_lon
    elif isinstance(current_location.get("segmentProgress"), (int, float)):
        p = max(0, min(1, current_location["segmentProgress"]))
        current_latitude = current_station_obj["latitude"] + p * (next_station_obj["latitude"] - current_station_obj["latitude"])
        current_longitude = current_station_obj["longitude"] + p * (next_station_obj["longitude"] - current_station_obj["longitude"])
    elif next_station_obj is not current_station_obj:
        progress = 0.5
        total_leg_dist = next_station_obj["distanceFromOrigin"] - current_station_obj["distanceFromOrigin"]
        covered_dist = live_data.get("distanceCovered", current_location.get("distance"))

        if isinstance(covered_dist, (int, float)) and total_leg_dist > 0:
            progress = max(0.05, min(0.95, (covered_dist - current_station_obj["distanceFromOrigin"]) / total_leg_dist))
        else:
            try:
                def _parse_time(st: dict, prefer_dep: bool):
                    time_str = (st.get("actualDeparture") or st.get("departureTime")) if prefer_dep else (st.get("actualArrival") or st.get("arrivalTime"))
                    if not time_str or time_str == "--":
                        return None
                    parts = time_str.split(":")
                    if len(parts) < 2:
                        return None
                    h, m = int(parts[0]), int(parts[1])
                    now = datetime.now()
                    return datetime(now.year, now.month, now.day, h, m).timestamp() * 1000

                dep_ms = _parse_time(current_station_obj, True)
                arr_ms = _parse_time(next_station_obj, False)
                now_ms = datetime.now().timestamp() * 1000

                if dep_ms and arr_ms and arr_ms > dep_ms:
                    progress = max(0.05, min(0.95, (now_ms - dep_ms) / (arr_ms - dep_ms)))
            except Exception:
                progress = 0.5

        current_latitude = current_station_obj["latitude"] + progress * (next_station_obj["latitude"] - current_station_obj["latitude"])
        current_longitude = current_station_obj["longitude"] + progress * (next_station_obj["longitude"] - current_station_obj["longitude"])

    distance_covered_raw = live_data.get("distanceCovered", current_location.get("distance"))
    if isinstance(distance_covered_raw, (int, float)):
        distance_covered = round(distance_covered_raw)
    else:
        distance_covered = round(
            current_station_obj["distanceFromOrigin"]
            + math.hypot(current_latitude - current_station_obj["latitude"], current_longitude - current_station_obj["longitude"]) * 111
        )
    distance_remaining = max(0, total_distance - distance_covered)
    completion_percent = min(100, round((distance_covered / total_distance) * 100)) if total_distance else 0

    last_updated_at = live_data.get("lastUpdatedAt")
    last_updated = "Just now"
    if last_updated_at:
        try:
            last_updated = datetime.fromisoformat(last_updated_at.replace("Z", "+00:00")).strftime("%H:%M:%S")
        except ValueError:
            pass

    return {
        "id": train_number,
        "trainNumber": train_number,
        "trainName": train_meta.get("name") or live_data.get("trainName") or (static_route["trainName"] if static_route else "Indian Express"),
        "origin": (train_meta.get("source") or {}).get("name") or (static_route["origin"] if static_route else None) or stations[0]["name"],
        "destination": (train_meta.get("destination") or {}).get("name") or (static_route["destination"] if static_route else None) or stations[-1]["name"],
        "totalDistance": total_distance,
        "speed": round(live_data.get("speed") or train_meta.get("avgSpeed") or 95),
        "delayMinutes": delay_minutes,
        "status": "DELAYED" if delay_minutes > 15 else "ON_TIME",
        "lastUpdated": last_updated,
        "completionPercent": completion_percent,
        "distanceCovered": distance_covered,
        "distanceRemaining": distance_remaining,
        "totalDuration": (static_route["totalDuration"] if static_route else None) or f"{(train_meta.get('duration', 932)) // 60}h {(train_meta.get('duration', 932)) % 60}m",
        "currentLatitude": current_latitude,
        "currentLongitude": current_longitude,
        "currentStation": current_station_obj,
        "nextStation": next_station_obj,
        "stations": stations,
    }


def _dynamic_fallback(train_number: str) -> dict:
    static_route = train_repository.get_static_train_route(train_number)
    fallback: dict[str, Any] = (
        {**static_route, "isStale": True}
        if static_route
        else {**mock_repository_mumbai_rajdhani(), "id": train_number, "trainNumber": train_number, "isStale": True}
    )

    stations = fallback.get("stations")
    if not stations or len(stations) < 2:
        return fallback

    now = datetime.now()
    current_mins = now.hour * 60 + now.minute

    active_segment_idx = 0
    for i in range(len(stations) - 1):
        dep_str = stations[i].get("departureTime")
        if dep_str and dep_str != "--":
            try:
                h, m = (int(x) for x in dep_str.split(":"))
                dep_mins = h * 60 + m
                if current_mins >= dep_mins:
                    active_segment_idx = i
            except ValueError:
                pass

    next_idx = min(len(stations) - 1, active_segment_idx + 1)

    for idx, s in enumerate(stations):
        s["isPassed"] = idx < active_segment_idx
        s["isCurrent"] = idx == active_segment_idx
        s["isNext"] = idx == next_idx and next_idx != active_segment_idx

    curr_st = stations[active_segment_idx]
    next_st = stations[next_idx]

    p = 0.5
    if next_st is not curr_st:
        dep_str, arr_str = curr_st.get("departureTime"), next_st.get("arrivalTime")
        if dep_str and arr_str and dep_str != "--" and arr_str != "--":
            try:
                dh, dm = (int(x) for x in dep_str.split(":"))
                ah, am = (int(x) for x in arr_str.split(":"))
                dep_m = dh * 60 + dm
                arr_m = ah * 60 + am
                if arr_m < dep_m:
                    arr_m += 24 * 60
                span = arr_m - dep_m
                if span > 0:
                    elapsed = current_mins - dep_m
                    if elapsed < 0:
                        elapsed += 24 * 60
                    p = max(0.05, min(0.95, elapsed / span))
            except ValueError:
                pass

    cur_lat = curr_st["latitude"] + p * (next_st["latitude"] - curr_st["latitude"])
    cur_lon = curr_st["longitude"] + p * (next_st["longitude"] - curr_st["longitude"])
    covered = curr_st["distanceFromOrigin"] + p * (next_st["distanceFromOrigin"] - curr_st["distanceFromOrigin"])

    fallback.update({
        "currentLatitude": cur_lat,
        "currentLongitude": cur_lon,
        "currentStation": curr_st,
        "nextStation": next_st,
        "distanceCovered": round(covered),
        "distanceRemaining": max(0, fallback["totalDistance"] - round(covered)),
        "completionPercent": min(100, round((covered / fallback["totalDistance"]) * 100)) if fallback["totalDistance"] else 0,
    })
    return fallback


def mock_repository_mumbai_rajdhani() -> dict:
    return train_repository.MUMBAI_RAJDHANI_TRAIN


async def get_live_train_status(train_number: str) -> dict:
    cached = _cache.get(train_number)
    if cached is not None:
        return cached

    live = await _fetch_live_status(train_number)
    result = live if live is not None else _dynamic_fallback(train_number)

    _cache.set(train_number, result)
    return result

"""Static train route database with real coordinates for major Indian Railway
trains. Used as an intelligent fallback when the live RailRadar API is
unavailable. Ported 1:1 from the original src/data/trainDatabase.ts.
"""

import json
from functools import lru_cache
from pathlib import Path
from typing import Optional

DATA_DIR = Path(__file__).parent / "data"


def _load(name: str):
    with open(DATA_DIR / name, encoding="utf-8") as f:
        return json.load(f)


STATION_COORDS: dict[str, dict] = _load("station_coords.json")
_TRAIN_ROUTE_SPECS: list[dict] = _load("train_routes.json")
INDIAN_TRAINS_DATABASE: list[dict] = _load("indian_trains_database.json")
POPULAR_TRAINS: list[dict] = _load("popular_trains.json")
MUMBAI_RAJDHANI_TRAIN: dict = _load("mumbai_rajdhani_train.json")

_DEFAULT_ORIGIN = {"lat": 18.9696, "lon": 72.8193, "state": "India", "elev": 100}


def _resolve_coords(station_codes: list[str]) -> list[dict]:
    resolved: list[Optional[dict]] = [STATION_COORDS.get(code) for code in station_codes]

    final: list[dict] = []
    for i, code in enumerate(station_codes):
        known = resolved[i]
        if known:
            final.append({**known, "name": known.get("name", code)})
            continue

        prev_idx = next((p for p in range(i - 1, -1, -1) if resolved[p]), -1)
        next_idx = next((n for n in range(i + 1, len(station_codes)) if resolved[n]), -1)

        prev_c = resolved[prev_idx] if prev_idx != -1 else _DEFAULT_ORIGIN
        next_c = resolved[next_idx] if next_idx != -1 else prev_c
        rng = max(1, next_idx - (prev_idx if prev_idx != -1 else 0))
        frac = (i - (prev_idx if prev_idx != -1 else 0)) / rng

        final.append({
            "name": code,
            "lat": prev_c["lat"] + frac * (next_c["lat"] - prev_c["lat"]),
            "lon": prev_c["lon"] + frac * (next_c["lon"] - prev_c["lon"]),
            "state": "India",
            "elev": 100,
        })

    return final


def _build_train(
    train_number: str,
    train_name: str,
    station_codes: list[str],
    scheduled_times: list[str],
    total_distance_km: float,
    total_duration_str: str,
    speed: float = 95,
) -> dict:
    coords = _resolve_coords(station_codes)

    stations = []
    for i, code in enumerate(station_codes):
        c = coords[i]
        times = scheduled_times[i].split("|") if i < len(scheduled_times) else []
        stations.append({
            "code": code,
            "name": c["name"],
            "state": c["state"],
            "latitude": c["lat"],
            "longitude": c["lon"],
            "arrivalTime": times[0] if len(times) > 0 else "--",
            "departureTime": times[1] if len(times) > 1 else "--",
            "delayMinutes": 0,
            "distanceFromOrigin": round((i / max(1, len(station_codes) - 1)) * total_distance_km),
            "elevation": c["elev"],
            "isHalt": True,
            "isPassed": False,
            "isCurrent": i == 0,
            "isNext": i == 1,
        })

    if stations:
        stations[0]["isPassed"] = False
        stations[0]["isCurrent"] = True
        stations[0]["isNext"] = False
    if len(stations) > 1:
        stations[1]["isCurrent"] = False
        stations[1]["isNext"] = True

    origin_coords = coords[0] if coords else {"lat": 20, "lon": 78}

    return {
        "id": train_number,
        "trainNumber": train_number,
        "trainName": train_name,
        "origin": stations[0]["name"] if stations else station_codes[0],
        "destination": stations[-1]["name"] if stations else station_codes[-1],
        "totalDistance": total_distance_km,
        "speed": speed,
        "delayMinutes": 0,
        "status": "ON_TIME",
        "lastUpdated": "Static data",
        "completionPercent": 0,
        "distanceCovered": 0,
        "distanceRemaining": total_distance_km,
        "totalDuration": total_duration_str,
        "currentLatitude": origin_coords.get("lat", 20),
        "currentLongitude": origin_coords.get("lon", 78),
        "currentStation": stations[0],
        "nextStation": stations[1] if len(stations) > 1 else stations[0],
        "stations": stations,
    }


@lru_cache
def _train_routes() -> dict[str, dict]:
    return {
        spec["trainNumber"]: _build_train(
            spec["trainNumber"],
            spec["trainName"],
            spec["stationCodes"],
            spec["scheduledTimes"],
            spec["totalDistanceKm"],
            spec["totalDurationStr"],
            spec["speed"],
        )
        for spec in _TRAIN_ROUTE_SPECS
    }


def get_static_train_route(train_number: str) -> Optional[dict]:
    """Get a static train route for the given train number, or None."""
    return _train_routes().get(train_number)


def get_static_train_numbers() -> list[str]:
    """Get the list of all train numbers in the static database."""
    return list(_train_routes().keys())


def search_trains(query: str) -> list[dict]:
    if not query:
        return INDIAN_TRAINS_DATABASE
    q = query.lower().strip()
    return [
        t for t in INDIAN_TRAINS_DATABASE
        if q in t["trainNumber"].lower()
        or q in t["trainName"].lower()
        or q in t["origin"].lower()
        or q in t["destination"].lower()
    ]

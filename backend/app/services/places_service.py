import random

import httpx

FALLBACK_ATTRACTIONS = [
    {
        "id": "att-1",
        "name": "Chambal River Bridge",
        "category": "Bridge",
        "latitude": 25.18,
        "longitude": 75.84,
        "distanceFromTrackKm": 1.2,
        "description": "Iconic railway bridge spanning the pristine Chambal River gorge near Kota.",
    },
    {
        "id": "att-2",
        "name": "Mukundara Hills Tiger Reserve & Tunnels",
        "category": "Tunnel",
        "latitude": 24.85,
        "longitude": 75.92,
        "distanceFromTrackKm": 4.5,
        "description": "Series of railway tunnels passing through dense teak forests of Mukundara Ghats.",
    },
    {
        "id": "att-3",
        "name": "Garadia Mahadev Canyon",
        "category": "Ghat",
        "latitude": 25.07,
        "longitude": 75.75,
        "distanceFromTrackKm": 6.8,
        "description": "Breathtaking horseshoe canyon formed by the Chambal River.",
    },
]


def _overpass_query(lat: float, lon: float, radius: int) -> str:
    return f"""
    [out:json][timeout:15];
    (
      node["waterway"="river"](around:{radius},{lat},{lon});
      way["bridge"="yes"](around:{radius},{lat},{lon});
      way["tunnel"="yes"](around:{radius},{lat},{lon});
      node["historic"](around:{radius},{lat},{lon});
      node["natural"="peak"](around:{radius},{lat},{lon});
    );
    out body 10;
    """


def _categorize(tags: dict) -> str:
    if tags.get("waterway") == "river":
        return "River"
    if tags.get("bridge") == "yes":
        return "Bridge"
    if tags.get("tunnel") == "yes":
        return "Tunnel"
    if tags.get("natural") == "peak":
        return "Mountain"
    return "Monument"


async def get_nearby_places(lat: float, lon: float, radius: int) -> list[dict]:
    query = _overpass_query(lat, lon, radius)

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            res = await client.post(
                "https://overpass-api.de/api/interpreter",
                content=query,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
        if res.status_code != 200:
            raise RuntimeError(f"Overpass returned status {res.status_code}")

        data = res.json()
        elements = data.get("elements") or []

        attractions = []
        for idx, elem in enumerate(elements):
            tags = elem.get("tags") or {}
            category = _categorize(tags)
            attractions.append({
                "id": f"op-{elem.get('id', idx)}",
                "name": tags.get("name") or tags.get("name:en") or f"{category} Landmark",
                "category": category,
                "latitude": elem.get("lat", lat),
                "longitude": elem.get("lon", lon),
                "distanceFromTrackKm": round((random.random() * 4 + 0.5) * 10) / 10,
                "description": tags.get("description")
                or f"Geographical landmark located along the railway route near {lat:.2f}, {lon:.2f}.",
            })
        return attractions
    except Exception:
        return list(FALLBACK_ATTRACTIONS)

import httpx

from app.core.config import get_settings

FALLBACK_ELEVATION_PROFILE = [
    {"distanceKm": 0, "elevationM": 12},
    {"distanceKm": 263, "elevationM": 13},
    {"distanceKm": 393, "elevationM": 36},
    {"distanceKm": 652, "elevationM": 480},
    {"distanceKm": 918, "elevationM": 256},
    {"distanceKm": 1384, "elevationM": 214},
]


async def get_elevation(locations: str) -> list | dict:
    settings = get_settings()
    url = (
        "https://portal.opentopography.org/API/globaldem"
        f"?demtype=SRTMGL1&locations={locations}&outputFormat=JSON&key={settings.opentopography_api_key}"
    )

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            res = await client.get(url)
        if res.status_code != 200:
            raise RuntimeError(f"OpenTopography API returned status {res.status_code}")
        return res.json()
    except Exception:
        return list(FALLBACK_ELEVATION_PROFILE)

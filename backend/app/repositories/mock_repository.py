"""Static mock/fallback data, ported 1:1 from src/data/mockData.ts."""

import json
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"


def _load(name: str):
    with open(DATA_DIR / name, encoding="utf-8") as f:
        return json.load(f)


MOCK_WEATHER_DATA: dict[str, dict] = _load("mock_weather_data.json")
MOCK_NEARBY_ATTRACTIONS: list[dict] = _load("mock_nearby_attractions.json")
MOCK_ELEVATION_PROFILE: list[dict] = _load("mock_elevation_profile.json")

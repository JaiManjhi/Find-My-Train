from typing import Any

from fastapi import APIRouter, Query

from app.services import weather_service

router = APIRouter(prefix="/api/weather", tags=["weather"])


@router.get("")
async def get_weather(
    lat: str = Query(default="23.332"),
    lon: str = Query(default="75.038"),
) -> dict[str, Any]:
    return await weather_service.get_weather(lat, lon)

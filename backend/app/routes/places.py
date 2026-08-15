from typing import Any

from fastapi import APIRouter, Query

from app.services import places_service

router = APIRouter(prefix="/api/places", tags=["places"])


@router.get("")
async def get_places(
    lat: float = Query(default=25.18),
    lon: float = Query(default=75.84),
    radius: int = Query(default=10000),
) -> list[dict[str, Any]]:
    return await places_service.get_nearby_places(lat, lon, radius)

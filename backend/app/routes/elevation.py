from typing import Any

from fastapi import APIRouter, Query

from app.services import elevation_service

router = APIRouter(prefix="/api/elevation", tags=["elevation"])


@router.get("")
async def get_elevation(locations: str = Query(default="23.332,75.038")) -> Any:
    return await elevation_service.get_elevation(locations)

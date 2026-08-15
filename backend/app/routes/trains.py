from typing import Any

from fastapi import APIRouter, Query

from app.repositories import train_repository
from app.services import railradar_service

router = APIRouter(prefix="/api/trains", tags=["trains"])


@router.get("/search")
async def search_trains(q: str = Query(default="")) -> list[dict[str, Any]]:
    return train_repository.search_trains(q.lower().strip())


@router.get("/{train_id}/status")
async def get_train_status(train_id: str) -> dict[str, Any]:
    return await railradar_service.get_live_train_status(train_id or "12951")

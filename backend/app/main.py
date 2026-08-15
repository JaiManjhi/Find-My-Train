from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routes import elevation, places, trains, weather

settings = get_settings()

app = FastAPI(title="Find My Train API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trains.router)
app.include_router(weather.router)
app.include_router(elevation.router)
app.include_router(places.router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}

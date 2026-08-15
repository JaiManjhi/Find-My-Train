from typing import Optional

from pydantic import BaseModel


class WeatherData(BaseModel):
    stationCode: str
    stationName: str
    tempC: float
    condition: str
    humidity: float
    windSpeedKm: float
    rainProbability: float
    icon: str


class Attraction(BaseModel):
    id: str
    name: str
    category: str
    latitude: float
    longitude: float
    distanceFromTrackKm: float
    description: str
    image: Optional[str] = None


class ElevationPoint(BaseModel):
    distanceKm: float
    elevationM: float
    stationName: Optional[str] = None


class SearchResult(BaseModel):
    trainNumber: str
    trainName: str
    origin: str
    destination: str
    runsOnDays: list[str]
    departureTime: str
    arrivalTime: str

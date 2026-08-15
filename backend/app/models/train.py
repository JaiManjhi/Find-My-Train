from typing import Optional

from pydantic import BaseModel


class Station(BaseModel):
    code: str
    name: str
    state: str
    latitude: float
    longitude: float
    arrivalTime: str
    departureTime: str
    actualArrival: Optional[str] = None
    actualDeparture: Optional[str] = None
    delayMinutes: float
    distanceFromOrigin: float
    elevation: float
    platform: Optional[str] = None
    isHalt: Optional[bool] = None
    isPassed: bool
    isCurrent: bool
    isNext: bool


class Train(BaseModel):
    id: str
    trainNumber: str
    trainName: str
    origin: str
    destination: str
    totalDistance: float
    currentStation: Station
    nextStation: Station
    currentLatitude: float
    currentLongitude: float
    speed: float
    delayMinutes: float
    status: str
    lastUpdated: str
    completionPercent: float
    distanceCovered: float
    distanceRemaining: float
    totalDuration: str
    stations: list[Station]
    isStale: Optional[bool] = None

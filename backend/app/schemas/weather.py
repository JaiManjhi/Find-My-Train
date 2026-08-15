from pydantic import BaseModel


class WeatherResponse(BaseModel):
    tempC: float
    feelsLike: float
    condition: str
    humidity: float
    windSpeedKm: float
    rainProbability: float
    visibility: float
    icon: str
    name: str

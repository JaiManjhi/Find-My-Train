import httpx

from app.core.config import get_settings

FALLBACK_WEATHER = {
    "tempC": 30,
    "feelsLike": 33,
    "condition": "Partly Cloudy",
    "humidity": 58,
    "windSpeedKm": 12,
    "rainProbability": 10,
    "visibility": 8000,
    "icon": "02d",
    "name": "Station Area",
}


async def get_weather(lat: str, lon: str) -> dict:
    settings = get_settings()
    url = (
        "https://api.openweathermap.org/data/2.5/weather"
        f"?lat={lat}&lon={lon}&appid={settings.openweather_api_key}&units=metric"
    )

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.get(url)
        if res.status_code != 200:
            raise RuntimeError(f"OpenWeather API responded with status {res.status_code}")

        data = res.json()
        weather0 = (data.get("weather") or [{}])[0]
        description = weather0.get("description")
        condition = description[0:1].upper() + description[1:] if description else weather0.get("main", "Clear")
        wind = data.get("wind") or {}
        rain = data.get("rain")

        return {
            "tempC": round(data["main"]["temp"]),
            "feelsLike": round(data["main"].get("feels_like", data["main"]["temp"])),
            "condition": condition,
            "humidity": data["main"]["humidity"],
            "windSpeedKm": round(wind.get("speed", 0) * 3.6),
            "rainProbability": min(100, round((rain.get("1h", rain.get("3h", 1))) * 20)) if rain else 8,
            "visibility": data.get("visibility", 10000),
            "icon": weather0.get("icon", "01d"),
            "name": data.get("name", "Station Area"),
        }
    except Exception:
        return dict(FALLBACK_WEATHER)

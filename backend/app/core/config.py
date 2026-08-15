from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # No baked-in defaults: each deployer must supply their own keys via
    # .env (see .env.example). If unset, calls to that provider will fail
    # and the corresponding service falls back to mock/static data.
    opentopography_api_key: str = ""
    openweather_api_key: str = ""
    railradar_api_key: str = ""
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

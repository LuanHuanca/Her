"""Configuración de la aplicación, leída de variables de entorno (ver docker-compose.yml)."""
import warnings

from pydantic_settings import BaseSettings, SettingsConfigDict

_SECRET_KEY_DE_EJEMPLO = "supersecretkey-change-in-production"


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    cors_origins: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)

    @property
    def cors_origins_list(self) -> list[str]:
        # Algunas plataformas (p. ej. Render, vía `fromService: property: host`) solo pueden
        # inyectar el hostname sin esquema — se asume https si no viene uno.
        origenes = (o.strip() for o in self.cors_origins.split(","))
        return [o if "://" in o else f"https://{o}" for o in origenes if o]


settings = Settings()

if settings.secret_key == _SECRET_KEY_DE_EJEMPLO:
    warnings.warn(
        "SECRET_KEY sigue siendo el valor de ejemplo de .env.example. "
        "Generá una clave real antes de desplegar a producción.",
        stacklevel=1,
    )

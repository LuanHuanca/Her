"""Base para que los schemas de salida usen camelCase (igual que frontend/src/types.ts)
mientras el código Python se queda en snake_case."""
from pydantic import BaseModel, ConfigDict


def to_camel(campo: str) -> str:
    primero, *resto = campo.split("_")
    return primero + "".join(p.capitalize() for p in resto)


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

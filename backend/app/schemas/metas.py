from pydantic import field_validator

from app.constants import HORIZONTES_VALIDOS, MINUTOS_VALIDOS, OBJETIVOS_VALIDOS
from app.schemas.base import CamelModel


class MetasIn(CamelModel):
    objetivos: list[str]
    minutos_al_dia: int
    horizonte_meses: int

    @field_validator("objetivos")
    @classmethod
    def objetivos_validos(cls, v: list[str]) -> list[str]:
        if not v:
            raise ValueError("Elige al menos una meta")
        invalidos = set(v) - OBJETIVOS_VALIDOS
        if invalidos:
            raise ValueError(f"Objetivos inválidos: {', '.join(invalidos)}")
        return v

    @field_validator("minutos_al_dia")
    @classmethod
    def minutos_validos(cls, v: int) -> int:
        if v not in MINUTOS_VALIDOS:
            raise ValueError(f"minutosAlDia debe ser uno de {MINUTOS_VALIDOS}")
        return v

    @field_validator("horizonte_meses")
    @classmethod
    def horizonte_valido(cls, v: int) -> int:
        if v not in HORIZONTES_VALIDOS:
            raise ValueError(f"horizonteMeses debe ser uno de {HORIZONTES_VALIDOS}")
        return v


class MetasOut(MetasIn):
    pass

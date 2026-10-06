from datetime import date

from pydantic import Field, field_validator

from app.constants import CIUDADES
from app.enums import BuscaEmpleo, PreferenciaEventos
from app.schemas.base import CamelModel


class PerfilBase(CamelModel):
    nombre: str = Field(min_length=2, max_length=120)
    fecha_nacimiento: date
    ciudad: str
    ocupacion: str = Field(default="", max_length=160)
    hijos: int = Field(ge=0, le=20)
    busca_empleo: BuscaEmpleo
    eventos: PreferenciaEventos

    @field_validator("ciudad")
    @classmethod
    def ciudad_valida(cls, v: str) -> str:
        if v not in CIUDADES:
            raise ValueError(f"Ciudad inválida. Opciones: {', '.join(CIUDADES)}")
        return v

    @field_validator("fecha_nacimiento")
    @classmethod
    def edad_valida(cls, v: date) -> date:
        hoy = date.today()
        edad = hoy.year - v.year - ((hoy.month, hoy.day) < (v.month, v.day))
        if v > hoy:
            raise ValueError("La fecha de nacimiento no puede ser futura")
        if edad < 13 or edad > 100:
            raise ValueError("La edad debe estar entre 13 y 100 años")
        return v

    @field_validator("nombre", "ocupacion")
    @classmethod
    def limpiar_texto(cls, v: str) -> str:
        return v.strip()


class PerfilActualizar(PerfilBase):
    pass


class PerfilOut(PerfilBase):
    pass

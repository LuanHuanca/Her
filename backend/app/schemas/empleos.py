from pydantic import Field

from app.schemas.base import CamelModel
from app.schemas.recompensas import PersonaOut


class EmpleoOut(CamelModel):
    id: str
    puesto: str
    empresa: PersonaOut
    ciudad: str
    jornada: str
    modalidad: str
    publica: PersonaOut
    hace: str
    descripcion: str
    requisitos: list[str]
    coincidencias: list[str]
    guardado: bool
    postulada: bool


class GuardadoOut(CamelModel):
    guardado: bool


class PostularIn(CamelModel):
    cv_nombre_archivo: str = Field(min_length=1, max_length=200)


class PostulacionOut(CamelModel):
    postulada: bool

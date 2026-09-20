from datetime import date

from app.schemas.base import CamelModel


class EventoOut(CamelModel):
    id: int
    titulo: str
    fecha: date
    hora: str
    duracion_min: int
    modalidad: str
    lugar: str
    descripcion: str
    inscrita: bool


class InscripcionOut(CamelModel):
    inscrita: bool

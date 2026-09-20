from pydantic import Field

from app.schemas.base import CamelModel


class ModuloEnRuta(CamelModel):
    id: str
    numero: int
    titulo: str
    corto: str
    descripcion: str
    estado: str  # 'completado' | 'actual' | 'bloqueado'
    dias_hechos: int | None = None


class RutaOut(CamelModel):
    racha: int
    modulos: list[ModuloEnRuta]


class TareaOut(CamelModel):
    titulo: str
    frase: str
    duracion_seg: int
    minutos: int
    puntos: int
    texto: list[str]
    consigna: str


class RetoHoyOut(CamelModel):
    dia: int
    racha: int
    completado_hoy: bool
    reflexion: str
    puntos_totales: int
    modulo_corto: str
    tarea: TareaOut


class CompletarRetoIn(CamelModel):
    reflexion: str = Field(min_length=1, max_length=2000)
    compartir: bool = False

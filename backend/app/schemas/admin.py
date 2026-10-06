from datetime import date, datetime

from pydantic import Field, field_validator

from app.constants import CIUDADES
from app.enums import EmpleoModalidad, EventoModalidad, Jornada, Rol
from app.schemas.base import CamelModel

# ── Usuarias ─────────────────────────────────────────────────────────────
class UsuarioAdminOut(CamelModel):
    id: int
    email: str
    nombre: str
    ciudad: str
    rol: str
    activo: bool
    creado_en: datetime


class UsuarioAdminActualizar(CamelModel):
    rol: Rol | None = None
    activo: bool | None = None


# ── Módulos y tareas ─────────────────────────────────────────────────────
class ModuloAdminOut(CamelModel):
    id: str
    numero: int
    titulo: str
    corto: str
    descripcion: str
    total_tareas: int


class ModuloIn(CamelModel):
    numero: int = Field(ge=1)
    titulo: str = Field(min_length=2, max_length=120)
    corto: str = Field(min_length=2, max_length=60)
    descripcion: str = Field(min_length=2, max_length=240)


class TareaAdminOut(CamelModel):
    id: int
    dia: int
    titulo: str
    frase: str
    duracion_seg: int
    minutos: int
    puntos: int
    texto: list[str]
    consigna: str


class TareaIn(CamelModel):
    dia: int = Field(ge=1, le=21)
    titulo: str = Field(min_length=2, max_length=160)
    frase: str = Field(min_length=2, max_length=240)
    duracion_seg: int = Field(ge=30, le=3600, default=300)
    minutos: int = Field(ge=1, le=60, default=10)
    puntos: int = Field(ge=1, le=1000, default=50)
    texto: list[str] = Field(min_length=1)
    consigna: str = Field(min_length=2, max_length=240)


# ── Eventos ──────────────────────────────────────────────────────────────
class EventoAdminOut(CamelModel):
    id: int
    titulo: str
    fecha: date
    hora: str
    duracion_min: int
    modalidad: str
    lugar: str
    descripcion: str
    total_inscritas: int


class EventoIn(CamelModel):
    titulo: str = Field(min_length=2, max_length=160)
    fecha: date
    hora: str = Field(pattern=r"^([01]\d|2[0-3]):[0-5]\d$")
    duracion_min: int = Field(ge=5, le=600)
    modalidad: EventoModalidad
    lugar: str = Field(min_length=2, max_length=120)
    descripcion: str = Field(min_length=2, max_length=400)


# ── Empresas ─────────────────────────────────────────────────────────────
class EmpresaAdminOut(CamelModel):
    id: int
    nombre: str
    iniciales: str
    tono: str
    total_empleos: int


class EmpresaIn(CamelModel):
    nombre: str = Field(min_length=2, max_length=120)


# ── Empleos ──────────────────────────────────────────────────────────────
class EmpleoAdminOut(CamelModel):
    id: str
    puesto: str
    empresa_id: int
    empresa_nombre: str
    ciudad: str
    jornada: str
    modalidad: str
    descripcion: str
    requisitos: list[str]
    coincidencias: list[str]
    total_postulaciones: int
    total_guardados: int


class EmpleoIn(CamelModel):
    puesto: str = Field(min_length=2, max_length=160)
    empresa_id: int
    ciudad: str
    jornada: Jornada
    modalidad: EmpleoModalidad
    descripcion: str = Field(min_length=2, max_length=1000)
    requisitos: list[str] = Field(default_factory=list)
    coincidencias: list[str] = Field(default_factory=list)

    @field_validator("ciudad")
    @classmethod
    def ciudad_valida(cls, v: str) -> str:
        if v not in CIUDADES:
            raise ValueError(f"Ciudad inválida. Opciones: {', '.join(CIUDADES)}")
        return v


# ── Comunidad (moderación) ───────────────────────────────────────────────
class PublicacionAdminOut(CamelModel):
    id: int
    autora_nombre: str
    hace: str
    etiqueta: str
    texto: str
    likes: int
    total_comentarios: int


class ComentarioAdminOut(CamelModel):
    id: int
    autora_nombre: str
    hace: str
    texto: str


# ── Panel / resumen ──────────────────────────────────────────────────────
class ResumenOut(CamelModel):
    total_usuarias: int
    total_admins: int
    usuarias_activas_hoy: int
    total_publicaciones: int
    total_empleos: int
    total_postulaciones: int
    eventos_proximos: int

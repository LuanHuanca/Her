"""Importa todos los modelos para que Base.metadata los conozca (Alembic autogenerate)."""
from app.db import Base
from app.models.comunidad import Comentario, Like, Publicacion
from app.models.empleo import Empleo, EmpleoGuardado, Empresa, Postulacion
from app.models.evento import Evento, Inscripcion
from app.models.mensaje import Chat, ChatParticipante, Mensaje
from app.models.meta import Meta
from app.models.modulo import Modulo, TareaModulo
from app.models.progreso import ProgresoReto
from app.models.usuario import Usuario

__all__ = [
    "Base",
    "Usuario",
    "Meta",
    "Modulo",
    "TareaModulo",
    "ProgresoReto",
    "Publicacion",
    "Comentario",
    "Like",
    "Evento",
    "Inscripcion",
    "Empresa",
    "Empleo",
    "EmpleoGuardado",
    "Postulacion",
    "Chat",
    "ChatParticipante",
    "Mensaje",
]

"""Enums compartidos por modelos y schemas.
Los valores son strings literales que ya usa el frontend (frontend/src/types.ts),
así los schemas con alias camelCase no necesitan traducir nada.
"""
from enum import Enum


class Tono(str, Enum):
    rosa = "rosa"
    lavanda = "lavanda"
    salvia = "salvia"
    durazno = "durazno"
    cielo = "cielo"


class BuscaEmpleo(str, Enum):
    si = "si"
    no = "no"
    nose = "nose"


class PreferenciaEventos(str, Enum):
    virtual = "virtual"
    presencial = "presencial"
    ambos = "ambos"


class EventoModalidad(str, Enum):
    virtual = "virtual"
    presencial = "presencial"


class Jornada(str, Enum):
    tiempo_completo = "Tiempo completo"
    medio_tiempo = "Medio tiempo"


class EmpleoModalidad(str, Enum):
    presencial = "Presencial"
    remoto = "Remoto"
    hibrido = "Híbrido"


class TipoChat(str, Enum):
    amiga = "amiga"
    mentora = "mentora"
    grupo = "grupo"


class FotoEscena(str, Enum):
    actividad = "actividad"
    estudio = "estudio"

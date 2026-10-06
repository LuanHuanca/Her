from app.schemas.base import CamelModel


class InsigniaOut(CamelModel):
    nombre: str
    icono: str
    lograda: bool


class PersonaOut(CamelModel):
    nombre: str
    iniciales: str
    tono: str


class GanadoraSemanaOut(CamelModel):
    persona: PersonaOut
    detalle: str


class RecompensasOut(CamelModel):
    puntos: int
    racha: int
    insignias: list[InsigniaOut]
    ganadora_semana: GanadoraSemanaOut | None

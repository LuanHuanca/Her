from app.schemas.base import CamelModel
from app.schemas.recompensas import PersonaOut


class ChatOut(CamelModel):
    id: int
    persona: PersonaOut
    tipo: str
    ultimo: str
    hace: str
    no_leidos: int

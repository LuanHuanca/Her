from pydantic import Field

from app.schemas.base import CamelModel
from app.schemas.recompensas import PersonaOut


class FotoOut(CamelModel):
    descripcion: str
    escena: str


class ComentarioOut(CamelModel):
    id: int
    autora: PersonaOut
    hace: str
    texto: str


class PublicacionOut(CamelModel):
    id: int
    autora: PersonaOut
    hace: str
    etiqueta: str
    texto: str
    foto: FotoOut | None
    likes: int
    me_gusta: bool
    comentarios: list[ComentarioOut]


class PublicacionIn(CamelModel):
    texto: str = Field(min_length=1, max_length=2000)


class ComentarioIn(CamelModel):
    texto: str = Field(min_length=1, max_length=500)


class LikeOut(CamelModel):
    likes: int
    me_gusta: bool

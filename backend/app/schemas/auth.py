from pydantic import EmailStr, Field

from app.schemas.base import CamelModel
from app.schemas.perfil import PerfilBase, PerfilOut


class RegistroIn(PerfilBase):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class LoginIn(CamelModel):
    email: EmailStr
    password: str


class UsuarioOut(PerfilOut):
    id: int
    email: EmailStr
    tono: str
    rol: str
    activo: bool


class SesionOut(CamelModel):
    token: str
    usuario: UsuarioOut

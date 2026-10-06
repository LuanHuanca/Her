from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import get_current_user
from app.enums import Tono
from app.models import Meta, Modulo, ProgresoReto, Usuario
from app.schemas.auth import LoginIn, RegistroIn, SesionOut, UsuarioOut
from app.security import crear_token, hash_password, verify_password
from app.utils import iniciales

router = APIRouter(prefix="/auth", tags=["auth"])

_TONOS = list(Tono)


def _usuario_out(usuario: Usuario) -> UsuarioOut:
    return UsuarioOut.model_validate(usuario)


@router.post("/registro", response_model=SesionOut, status_code=status.HTTP_201_CREATED)
def registro(datos: RegistroIn, db: Session = Depends(get_db)) -> SesionOut:
    primer_modulo = db.query(Modulo).order_by(Modulo.numero).first()
    if primer_modulo is None:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "El catálogo de módulos no está sembrado todavía")

    usuario = Usuario(
        email=datos.email.lower(),
        password_hash=hash_password(datos.password),
        nombre=datos.nombre,
        fecha_nacimiento=datos.fecha_nacimiento,
        ciudad=datos.ciudad,
        ocupacion=datos.ocupacion,
        hijos=datos.hijos,
        busca_empleo=datos.busca_empleo,
        eventos=datos.eventos,
        tono=_TONOS[hash(datos.email) % len(_TONOS)],
    )
    db.add(usuario)
    try:
        db.flush()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Ya existe una cuenta con ese correo")

    db.add(Meta(usuario_id=usuario.id, objetivos=[], minutos_al_dia=15, horizonte_meses=6))
    db.add(ProgresoReto(usuario_id=usuario.id, modulo_id=primer_modulo.id, dia_actual=1, racha=0, puntos=0))
    db.commit()
    db.refresh(usuario)

    return SesionOut(token=crear_token(usuario.id), usuario=_usuario_out(usuario))


@router.post("/login", response_model=SesionOut)
def login(datos: LoginIn, db: Session = Depends(get_db)) -> SesionOut:
    error = HTTPException(status.HTTP_401_UNAUTHORIZED, "Correo o contraseña incorrectos")
    usuario = db.query(Usuario).filter(Usuario.email == datos.email.lower()).first()
    if usuario is None or not verify_password(datos.password, usuario.password_hash):
        raise error
    if not usuario.activo:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Esta cuenta fue desactivada")
    return SesionOut(token=crear_token(usuario.id), usuario=_usuario_out(usuario))


@router.get("/me", response_model=UsuarioOut)
def me(usuario: Usuario = Depends(get_current_user)) -> UsuarioOut:
    return _usuario_out(usuario)

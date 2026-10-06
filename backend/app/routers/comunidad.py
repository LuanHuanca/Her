from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.db import get_db
from app.deps import get_current_user
from app.models import Comentario, Like, Publicacion, Usuario
from app.schemas.comunidad import ComentarioIn, ComentarioOut, FotoOut, LikeOut, PublicacionIn, PublicacionOut
from app.schemas.recompensas import PersonaOut
from app.utils import hace, iniciales

router = APIRouter(prefix="/comunidad", tags=["comunidad"])


def _persona(usuario: Usuario) -> PersonaOut:
    return PersonaOut(nombre=usuario.nombre, iniciales=iniciales(usuario.nombre), tono=usuario.tono.value)


def _comentario_out(c: Comentario) -> ComentarioOut:
    return ComentarioOut(id=c.id, autora=_persona(c.autor), hace=hace(c.creado_en), texto=c.texto)


def _publicacion_out(p: Publicacion, usuario_id: int) -> PublicacionOut:
    foto = FotoOut(descripcion=p.foto_descripcion, escena=p.foto_escena.value) if p.foto_descripcion else None
    return PublicacionOut(
        id=p.id,
        autora=_persona(p.autor),
        hace=hace(p.creado_en),
        etiqueta=p.etiqueta,
        texto=p.texto,
        foto=foto,
        likes=len(p.likes),
        me_gusta=any(like.usuario_id == usuario_id for like in p.likes),
        comentarios=[_comentario_out(c) for c in p.comentarios],
    )


def _cargar_publicacion(db: Session, publicacion_id: int) -> Publicacion:
    p = (
        db.query(Publicacion)
        .options(joinedload(Publicacion.autor), joinedload(Publicacion.likes), joinedload(Publicacion.comentarios).joinedload(Comentario.autor))
        .filter(Publicacion.id == publicacion_id)
        .first()
    )
    if p is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Esta publicación ya no está disponible")
    return p


@router.get("/publicaciones", response_model=list[PublicacionOut])
def listar_publicaciones(usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)) -> list[PublicacionOut]:
    publicaciones = (
        db.query(Publicacion)
        .options(joinedload(Publicacion.autor), joinedload(Publicacion.likes), joinedload(Publicacion.comentarios).joinedload(Comentario.autor))
        .order_by(Publicacion.creado_en.desc())
        .all()
    )
    return [_publicacion_out(p, usuario.id) for p in publicaciones]


@router.post("/publicaciones", response_model=PublicacionOut, status_code=status.HTTP_201_CREATED)
def crear_publicacion(
    datos: PublicacionIn, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)
) -> PublicacionOut:
    publicacion = Publicacion(autor_id=usuario.id, etiqueta="Mi avance", texto=datos.texto)
    db.add(publicacion)
    db.commit()
    return _publicacion_out(_cargar_publicacion(db, publicacion.id), usuario.id)


@router.get("/publicaciones/{publicacion_id}", response_model=PublicacionOut)
def obtener_publicacion(
    publicacion_id: int, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)
) -> PublicacionOut:
    return _publicacion_out(_cargar_publicacion(db, publicacion_id), usuario.id)


@router.post("/publicaciones/{publicacion_id}/like", response_model=LikeOut)
def alternar_like(
    publicacion_id: int, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)
) -> LikeOut:
    publicacion = _cargar_publicacion(db, publicacion_id)
    existente = db.get(Like, {"usuario_id": usuario.id, "publicacion_id": publicacion_id})
    if existente:
        db.delete(existente)
    else:
        db.add(Like(usuario_id=usuario.id, publicacion_id=publicacion_id))
    db.commit()
    publicacion = _cargar_publicacion(db, publicacion_id)
    return LikeOut(likes=len(publicacion.likes), me_gusta=existente is None)


@router.post("/publicaciones/{publicacion_id}/comentarios", response_model=ComentarioOut, status_code=status.HTTP_201_CREATED)
def comentar(
    publicacion_id: int, datos: ComentarioIn, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)
) -> ComentarioOut:
    _cargar_publicacion(db, publicacion_id)  # 404 si no existe
    comentario = Comentario(publicacion_id=publicacion_id, autor_id=usuario.id, texto=datos.texto)
    db.add(comentario)
    db.commit()
    db.refresh(comentario)
    return _comentario_out(comentario)

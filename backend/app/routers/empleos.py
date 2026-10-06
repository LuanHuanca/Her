from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.db import get_db
from app.deps import get_current_user
from app.models import Empleo, EmpleoGuardado, Postulacion, Usuario
from app.schemas.empleos import EmpleoOut, GuardadoOut, PostularIn, PostulacionOut
from app.schemas.recompensas import PersonaOut
from app.utils import hace, iniciales

router = APIRouter(prefix="/empleos", tags=["empleos"])


def _empleo_out(e: Empleo, guardados: set[str], postuladas: set[str]) -> EmpleoOut:
    return EmpleoOut(
        id=e.id,
        puesto=e.puesto,
        empresa=PersonaOut(nombre=e.empresa.nombre, iniciales=e.empresa.iniciales, tono=e.empresa.tono.value),
        ciudad=e.ciudad,
        jornada=e.jornada.value,
        modalidad=e.modalidad.value,
        publica=PersonaOut(nombre=e.publicado_por.nombre, iniciales=iniciales(e.publicado_por.nombre), tono=e.publicado_por.tono.value),
        hace=hace(e.creado_en),
        descripcion=e.descripcion,
        requisitos=e.requisitos,
        coincidencias=e.coincidencias,
        guardado=e.id in guardados,
        postulada=e.id in postuladas,
    )


def _sets_usuario(db: Session, usuario_id: int) -> tuple[set[str], set[str]]:
    guardados = {g.empleo_id for g in db.query(EmpleoGuardado).filter(EmpleoGuardado.usuario_id == usuario_id).all()}
    postuladas = {p.empleo_id for p in db.query(Postulacion).filter(Postulacion.usuario_id == usuario_id).all()}
    return guardados, postuladas


@router.get("", response_model=list[EmpleoOut])
def listar_empleos(usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)) -> list[EmpleoOut]:
    empleos = (
        db.query(Empleo)
        .options(joinedload(Empleo.empresa), joinedload(Empleo.publicado_por))
        .order_by(Empleo.creado_en.desc())
        .all()
    )
    guardados, postuladas = _sets_usuario(db, usuario.id)
    return [_empleo_out(e, guardados, postuladas) for e in empleos]


@router.get("/{empleo_id}", response_model=EmpleoOut)
def obtener_empleo(empleo_id: str, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)) -> EmpleoOut:
    empleo = (
        db.query(Empleo)
        .options(joinedload(Empleo.empresa), joinedload(Empleo.publicado_por))
        .filter(Empleo.id == empleo_id)
        .first()
    )
    if empleo is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Esta oferta ya no está disponible")
    guardados, postuladas = _sets_usuario(db, usuario.id)
    return _empleo_out(empleo, guardados, postuladas)


@router.post("/{empleo_id}/guardado", response_model=GuardadoOut)
def alternar_guardado(empleo_id: str, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)) -> GuardadoOut:
    if db.get(Empleo, empleo_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Esta oferta ya no está disponible")
    existente = db.get(EmpleoGuardado, {"usuario_id": usuario.id, "empleo_id": empleo_id})
    if existente:
        db.delete(existente)
        db.commit()
        return GuardadoOut(guardado=False)
    db.add(EmpleoGuardado(usuario_id=usuario.id, empleo_id=empleo_id))
    db.commit()
    return GuardadoOut(guardado=True)


@router.post("/{empleo_id}/postular", response_model=PostulacionOut, status_code=status.HTTP_201_CREATED)
def postular(
    empleo_id: str, datos: PostularIn, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)
) -> PostulacionOut:
    if db.get(Empleo, empleo_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Esta oferta ya no está disponible")
    ya_postulada = (
        db.query(Postulacion).filter(Postulacion.usuario_id == usuario.id, Postulacion.empleo_id == empleo_id).first()
    )
    if ya_postulada is None:
        db.add(Postulacion(usuario_id=usuario.id, empleo_id=empleo_id, cv_nombre_archivo=datos.cv_nombre_archivo))
        db.commit()
    return PostulacionOut(postulada=True)

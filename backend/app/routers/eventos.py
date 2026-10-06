from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import get_current_user
from app.models import Evento, Inscripcion, Usuario
from app.schemas.eventos import EventoOut, InscripcionOut

router = APIRouter(prefix="/eventos", tags=["eventos"])


def _evento_out(e: Evento, inscritos: set[int]) -> EventoOut:
    return EventoOut(
        id=e.id,
        titulo=e.titulo,
        fecha=e.fecha,
        hora=e.hora,
        duracion_min=e.duracion_min,
        modalidad=e.modalidad.value,
        lugar=e.lugar,
        descripcion=e.descripcion,
        inscrita=e.id in inscritos,
    )


@router.get("", response_model=list[EventoOut])
def listar_eventos(usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)) -> list[EventoOut]:
    eventos = db.query(Evento).order_by(Evento.fecha).all()
    inscritos = {i.evento_id for i in db.query(Inscripcion).filter(Inscripcion.usuario_id == usuario.id).all()}
    return [_evento_out(e, inscritos) for e in eventos]


@router.post("/{evento_id}/inscripcion", response_model=InscripcionOut)
def alternar_inscripcion(
    evento_id: int, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)
) -> InscripcionOut:
    if db.get(Evento, evento_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Este evento ya no está disponible")
    existente = db.get(Inscripcion, {"usuario_id": usuario.id, "evento_id": evento_id})
    if existente:
        db.delete(existente)
        db.commit()
        return InscripcionOut(inscrita=False)
    db.add(Inscripcion(usuario_id=usuario.id, evento_id=evento_id))
    db.commit()
    return InscripcionOut(inscrita=True)

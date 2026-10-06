from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import get_current_user
from app.models import Evento, Inscripcion, Postulacion, ProgresoReto, Publicacion, Usuario
from app.schemas.recompensas import GanadoraSemanaOut, InsigniaOut, PersonaOut, RecompensasOut
from app.services.progreso import sincronizar_progreso
from app.utils import iniciales

router = APIRouter(prefix="/recompensas", tags=["recompensas"])


@router.get("", response_model=RecompensasOut)
def recompensas(usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)) -> RecompensasOut:
    progreso = sincronizar_progreso(db, usuario.progreso)

    publicaciones = db.query(func.count(Publicacion.id)).filter(Publicacion.autor_id == usuario.id).scalar()
    eventos_inscritos = db.query(func.count(Inscripcion.evento_id)).filter(Inscripcion.usuario_id == usuario.id).scalar()
    postulaciones = db.query(func.count(Postulacion.id)).filter(Postulacion.usuario_id == usuario.id).scalar()

    insignias = [
        InsigniaOut(nombre="Primer día", icono="check", lograda=progreso.dia_actual > 1 or progreso.completado_hoy),
        InsigniaOut(nombre="7 días seguidos", icono="retos", lograda=progreso.racha >= 7),
        InsigniaOut(nombre="Primera publicación", icono="mensaje", lograda=publicaciones > 0),
        InsigniaOut(nombre="Primer evento", icono="calendario", lograda=eventos_inscritos > 0),
        InsigniaOut(nombre="Primera postulación", icono="empleos", lograda=postulaciones > 0),
        InsigniaOut(nombre="Módulo completo", icono="trofeo", lograda=progreso.dia_actual >= 21 and progreso.completado_hoy),
    ]

    top = (
        db.query(Usuario, ProgresoReto)
        .join(ProgresoReto, ProgresoReto.usuario_id == Usuario.id)
        .order_by(ProgresoReto.racha.desc(), ProgresoReto.puntos.desc())
        .first()
    )
    ganadora = None
    if top:
        top_usuario, top_progreso = top
        ganadora = GanadoraSemanaOut(
            persona=PersonaOut(nombre=top_usuario.nombre, iniciales=iniciales(top_usuario.nombre), tono=top_usuario.tono.value),
            detalle=f"{top_progreso.racha} días seguidos · {top_progreso.puntos} pts en total",
        )

    return RecompensasOut(puntos=progreso.puntos, racha=progreso.racha, insignias=insignias, ganadora_semana=ganadora)

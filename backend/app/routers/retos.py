from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import get_current_user
from app.enums import FotoEscena
from app.models import Modulo, Publicacion, Usuario
from app.schemas.retos import CompletarRetoIn, ModuloEnRuta, RetoHoyOut, RutaOut, TareaOut
from app.services.progreso import sincronizar_progreso, tarea_de_hoy

router = APIRouter(prefix="/retos", tags=["retos"])


@router.get("", response_model=RutaOut)
def ruta(usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)) -> RutaOut:
    progreso = sincronizar_progreso(db, usuario.progreso)
    modulo_actual = db.get(Modulo, progreso.modulo_id)
    modulos = db.query(Modulo).order_by(Modulo.numero).all()

    salida: list[ModuloEnRuta] = []
    for m in modulos:
        if m.numero < modulo_actual.numero:
            estado = "completado"
            dias_hechos = None
        elif m.numero == modulo_actual.numero:
            estado = "actual"
            dias_hechos = progreso.dia_actual if progreso.completado_hoy else progreso.dia_actual - 1
        else:
            estado = "bloqueado"
            dias_hechos = None
        salida.append(
            ModuloEnRuta(id=m.id, numero=m.numero, titulo=m.titulo, corto=m.corto, descripcion=m.descripcion, estado=estado, dias_hechos=dias_hechos)
        )
    return RutaOut(racha=progreso.racha, modulos=salida)


@router.get("/hoy", response_model=RetoHoyOut)
def reto_de_hoy(usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)) -> RetoHoyOut:
    progreso = sincronizar_progreso(db, usuario.progreso)
    tarea = tarea_de_hoy(db, progreso)
    modulo = db.get(Modulo, progreso.modulo_id)
    return RetoHoyOut(
        dia=progreso.dia_actual,
        racha=progreso.racha,
        completado_hoy=progreso.completado_hoy,
        reflexion=progreso.reflexion_hoy,
        puntos_totales=progreso.puntos,
        modulo_corto=modulo.corto,
        tarea=TareaOut.model_validate(tarea),
    )


@router.post("/completar", response_model=RetoHoyOut)
def completar(
    datos: CompletarRetoIn, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)
) -> RetoHoyOut:
    progreso = sincronizar_progreso(db, usuario.progreso)
    if not progreso.completado_hoy:
        tarea = tarea_de_hoy(db, progreso)
        progreso.completado_hoy = True
        progreso.racha += 1
        progreso.puntos += tarea.puntos
        progreso.reflexion_hoy = datos.reflexion
        if datos.compartir:
            db.add(
                Publicacion(
                    autor_id=usuario.id,
                    etiqueta=f"Día {progreso.dia_actual}",
                    texto=datos.reflexion,
                    foto_descripcion=None,
                    foto_escena=None,
                )
            )
        db.commit()
        db.refresh(progreso)

    modulo = db.get(Modulo, progreso.modulo_id)
    tarea = tarea_de_hoy(db, progreso)
    return RetoHoyOut(
        dia=progreso.dia_actual,
        racha=progreso.racha,
        completado_hoy=progreso.completado_hoy,
        reflexion=progreso.reflexion_hoy,
        puntos_totales=progreso.puntos,
        modulo_corto=modulo.corto,
        tarea=TareaOut.model_validate(tarea),
    )

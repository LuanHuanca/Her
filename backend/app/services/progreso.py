"""Lógica del reto de 21 días: avance de día/módulo y corte de racha cuando pasa un día
sin abrir la tarea. Se llama de forma perezosa (al leer el progreso) en vez de con un cron,
así no depende de un scheduler dentro de los contenedores."""
from datetime import date

from sqlalchemy.orm import Session

from app.models import Modulo, ProgresoReto, TareaModulo


def _avanzar_dia(db: Session, progreso: ProgresoReto) -> None:
    if progreso.dia_actual >= 21:
        actual = db.get(Modulo, progreso.modulo_id)
        siguiente = (
            db.query(Modulo).filter(Modulo.numero > actual.numero).order_by(Modulo.numero).first()
        )
        if siguiente:
            progreso.modulo_id = siguiente.id
            progreso.dia_actual = 1
        # Si no hay siguiente módulo, se queda en el día 21 del último (ruta completa).
    else:
        progreso.dia_actual += 1


def sincronizar_progreso(db: Session, progreso: ProgresoReto) -> ProgresoReto:
    """Al abrir la app en un día nuevo: si ayer se completó la tarea, avanza al día
    siguiente; si no, corta la racha. Se guarda solo cuando cambia algo."""
    hoy = date.today()
    if progreso.actualizado_en >= hoy:
        return progreso

    dias_pasados = (hoy - progreso.actualizado_en).days
    if progreso.completado_hoy:
        _avanzar_dia(db, progreso)
        if dias_pasados > 1:
            # Completó el último día que abrió la app, pero luego faltaron días: la racha se corta igual.
            progreso.racha = 0
    else:
        progreso.racha = 0

    progreso.completado_hoy = False
    progreso.actualizado_en = hoy
    db.commit()
    db.refresh(progreso)
    return progreso


def tarea_de_hoy(db: Session, progreso: ProgresoReto) -> TareaModulo:
    return (
        db.query(TareaModulo)
        .filter(TareaModulo.modulo_id == progreso.modulo_id, TareaModulo.dia == progreso.dia_actual)
        .one()
    )

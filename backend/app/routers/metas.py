from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import get_current_user
from app.models import Usuario
from app.schemas.metas import MetasIn, MetasOut

router = APIRouter(prefix="/metas", tags=["metas"])


@router.get("", response_model=MetasOut)
def obtener_metas(usuario: Usuario = Depends(get_current_user)) -> MetasOut:
    return MetasOut.model_validate(usuario.meta)


@router.put("", response_model=MetasOut)
def actualizar_metas(
    datos: MetasIn, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)
) -> MetasOut:
    usuario.meta.objetivos = datos.objetivos
    usuario.meta.minutos_al_dia = datos.minutos_al_dia
    usuario.meta.horizonte_meses = datos.horizonte_meses
    db.commit()
    db.refresh(usuario.meta)
    return MetasOut.model_validate(usuario.meta)

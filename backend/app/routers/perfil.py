from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import get_current_user
from app.models import Usuario
from app.schemas.perfil import PerfilActualizar, PerfilOut

router = APIRouter(prefix="/perfil", tags=["perfil"])


@router.get("", response_model=PerfilOut)
def obtener_perfil(usuario: Usuario = Depends(get_current_user)) -> PerfilOut:
    return PerfilOut.model_validate(usuario)


@router.put("", response_model=PerfilOut)
def actualizar_perfil(
    datos: PerfilActualizar, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)
) -> PerfilOut:
    for campo, valor in datos.model_dump().items():
        setattr(usuario, campo, valor)
    db.commit()
    db.refresh(usuario)
    return PerfilOut.model_validate(usuario)

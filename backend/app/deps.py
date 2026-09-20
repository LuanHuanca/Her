from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Usuario
from app.security import decodificar_token

_bearer = HTTPBearer(auto_error=False)


def get_current_user(
    credenciales: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: Session = Depends(get_db),
) -> Usuario:
    error = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sesión inválida o expirada")
    if credenciales is None:
        raise error
    usuario_id = decodificar_token(credenciales.credentials)
    if usuario_id is None:
        raise error
    usuario = db.get(Usuario, usuario_id)
    if usuario is None:
        raise error
    return usuario

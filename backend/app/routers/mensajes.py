from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from app.db import get_db
from app.deps import get_current_user
from app.models import Chat, ChatParticipante, Usuario
from app.schemas.mensajes import ChatOut
from app.schemas.recompensas import PersonaOut
from app.utils import hace

router = APIRouter(prefix="/mensajes", tags=["mensajes"])


@router.get("", response_model=list[ChatOut])
def listar_chats(usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)) -> list[ChatOut]:
    filas = (
        db.query(ChatParticipante, Chat)
        .join(Chat, Chat.id == ChatParticipante.chat_id)
        .options(joinedload(ChatParticipante.chat).joinedload(Chat.mensajes))
        .filter(ChatParticipante.usuario_id == usuario.id)
        .all()
    )
    salida: list[ChatOut] = []
    for participante, chat in filas:
        ultimo_mensaje = chat.mensajes[-1] if chat.mensajes else None
        salida.append(
            ChatOut(
                id=chat.id,
                persona=PersonaOut(nombre=chat.otro_nombre, iniciales=chat.otro_iniciales, tono=chat.otro_tono.value),
                tipo=chat.tipo.value,
                ultimo=ultimo_mensaje.texto if ultimo_mensaje else "",
                hace=hace(ultimo_mensaje.creado_en) if ultimo_mensaje else "",
                no_leidos=participante.no_leidos,
            )
        )
    salida.sort(key=lambda c: c.id)
    return salida

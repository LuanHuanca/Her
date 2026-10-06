from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.enums import TipoChat, Tono


class Chat(Base):
    """Modela la conversación y, para simplificar (no existe pantalla de hilo en el
    frontend todavía), guarda directamente la identidad del otro lado (persona o grupo)
    que se muestra en la lista de Mensajes."""

    __tablename__ = "chats"

    id: Mapped[int] = mapped_column(primary_key=True)
    tipo: Mapped[TipoChat] = mapped_column(Enum(TipoChat, native_enum=False, values_callable=lambda e: [m.value for m in e]))
    otro_nombre: Mapped[str] = mapped_column(String(120))
    otro_iniciales: Mapped[str] = mapped_column(String(4))
    otro_tono: Mapped[Tono] = mapped_column(Enum(Tono, native_enum=False, values_callable=lambda e: [m.value for m in e]))

    mensajes: Mapped[list["Mensaje"]] = relationship(back_populates="chat", order_by="Mensaje.creado_en", cascade="all, delete-orphan")
    participantes: Mapped[list["ChatParticipante"]] = relationship(back_populates="chat", cascade="all, delete-orphan")


class ChatParticipante(Base):
    __tablename__ = "chat_participantes"

    chat_id: Mapped[int] = mapped_column(ForeignKey("chats.id", ondelete="CASCADE"), primary_key=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"), primary_key=True)
    no_leidos: Mapped[int] = mapped_column(Integer, default=0)

    chat: Mapped["Chat"] = relationship(back_populates="participantes")


class Mensaje(Base):
    __tablename__ = "mensajes"

    id: Mapped[int] = mapped_column(primary_key=True)
    chat_id: Mapped[int] = mapped_column(ForeignKey("chats.id", ondelete="CASCADE"))
    texto: Mapped[str] = mapped_column(String(1000))
    creado_en: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    chat: Mapped["Chat"] = relationship(back_populates="mensajes")

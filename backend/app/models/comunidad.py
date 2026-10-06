from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.enums import FotoEscena


class Publicacion(Base):
    __tablename__ = "publicaciones"

    id: Mapped[int] = mapped_column(primary_key=True)
    autor_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"))
    etiqueta: Mapped[str] = mapped_column(String(60))
    texto: Mapped[str] = mapped_column(String(2000))
    foto_descripcion: Mapped[str | None] = mapped_column(String(200), nullable=True)
    foto_escena: Mapped[FotoEscena | None] = mapped_column(
        Enum(FotoEscena, native_enum=False, values_callable=lambda e: [m.value for m in e]), nullable=True
    )
    creado_en: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    autor: Mapped["Usuario"] = relationship()
    comentarios: Mapped[list["Comentario"]] = relationship(
        back_populates="publicacion", order_by="Comentario.creado_en", cascade="all, delete-orphan"
    )
    likes: Mapped[list["Like"]] = relationship(back_populates="publicacion", cascade="all, delete-orphan")


class Comentario(Base):
    __tablename__ = "comentarios"

    id: Mapped[int] = mapped_column(primary_key=True)
    publicacion_id: Mapped[int] = mapped_column(ForeignKey("publicaciones.id", ondelete="CASCADE"))
    autor_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"))
    texto: Mapped[str] = mapped_column(String(500))
    creado_en: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    publicacion: Mapped["Publicacion"] = relationship(back_populates="comentarios")
    autor: Mapped["Usuario"] = relationship()


class Like(Base):
    __tablename__ = "likes"

    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"), primary_key=True)
    publicacion_id: Mapped[int] = mapped_column(ForeignKey("publicaciones.id", ondelete="CASCADE"), primary_key=True)
    creado_en: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    publicacion: Mapped["Publicacion"] = relationship(back_populates="likes")

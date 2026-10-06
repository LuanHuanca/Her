from datetime import date, datetime

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.enums import EventoModalidad


class Evento(Base):
    __tablename__ = "eventos"

    id: Mapped[int] = mapped_column(primary_key=True)
    titulo: Mapped[str] = mapped_column(String(160))
    fecha: Mapped[date] = mapped_column(Date)
    hora: Mapped[str] = mapped_column(String(5))
    duracion_min: Mapped[int] = mapped_column(Integer)
    modalidad: Mapped[EventoModalidad] = mapped_column(
        Enum(EventoModalidad, native_enum=False, values_callable=lambda e: [m.value for m in e])
    )
    lugar: Mapped[str] = mapped_column(String(120))
    descripcion: Mapped[str] = mapped_column(String(400))


class Inscripcion(Base):
    __tablename__ = "inscripciones"

    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"), primary_key=True)
    evento_id: Mapped[int] = mapped_column(ForeignKey("eventos.id", ondelete="CASCADE"), primary_key=True)
    creado_en: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

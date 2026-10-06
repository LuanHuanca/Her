from sqlalchemy import ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Modulo(Base):
    __tablename__ = "modulos"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    numero: Mapped[int] = mapped_column(Integer, unique=True)
    titulo: Mapped[str] = mapped_column(String(120))
    corto: Mapped[str] = mapped_column(String(60))
    descripcion: Mapped[str] = mapped_column(String(240))

    tareas: Mapped[list["TareaModulo"]] = relationship(back_populates="modulo", order_by="TareaModulo.dia")


class TareaModulo(Base):
    __tablename__ = "tareas_modulo"
    __table_args__ = (UniqueConstraint("modulo_id", "dia", name="uq_tarea_modulo_dia"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    modulo_id: Mapped[str] = mapped_column(ForeignKey("modulos.id", ondelete="CASCADE"))
    dia: Mapped[int] = mapped_column(Integer)

    titulo: Mapped[str] = mapped_column(String(160))
    frase: Mapped[str] = mapped_column(String(240))
    duracion_seg: Mapped[int] = mapped_column(Integer, default=300)
    minutos: Mapped[int] = mapped_column(Integer, default=10)
    puntos: Mapped[int] = mapped_column(Integer, default=50)
    texto: Mapped[list[str]] = mapped_column(ARRAY(String))
    consigna: Mapped[str] = mapped_column(String(240))

    modulo: Mapped["Modulo"] = relationship(back_populates="tareas")

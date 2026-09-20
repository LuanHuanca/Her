from datetime import date

from sqlalchemy import Boolean, Date, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class ProgresoReto(Base):
    """Progreso del reto de 21 días. Una fila por usuario (una sola ruta activa a la vez,
    igual que el prototipo original en useHerStore)."""

    __tablename__ = "progreso_retos"

    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"), primary_key=True)
    modulo_id: Mapped[str] = mapped_column(ForeignKey("modulos.id"))
    dia_actual: Mapped[int] = mapped_column(Integer, default=1)
    racha: Mapped[int] = mapped_column(Integer, default=0)
    completado_hoy: Mapped[bool] = mapped_column(Boolean, default=False)
    reflexion_hoy: Mapped[str] = mapped_column(String(2000), default="")
    puntos: Mapped[int] = mapped_column(Integer, default=0)
    actualizado_en: Mapped[date] = mapped_column(Date, server_default=func.current_date())

    usuario: Mapped["Usuario"] = relationship(back_populates="progreso")
    modulo: Mapped["Modulo"] = relationship()

from sqlalchemy import ForeignKey, Integer
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import String

from app.db import Base


class Meta(Base):
    __tablename__ = "metas"

    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"), primary_key=True)
    objetivos: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    minutos_al_dia: Mapped[int] = mapped_column(Integer, default=15)
    horizonte_meses: Mapped[int] = mapped_column(Integer, default=6)

    usuario: Mapped["Usuario"] = relationship(back_populates="meta")

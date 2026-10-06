from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.enums import BuscaEmpleo, PreferenciaEventos, Rol, Tono


def _enum(tipo):
    return Enum(tipo, native_enum=False, values_callable=lambda e: [m.value for m in e])


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))

    nombre: Mapped[str] = mapped_column(String(120))
    fecha_nacimiento: Mapped[date] = mapped_column(Date)
    ciudad: Mapped[str] = mapped_column(String(80))
    ocupacion: Mapped[str] = mapped_column(String(160), default="")
    hijos: Mapped[int] = mapped_column(Integer, default=1)
    busca_empleo: Mapped[BuscaEmpleo] = mapped_column(_enum(BuscaEmpleo), default=BuscaEmpleo.nose)
    # Nombrado igual que frontend/src/types.ts (Perfil.eventos) para que el CamelModel
    # de los schemas no necesite un alias especial.
    eventos: Mapped[PreferenciaEventos] = mapped_column(_enum(PreferenciaEventos), default=PreferenciaEventos.ambos)
    tono: Mapped[Tono] = mapped_column(_enum(Tono))

    rol: Mapped[Rol] = mapped_column(_enum(Rol), default=Rol.usuaria, server_default=Rol.usuaria.value)
    activo: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")

    creado_en: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    meta: Mapped["Meta"] = relationship(back_populates="usuario", uselist=False, cascade="all, delete-orphan")
    progreso: Mapped["ProgresoReto"] = relationship(back_populates="usuario", uselist=False, cascade="all, delete-orphan")

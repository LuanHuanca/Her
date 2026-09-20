from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.enums import EmpleoModalidad, Jornada, Tono


def _enum(tipo):
    return Enum(tipo, native_enum=False, values_callable=lambda e: [m.value for m in e])


class Empresa(Base):
    __tablename__ = "empresas"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120))
    iniciales: Mapped[str] = mapped_column(String(4))
    tono: Mapped[Tono] = mapped_column(_enum(Tono))


class Empleo(Base):
    __tablename__ = "empleos"

    id: Mapped[str] = mapped_column(String(60), primary_key=True)
    puesto: Mapped[str] = mapped_column(String(160))
    empresa_id: Mapped[int] = mapped_column(ForeignKey("empresas.id", ondelete="CASCADE"))
    ciudad: Mapped[str] = mapped_column(String(80))
    jornada: Mapped[Jornada] = mapped_column(_enum(Jornada))
    modalidad: Mapped[EmpleoModalidad] = mapped_column(_enum(EmpleoModalidad))
    publicado_por_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"))
    descripcion: Mapped[str] = mapped_column(String(1000))
    requisitos: Mapped[list[str]] = mapped_column(ARRAY(String))
    coincidencias: Mapped[list[str]] = mapped_column(ARRAY(String))
    creado_en: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    empresa: Mapped["Empresa"] = relationship()
    publicado_por: Mapped["Usuario"] = relationship()


class EmpleoGuardado(Base):
    __tablename__ = "empleos_guardados"

    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"), primary_key=True)
    empleo_id: Mapped[str] = mapped_column(ForeignKey("empleos.id", ondelete="CASCADE"), primary_key=True)
    creado_en: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Postulacion(Base):
    __tablename__ = "postulaciones"
    __table_args__ = (UniqueConstraint("usuario_id", "empleo_id", name="uq_postulacion_usuario_empleo"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"))
    empleo_id: Mapped[str] = mapped_column(ForeignKey("empleos.id", ondelete="CASCADE"))
    cv_nombre_archivo: Mapped[str] = mapped_column(String(200))
    creado_en: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

"""Panel de administración: usuarias/roles y todo el contenido que antes solo se
podía cambiar editando app/seed.py (módulos, tareas, eventos, empresas, empleos),
más moderación básica de la comunidad. Todo bajo /api/admin, protegido por
get_current_admin (requiere rol='admin' además de estar autenticada)."""
from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.db import get_db
from app.deps import get_current_admin
from app.enums import Rol, Tono
from app.models import (
    Comentario,
    Empleo,
    EmpleoGuardado,
    Empresa,
    Evento,
    Inscripcion,
    Modulo,
    Postulacion,
    ProgresoReto,
    Publicacion,
    TareaModulo,
    Usuario,
)
from app.schemas.admin import (
    ComentarioAdminOut,
    EmpleoAdminOut,
    EmpleoIn,
    EmpresaAdminOut,
    EmpresaIn,
    EventoAdminOut,
    EventoIn,
    ModuloAdminOut,
    ModuloIn,
    PublicacionAdminOut,
    ResumenOut,
    TareaAdminOut,
    TareaIn,
    UsuarioAdminActualizar,
    UsuarioAdminOut,
)
from app.utils import hace, iniciales, slugificar

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin)])

_TONOS = list(Tono)


def _tono_para(texto: str) -> Tono:
    return _TONOS[hash(texto) % len(_TONOS)]


def _slug_unico(db: Session, modelo, texto: str) -> str:
    base = slugificar(texto)
    slug = base
    sufijo = 2
    while db.get(modelo, slug) is not None:
        slug = f"{base}-{sufijo}"
        sufijo += 1
    return slug


# ── Usuarias y roles ─────────────────────────────────────────────────────
@router.get("/usuarios", response_model=list[UsuarioAdminOut])
def listar_usuarios(q: str = "", db: Session = Depends(get_db)) -> list[UsuarioAdminOut]:
    query = db.query(Usuario).order_by(Usuario.creado_en.desc())
    if q:
        patron = f"%{q.lower()}%"
        query = query.filter(func.lower(Usuario.nombre).like(patron) | func.lower(Usuario.email).like(patron))
    return [UsuarioAdminOut.model_validate(u) for u in query.all()]


def _es_ultima_admin(db: Session, usuario: Usuario) -> bool:
    if usuario.rol != Rol.admin:
        return False
    return db.query(func.count(Usuario.id)).filter(Usuario.rol == Rol.admin).scalar() <= 1


@router.patch("/usuarios/{usuario_id}", response_model=UsuarioAdminOut)
def actualizar_usuario(
    usuario_id: int, datos: UsuarioAdminActualizar, admin: Usuario = Depends(get_current_admin), db: Session = Depends(get_db)
) -> UsuarioAdminOut:
    usuario = db.get(Usuario, usuario_id)
    if usuario is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Esta usuaria ya no existe")

    if datos.rol is not None and datos.rol != Rol.admin and usuario.id == admin.id and _es_ultima_admin(db, usuario):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No puedes quitarte el rol de admin siendo la única")
    if datos.activo is False and usuario.id == admin.id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No puedes desactivar tu propia cuenta")

    if datos.rol is not None:
        usuario.rol = datos.rol
    if datos.activo is not None:
        usuario.activo = datos.activo
    db.commit()
    db.refresh(usuario)
    return UsuarioAdminOut.model_validate(usuario)


@router.delete("/usuarios/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_usuario(usuario_id: int, admin: Usuario = Depends(get_current_admin), db: Session = Depends(get_db)) -> None:
    if usuario_id == admin.id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No puedes eliminar tu propia cuenta")
    usuario = db.get(Usuario, usuario_id)
    if usuario is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Esta usuaria ya no existe")
    if _es_ultima_admin(db, usuario):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No puedes eliminar a la única administradora")
    db.delete(usuario)
    db.commit()


# ── Módulos ──────────────────────────────────────────────────────────────
@router.get("/modulos", response_model=list[ModuloAdminOut])
def listar_modulos(db: Session = Depends(get_db)) -> list[ModuloAdminOut]:
    modulos = db.query(Modulo).options(joinedload(Modulo.tareas)).order_by(Modulo.numero).all()
    return [
        ModuloAdminOut(id=m.id, numero=m.numero, titulo=m.titulo, corto=m.corto, descripcion=m.descripcion, total_tareas=len(m.tareas))
        for m in modulos
    ]


@router.post("/modulos", response_model=ModuloAdminOut, status_code=status.HTTP_201_CREATED)
def crear_modulo(datos: ModuloIn, db: Session = Depends(get_db)) -> ModuloAdminOut:
    if db.query(Modulo).filter(Modulo.numero == datos.numero).first():
        raise HTTPException(status.HTTP_409_CONFLICT, f"Ya existe un módulo con el número {datos.numero}")
    modulo = Modulo(id=_slug_unico(db, Modulo, datos.titulo), numero=datos.numero, titulo=datos.titulo, corto=datos.corto, descripcion=datos.descripcion)
    db.add(modulo)
    db.commit()
    return ModuloAdminOut(id=modulo.id, numero=modulo.numero, titulo=modulo.titulo, corto=modulo.corto, descripcion=modulo.descripcion, total_tareas=0)


@router.put("/modulos/{modulo_id}", response_model=ModuloAdminOut)
def actualizar_modulo(modulo_id: str, datos: ModuloIn, db: Session = Depends(get_db)) -> ModuloAdminOut:
    modulo = db.get(Modulo, modulo_id)
    if modulo is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Este módulo ya no existe")
    duplicado = db.query(Modulo).filter(Modulo.numero == datos.numero, Modulo.id != modulo_id).first()
    if duplicado:
        raise HTTPException(status.HTTP_409_CONFLICT, f"Ya existe un módulo con el número {datos.numero}")
    modulo.numero, modulo.titulo, modulo.corto, modulo.descripcion = datos.numero, datos.titulo, datos.corto, datos.descripcion
    db.commit()
    total = db.query(func.count(TareaModulo.id)).filter(TareaModulo.modulo_id == modulo_id).scalar()
    return ModuloAdminOut(id=modulo.id, numero=modulo.numero, titulo=modulo.titulo, corto=modulo.corto, descripcion=modulo.descripcion, total_tareas=total)


@router.delete("/modulos/{modulo_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_modulo(modulo_id: str, db: Session = Depends(get_db)) -> None:
    modulo = db.get(Modulo, modulo_id)
    if modulo is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Este módulo ya no existe")
    en_uso = db.query(func.count(ProgresoReto.usuario_id)).filter(ProgresoReto.modulo_id == modulo_id).scalar()
    if en_uso:
        raise HTTPException(status.HTTP_409_CONFLICT, f"{en_uso} usuaria(s) tienen su progreso en este módulo; no se puede eliminar")
    db.delete(modulo)
    db.commit()


# ── Tareas de un módulo ──────────────────────────────────────────────────
@router.get("/modulos/{modulo_id}/tareas", response_model=list[TareaAdminOut])
def listar_tareas(modulo_id: str, db: Session = Depends(get_db)) -> list[TareaAdminOut]:
    if db.get(Modulo, modulo_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Este módulo ya no existe")
    tareas = db.query(TareaModulo).filter(TareaModulo.modulo_id == modulo_id).order_by(TareaModulo.dia).all()
    return [TareaAdminOut.model_validate(t) for t in tareas]


@router.post("/modulos/{modulo_id}/tareas", response_model=TareaAdminOut, status_code=status.HTTP_201_CREATED)
def crear_tarea(modulo_id: str, datos: TareaIn, db: Session = Depends(get_db)) -> TareaAdminOut:
    if db.get(Modulo, modulo_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Este módulo ya no existe")
    if db.query(TareaModulo).filter(TareaModulo.modulo_id == modulo_id, TareaModulo.dia == datos.dia).first():
        raise HTTPException(status.HTTP_409_CONFLICT, f"Ya existe una tarea para el día {datos.dia} de este módulo")
    tarea = TareaModulo(modulo_id=modulo_id, **datos.model_dump())
    db.add(tarea)
    db.commit()
    db.refresh(tarea)
    return TareaAdminOut.model_validate(tarea)


@router.put("/tareas/{tarea_id}", response_model=TareaAdminOut)
def actualizar_tarea(tarea_id: int, datos: TareaIn, db: Session = Depends(get_db)) -> TareaAdminOut:
    tarea = db.get(TareaModulo, tarea_id)
    if tarea is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Esta tarea ya no existe")
    duplicada = db.query(TareaModulo).filter(TareaModulo.modulo_id == tarea.modulo_id, TareaModulo.dia == datos.dia, TareaModulo.id != tarea_id).first()
    if duplicada:
        raise HTTPException(status.HTTP_409_CONFLICT, f"Ya existe una tarea para el día {datos.dia} de este módulo")
    for campo, valor in datos.model_dump().items():
        setattr(tarea, campo, valor)
    db.commit()
    db.refresh(tarea)
    return TareaAdminOut.model_validate(tarea)


@router.delete("/tareas/{tarea_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_tarea(tarea_id: int, db: Session = Depends(get_db)) -> None:
    tarea = db.get(TareaModulo, tarea_id)
    if tarea is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Esta tarea ya no existe")
    db.delete(tarea)
    db.commit()


# ── Eventos ──────────────────────────────────────────────────────────────
@router.get("/eventos", response_model=list[EventoAdminOut])
def listar_eventos_admin(db: Session = Depends(get_db)) -> list[EventoAdminOut]:
    eventos = db.query(Evento).order_by(Evento.fecha).all()
    conteos = dict(db.query(Inscripcion.evento_id, func.count(Inscripcion.usuario_id)).group_by(Inscripcion.evento_id).all())
    return [
        EventoAdminOut(
            id=e.id, titulo=e.titulo, fecha=e.fecha, hora=e.hora, duracion_min=e.duracion_min,
            modalidad=e.modalidad.value, lugar=e.lugar, descripcion=e.descripcion, total_inscritas=conteos.get(e.id, 0),
        )
        for e in eventos
    ]


@router.post("/eventos", response_model=EventoAdminOut, status_code=status.HTTP_201_CREATED)
def crear_evento(datos: EventoIn, db: Session = Depends(get_db)) -> EventoAdminOut:
    evento = Evento(**datos.model_dump())
    db.add(evento)
    db.commit()
    db.refresh(evento)
    return EventoAdminOut(
        id=evento.id, titulo=evento.titulo, fecha=evento.fecha, hora=evento.hora, duracion_min=evento.duracion_min,
        modalidad=evento.modalidad.value, lugar=evento.lugar, descripcion=evento.descripcion, total_inscritas=0,
    )


@router.put("/eventos/{evento_id}", response_model=EventoAdminOut)
def actualizar_evento(evento_id: int, datos: EventoIn, db: Session = Depends(get_db)) -> EventoAdminOut:
    evento = db.get(Evento, evento_id)
    if evento is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Este evento ya no existe")
    for campo, valor in datos.model_dump().items():
        setattr(evento, campo, valor)
    db.commit()
    total = db.query(func.count(Inscripcion.usuario_id)).filter(Inscripcion.evento_id == evento_id).scalar()
    return EventoAdminOut(
        id=evento.id, titulo=evento.titulo, fecha=evento.fecha, hora=evento.hora, duracion_min=evento.duracion_min,
        modalidad=evento.modalidad.value, lugar=evento.lugar, descripcion=evento.descripcion, total_inscritas=total,
    )


@router.delete("/eventos/{evento_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_evento(evento_id: int, db: Session = Depends(get_db)) -> None:
    evento = db.get(Evento, evento_id)
    if evento is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Este evento ya no existe")
    db.delete(evento)
    db.commit()


# ── Empresas ─────────────────────────────────────────────────────────────
@router.get("/empresas", response_model=list[EmpresaAdminOut])
def listar_empresas(db: Session = Depends(get_db)) -> list[EmpresaAdminOut]:
    empresas = db.query(Empresa).order_by(Empresa.nombre).all()
    conteos = dict(db.query(Empleo.empresa_id, func.count(Empleo.id)).group_by(Empleo.empresa_id).all())
    return [
        EmpresaAdminOut(id=e.id, nombre=e.nombre, iniciales=e.iniciales, tono=e.tono.value, total_empleos=conteos.get(e.id, 0))
        for e in empresas
    ]


@router.post("/empresas", response_model=EmpresaAdminOut, status_code=status.HTTP_201_CREATED)
def crear_empresa(datos: EmpresaIn, db: Session = Depends(get_db)) -> EmpresaAdminOut:
    empresa = Empresa(nombre=datos.nombre, iniciales=iniciales(datos.nombre), tono=_tono_para(datos.nombre))
    db.add(empresa)
    db.commit()
    db.refresh(empresa)
    return EmpresaAdminOut(id=empresa.id, nombre=empresa.nombre, iniciales=empresa.iniciales, tono=empresa.tono.value, total_empleos=0)


@router.delete("/empresas/{empresa_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_empresa(empresa_id: int, db: Session = Depends(get_db)) -> None:
    empresa = db.get(Empresa, empresa_id)
    if empresa is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Esta empresa ya no existe")
    en_uso = db.query(func.count(Empleo.id)).filter(Empleo.empresa_id == empresa_id).scalar()
    if en_uso:
        raise HTTPException(status.HTTP_409_CONFLICT, f"Esta empresa tiene {en_uso} empleo(s) publicado(s); elimínalos primero")
    db.delete(empresa)
    db.commit()


# ── Empleos ──────────────────────────────────────────────────────────────
def _empleo_admin_out(db: Session, e: Empleo) -> EmpleoAdminOut:
    postulaciones = db.query(func.count(Postulacion.id)).filter(Postulacion.empleo_id == e.id).scalar()
    guardados = db.query(func.count(EmpleoGuardado.empleo_id)).filter(EmpleoGuardado.empleo_id == e.id).scalar()
    return EmpleoAdminOut(
        id=e.id, puesto=e.puesto, empresa_id=e.empresa_id, empresa_nombre=e.empresa.nombre, ciudad=e.ciudad,
        jornada=e.jornada.value, modalidad=e.modalidad.value, descripcion=e.descripcion, requisitos=e.requisitos,
        coincidencias=e.coincidencias, total_postulaciones=postulaciones, total_guardados=guardados,
    )


@router.get("/empleos", response_model=list[EmpleoAdminOut])
def listar_empleos_admin(db: Session = Depends(get_db)) -> list[EmpleoAdminOut]:
    empleos = db.query(Empleo).options(joinedload(Empleo.empresa)).order_by(Empleo.creado_en.desc()).all()
    return [_empleo_admin_out(db, e) for e in empleos]


@router.post("/empleos", response_model=EmpleoAdminOut, status_code=status.HTTP_201_CREATED)
def crear_empleo(datos: EmpleoIn, admin: Usuario = Depends(get_current_admin), db: Session = Depends(get_db)) -> EmpleoAdminOut:
    if db.get(Empresa, datos.empresa_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Esa empresa ya no existe")
    empleo = Empleo(id=_slug_unico(db, Empleo, datos.puesto), publicado_por_id=admin.id, **datos.model_dump())
    db.add(empleo)
    db.commit()
    empleo = db.get(Empleo, empleo.id)
    return _empleo_admin_out(db, empleo)


@router.put("/empleos/{empleo_id}", response_model=EmpleoAdminOut)
def actualizar_empleo(empleo_id: str, datos: EmpleoIn, db: Session = Depends(get_db)) -> EmpleoAdminOut:
    empleo = db.get(Empleo, empleo_id)
    if empleo is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Esta oferta ya no existe")
    if db.get(Empresa, datos.empresa_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Esa empresa ya no existe")
    for campo, valor in datos.model_dump().items():
        setattr(empleo, campo, valor)
    db.commit()
    db.refresh(empleo)
    return _empleo_admin_out(db, empleo)


@router.delete("/empleos/{empleo_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_empleo(empleo_id: str, db: Session = Depends(get_db)) -> None:
    empleo = db.get(Empleo, empleo_id)
    if empleo is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Esta oferta ya no existe")
    db.delete(empleo)
    db.commit()


# ── Comunidad (moderación) ───────────────────────────────────────────────
@router.get("/comunidad/publicaciones", response_model=list[PublicacionAdminOut])
def listar_publicaciones_admin(db: Session = Depends(get_db)) -> list[PublicacionAdminOut]:
    publicaciones = (
        db.query(Publicacion)
        .options(joinedload(Publicacion.autor), joinedload(Publicacion.comentarios), joinedload(Publicacion.likes))
        .order_by(Publicacion.creado_en.desc())
        .all()
    )
    return [
        PublicacionAdminOut(
            id=p.id, autora_nombre=p.autor.nombre, hace=hace(p.creado_en), etiqueta=p.etiqueta, texto=p.texto,
            likes=len(p.likes), total_comentarios=len(p.comentarios),
        )
        for p in publicaciones
    ]


@router.get("/comunidad/publicaciones/{publicacion_id}/comentarios", response_model=list[ComentarioAdminOut])
def listar_comentarios_admin(publicacion_id: int, db: Session = Depends(get_db)) -> list[ComentarioAdminOut]:
    comentarios = (
        db.query(Comentario)
        .options(joinedload(Comentario.autor))
        .filter(Comentario.publicacion_id == publicacion_id)
        .order_by(Comentario.creado_en)
        .all()
    )
    return [ComentarioAdminOut(id=c.id, autora_nombre=c.autor.nombre, hace=hace(c.creado_en), texto=c.texto) for c in comentarios]


@router.delete("/comunidad/publicaciones/{publicacion_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_publicacion_admin(publicacion_id: int, db: Session = Depends(get_db)) -> None:
    publicacion = db.get(Publicacion, publicacion_id)
    if publicacion is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Esta publicación ya no existe")
    db.delete(publicacion)
    db.commit()


@router.delete("/comunidad/comentarios/{comentario_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_comentario_admin(comentario_id: int, db: Session = Depends(get_db)) -> None:
    comentario = db.get(Comentario, comentario_id)
    if comentario is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Este comentario ya no existe")
    db.delete(comentario)
    db.commit()


# ── Panel / resumen ──────────────────────────────────────────────────────
@router.get("/resumen", response_model=ResumenOut)
def resumen(db: Session = Depends(get_db)) -> ResumenOut:
    hoy = date.today()
    return ResumenOut(
        total_usuarias=db.query(func.count(Usuario.id)).filter(Usuario.rol == Rol.usuaria).scalar(),
        total_admins=db.query(func.count(Usuario.id)).filter(Usuario.rol == Rol.admin).scalar(),
        usuarias_activas_hoy=db.query(func.count(ProgresoReto.usuario_id)).filter(ProgresoReto.actualizado_en == hoy, ProgresoReto.completado_hoy.is_(True)).scalar(),
        total_publicaciones=db.query(func.count(Publicacion.id)).scalar(),
        total_empleos=db.query(func.count(Empleo.id)).scalar(),
        total_postulaciones=db.query(func.count(Postulacion.id)).scalar(),
        eventos_proximos=db.query(func.count(Evento.id)).filter(Evento.fecha >= hoy, Evento.fecha <= hoy + timedelta(days=30)).scalar(),
    )

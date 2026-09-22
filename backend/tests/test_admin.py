from fastapi.testclient import TestClient


# ── Acceso ───────────────────────────────────────────────────────────────
def test_admin_requiere_sesion(client: TestClient):
    assert client.get("/api/admin/resumen").status_code == 401


def test_admin_rechaza_usuaria_normal(client: TestClient, auth_headers: dict):
    assert client.get("/api/admin/resumen", headers=auth_headers).status_code == 403
    assert client.get("/api/admin/usuarios", headers=auth_headers).status_code == 403


def test_admin_login_y_resumen(client: TestClient, admin_headers: dict):
    respuesta = client.get("/api/admin/resumen", headers=admin_headers)
    assert respuesta.status_code == 200
    cuerpo = respuesta.json()
    assert cuerpo["totalAdmins"] >= 1
    assert cuerpo["totalUsuarias"] >= 1


# ── Usuarias y roles ─────────────────────────────────────────────────────
def test_listar_usuarios_admin(client: TestClient, admin_headers: dict, auth_headers: dict):
    respuesta = client.get("/api/admin/usuarios", headers=admin_headers)
    assert respuesta.status_code == 200
    assert len(respuesta.json()) >= 2


def test_cambiar_rol_y_desactivar_usuaria(client: TestClient, admin_headers: dict, token: str, email_unico: str):
    perfil = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"}).json()
    usuario_id = perfil["id"]

    subir_a_admin = client.patch(f"/api/admin/usuarios/{usuario_id}", json={"rol": "admin"}, headers=admin_headers)
    assert subir_a_admin.status_code == 200
    assert subir_a_admin.json()["rol"] == "admin"

    desactivar = client.patch(f"/api/admin/usuarios/{usuario_id}", json={"activo": False}, headers=admin_headers)
    assert desactivar.status_code == 200
    assert desactivar.json()["activo"] is False

    login_bloqueado = client.post("/api/auth/login", json={"email": email_unico, "password": "Contrasena123"})
    assert login_bloqueado.status_code == 403


def test_admin_no_puede_desactivarse_a_si_misma(client: TestClient, admin_headers: dict):
    yo = client.get("/api/auth/me", headers=admin_headers).json()
    respuesta = client.patch(f"/api/admin/usuarios/{yo['id']}", json={"activo": False}, headers=admin_headers)
    assert respuesta.status_code == 400


def test_admin_no_puede_eliminarse_a_si_misma(client: TestClient, admin_headers: dict):
    yo = client.get("/api/auth/me", headers=admin_headers).json()
    respuesta = client.delete(f"/api/admin/usuarios/{yo['id']}", headers=admin_headers)
    assert respuesta.status_code == 400


def test_eliminar_usuaria(client: TestClient, admin_headers: dict, token: str):
    perfil = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"}).json()
    respuesta = client.delete(f"/api/admin/usuarios/{perfil['id']}", headers=admin_headers)
    assert respuesta.status_code == 204
    assert client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"}).status_code == 401


# ── Módulos y tareas ─────────────────────────────────────────────────────
def test_crear_editar_y_eliminar_modulo_con_tareas(client: TestClient, admin_headers: dict):
    creado = client.post(
        "/api/admin/modulos",
        json={"numero": 99, "titulo": "Módulo de prueba", "corto": "Prueba", "descripcion": "Un módulo temporal"},
        headers=admin_headers,
    )
    assert creado.status_code == 201
    modulo = creado.json()
    assert modulo["totalTareas"] == 0

    duplicado = client.post(
        "/api/admin/modulos",
        json={"numero": 99, "titulo": "Otro", "corto": "Otro", "descripcion": "desc"},
        headers=admin_headers,
    )
    assert duplicado.status_code == 409

    tarea = client.post(
        f"/api/admin/modulos/{modulo['id']}/tareas",
        json={"dia": 1, "titulo": "Tarea 1", "frase": "Frase", "duracionSeg": 300, "minutos": 10, "puntos": 50, "texto": ["parrafo"], "consigna": "Haz algo"},
        headers=admin_headers,
    )
    assert tarea.status_code == 201

    tarea_duplicada = client.post(
        f"/api/admin/modulos/{modulo['id']}/tareas",
        json={"dia": 1, "titulo": "Otra", "frase": "F", "duracionSeg": 300, "minutos": 10, "puntos": 50, "texto": ["p"], "consigna": "Otra consigna"},
        headers=admin_headers,
    )
    assert tarea_duplicada.status_code == 409

    editado = client.put(
        f"/api/admin/modulos/{modulo['id']}",
        json={"numero": 99, "titulo": "Módulo editado", "corto": "Editado", "descripcion": "desc editada"},
        headers=admin_headers,
    )
    assert editado.status_code == 200
    assert editado.json()["titulo"] == "Módulo editado"
    assert editado.json()["totalTareas"] == 1

    eliminar_tarea = client.delete(f"/api/admin/tareas/{tarea.json()['id']}", headers=admin_headers)
    assert eliminar_tarea.status_code == 204

    eliminar_modulo = client.delete(f"/api/admin/modulos/{modulo['id']}", headers=admin_headers)
    assert eliminar_modulo.status_code == 204


# ── Eventos ──────────────────────────────────────────────────────────────
def test_crear_editar_y_eliminar_evento(client: TestClient, admin_headers: dict):
    creado = client.post(
        "/api/admin/eventos",
        json={"titulo": "Evento de prueba", "fecha": "2027-01-01", "hora": "18:00", "duracionMin": 30, "modalidad": "virtual", "lugar": "Zoom", "descripcion": "desc"},
        headers=admin_headers,
    )
    assert creado.status_code == 201
    evento_id = creado.json()["id"]

    editado = client.put(
        f"/api/admin/eventos/{evento_id}",
        json={"titulo": "Evento editado", "fecha": "2027-01-02", "hora": "19:00", "duracionMin": 45, "modalidad": "presencial", "lugar": "La Paz", "descripcion": "otra desc"},
        headers=admin_headers,
    )
    assert editado.status_code == 200
    assert editado.json()["titulo"] == "Evento editado"

    assert client.delete(f"/api/admin/eventos/{evento_id}", headers=admin_headers).status_code == 204


# ── Empresas y empleos ───────────────────────────────────────────────────
def test_crear_empresa_empleo_y_bloquear_borrado_de_empresa_en_uso(client: TestClient, admin_headers: dict):
    empresa = client.post("/api/admin/empresas", json={"nombre": "Empresa de Prueba"}, headers=admin_headers)
    assert empresa.status_code == 201
    empresa_id = empresa.json()["id"]

    empleo = client.post(
        "/api/admin/empleos",
        json={
            "puesto": "Puesto de prueba", "empresaId": empresa_id, "ciudad": "Cochabamba",
            "jornada": "Tiempo completo", "modalidad": "Remoto", "descripcion": "desc",
            "requisitos": ["Req 1"], "coincidencias": ["Coincide 1"],
        },
        headers=admin_headers,
    )
    assert empleo.status_code == 201
    empleo_id = empleo.json()["id"]

    bloqueado = client.delete(f"/api/admin/empresas/{empresa_id}", headers=admin_headers)
    assert bloqueado.status_code == 409

    editado = client.put(
        f"/api/admin/empleos/{empleo_id}",
        json={
            "puesto": "Puesto editado", "empresaId": empresa_id, "ciudad": "La Paz",
            "jornada": "Medio tiempo", "modalidad": "Híbrido", "descripcion": "desc editada",
            "requisitos": [], "coincidencias": [],
        },
        headers=admin_headers,
    )
    assert editado.status_code == 200
    assert editado.json()["puesto"] == "Puesto editado"

    assert client.delete(f"/api/admin/empleos/{empleo_id}", headers=admin_headers).status_code == 204
    assert client.delete(f"/api/admin/empresas/{empresa_id}", headers=admin_headers).status_code == 204


# ── Moderación de comunidad ──────────────────────────────────────────────
def test_moderar_publicacion_y_comentario(client: TestClient, admin_headers: dict, auth_headers: dict):
    publicacion = client.post("/api/comunidad/publicaciones", json={"texto": "Publicación a moderar"}, headers=auth_headers).json()
    comentario = client.post(
        f"/api/comunidad/publicaciones/{publicacion['id']}/comentarios", json={"texto": "Comentario a moderar"}, headers=auth_headers
    ).json()

    listado = client.get("/api/admin/comunidad/publicaciones", headers=admin_headers)
    assert listado.status_code == 200
    assert any(p["id"] == publicacion["id"] for p in listado.json())

    comentarios = client.get(f"/api/admin/comunidad/publicaciones/{publicacion['id']}/comentarios", headers=admin_headers)
    assert comentarios.status_code == 200
    assert any(c["id"] == comentario["id"] for c in comentarios.json())

    assert client.delete(f"/api/admin/comunidad/comentarios/{comentario['id']}", headers=admin_headers).status_code == 204
    assert client.delete(f"/api/admin/comunidad/publicaciones/{publicacion['id']}", headers=admin_headers).status_code == 204

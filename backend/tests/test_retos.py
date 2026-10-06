from fastapi.testclient import TestClient


def test_retos_hoy_empieza_en_dia_1(client: TestClient, auth_headers: dict):
    respuesta = client.get("/api/retos/hoy", headers=auth_headers)
    assert respuesta.status_code == 200
    cuerpo = respuesta.json()
    assert cuerpo["dia"] == 1
    assert cuerpo["racha"] == 0
    assert cuerpo["completadoHoy"] is False
    assert cuerpo["tarea"]["consigna"]


def test_ruta_marca_el_primer_modulo_como_actual(client: TestClient, auth_headers: dict):
    respuesta = client.get("/api/retos", headers=auth_headers)
    assert respuesta.status_code == 200
    cuerpo = respuesta.json()
    assert cuerpo["modulos"][0]["estado"] == "actual"
    assert all(m["estado"] == "bloqueado" for m in cuerpo["modulos"][1:])


def test_completar_reto_suma_puntos_una_sola_vez(client: TestClient, auth_headers: dict):
    antes = client.get("/api/retos/hoy", headers=auth_headers).json()

    primera = client.post(
        "/api/retos/completar", json={"reflexion": "Hoy aprendi algo nuevo", "compartir": False}, headers=auth_headers
    )
    assert primera.status_code == 200
    despues_primera = primera.json()
    assert despues_primera["completadoHoy"] is True
    assert despues_primera["racha"] == antes["racha"] + 1
    assert despues_primera["puntosTotales"] == antes["puntosTotales"] + antes["tarea"]["puntos"]

    segunda = client.post(
        "/api/retos/completar", json={"reflexion": "otro intento", "compartir": False}, headers=auth_headers
    )
    assert segunda.status_code == 200
    despues_segunda = segunda.json()
    assert despues_segunda["puntosTotales"] == despues_primera["puntosTotales"]
    assert despues_segunda["racha"] == despues_primera["racha"]
    # La reflexión no cambia porque el día ya estaba completado.
    assert despues_segunda["reflexion"] == "Hoy aprendi algo nuevo"


def test_completar_reto_compartir_crea_publicacion(client: TestClient, auth_headers: dict):
    client.post(
        "/api/retos/completar",
        json={"reflexion": "Comparto mi avance del dia", "compartir": True},
        headers=auth_headers,
    )
    publicaciones = client.get("/api/comunidad/publicaciones", headers=auth_headers).json()
    assert any(p["texto"] == "Comparto mi avance del dia" for p in publicaciones)


def test_completar_reto_requiere_reflexion(client: TestClient, auth_headers: dict):
    respuesta = client.post("/api/retos/completar", json={"reflexion": "", "compartir": False}, headers=auth_headers)
    assert respuesta.status_code == 422


def test_recompensas_refleja_el_progreso(client: TestClient, auth_headers: dict):
    client.post("/api/retos/completar", json={"reflexion": "listo", "compartir": False}, headers=auth_headers)
    respuesta = client.get("/api/recompensas", headers=auth_headers)
    assert respuesta.status_code == 200
    cuerpo = respuesta.json()
    insignia_primer_dia = next(i for i in cuerpo["insignias"] if i["nombre"] == "Primer día")
    assert insignia_primer_dia["lograda"] is True

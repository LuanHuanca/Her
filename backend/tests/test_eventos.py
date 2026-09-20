from fastapi.testclient import TestClient


def test_listar_eventos_devuelve_los_sembrados(client: TestClient, auth_headers: dict):
    respuesta = client.get("/api/eventos", headers=auth_headers)
    assert respuesta.status_code == 200
    eventos = respuesta.json()
    assert len(eventos) >= 5
    assert all("fecha" in e and "inscrita" in e for e in eventos)


def test_alternar_inscripcion_es_un_toggle(client: TestClient, auth_headers: dict):
    evento_id = client.get("/api/eventos", headers=auth_headers).json()[0]["id"]

    primero = client.post(f"/api/eventos/{evento_id}/inscripcion", headers=auth_headers)
    assert primero.status_code == 200
    inscrita = primero.json()["inscrita"]

    segundo = client.post(f"/api/eventos/{evento_id}/inscripcion", headers=auth_headers)
    assert segundo.json()["inscrita"] is not inscrita

    listado = client.get("/api/eventos", headers=auth_headers).json()
    evento = next(e for e in listado if e["id"] == evento_id)
    assert evento["inscrita"] == segundo.json()["inscrita"]


def test_evento_inexistente_da_404(client: TestClient, auth_headers: dict):
    assert client.post("/api/eventos/999999999/inscripcion", headers=auth_headers).status_code == 404

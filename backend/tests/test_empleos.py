from fastapi.testclient import TestClient

EMPLEO_SEMBRADO = "ejecutiva-ventas"


def test_listar_empleos_incluye_los_sembrados(client: TestClient, auth_headers: dict):
    respuesta = client.get("/api/empleos", headers=auth_headers)
    assert respuesta.status_code == 200
    ids = [e["id"] for e in respuesta.json()]
    assert EMPLEO_SEMBRADO in ids


def test_empleo_inexistente_da_404(client: TestClient, auth_headers: dict):
    assert client.get("/api/empleos/no-existe", headers=auth_headers).status_code == 404


def test_alternar_guardado_es_un_toggle(client: TestClient, auth_headers: dict):
    primero = client.post(f"/api/empleos/{EMPLEO_SEMBRADO}/guardado", headers=auth_headers)
    assert primero.status_code == 200
    estado_inicial = primero.json()["guardado"]

    segundo = client.post(f"/api/empleos/{EMPLEO_SEMBRADO}/guardado", headers=auth_headers)
    assert segundo.json()["guardado"] is not estado_inicial


def test_postular_requiere_nombre_de_cv(client: TestClient, auth_headers: dict):
    respuesta = client.post(f"/api/empleos/{EMPLEO_SEMBRADO}/postular", json={"cvNombreArchivo": ""}, headers=auth_headers)
    assert respuesta.status_code == 422


def test_postular_y_reintentar_no_duplica(client: TestClient, auth_headers: dict):
    primera = client.post(
        f"/api/empleos/{EMPLEO_SEMBRADO}/postular", json={"cvNombreArchivo": "cv.pdf"}, headers=auth_headers
    )
    assert primera.status_code == 201
    assert primera.json() == {"postulada": True}

    segunda = client.post(
        f"/api/empleos/{EMPLEO_SEMBRADO}/postular", json={"cvNombreArchivo": "cv.pdf"}, headers=auth_headers
    )
    assert segunda.status_code == 201

    detalle = client.get(f"/api/empleos/{EMPLEO_SEMBRADO}", headers=auth_headers).json()
    assert detalle["postulada"] is True

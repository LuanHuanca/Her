from fastapi.testclient import TestClient


def test_crear_publicacion_y_comentar(client: TestClient, auth_headers: dict):
    creada = client.post("/api/comunidad/publicaciones", json={"texto": "Mi primer avance"}, headers=auth_headers)
    assert creada.status_code == 201
    publicacion = creada.json()
    assert publicacion["texto"] == "Mi primer avance"
    assert publicacion["likes"] == 0
    assert publicacion["comentarios"] == []

    comentario = client.post(
        f"/api/comunidad/publicaciones/{publicacion['id']}/comentarios",
        json={"texto": "¡Vamos!"},
        headers=auth_headers,
    )
    assert comentario.status_code == 201
    assert comentario.json()["texto"] == "¡Vamos!"

    detalle = client.get(f"/api/comunidad/publicaciones/{publicacion['id']}", headers=auth_headers)
    assert len(detalle.json()["comentarios"]) == 1


def test_alternar_like_es_un_toggle(client: TestClient, auth_headers: dict):
    publicacion = client.post("/api/comunidad/publicaciones", json={"texto": "Like me"}, headers=auth_headers).json()

    primero = client.post(f"/api/comunidad/publicaciones/{publicacion['id']}/like", headers=auth_headers).json()
    assert primero == {"likes": 1, "meGusta": True}

    segundo = client.post(f"/api/comunidad/publicaciones/{publicacion['id']}/like", headers=auth_headers).json()
    assert segundo == {"likes": 0, "meGusta": False}


def test_publicacion_inexistente_da_404(client: TestClient, auth_headers: dict):
    respuesta = client.get("/api/comunidad/publicaciones/999999999", headers=auth_headers)
    assert respuesta.status_code == 404


def test_comunidad_requiere_sesion(client: TestClient):
    assert client.get("/api/comunidad/publicaciones").status_code == 401

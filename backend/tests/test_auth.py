from fastapi.testclient import TestClient

from tests.conftest import payload_registro


def test_registro_crea_cuenta_y_devuelve_token(client: TestClient, email_unico: str):
    respuesta = client.post("/api/auth/registro", json=payload_registro(email_unico))
    assert respuesta.status_code == 201
    cuerpo = respuesta.json()
    assert cuerpo["token"]
    assert cuerpo["usuario"]["email"] == email_unico
    assert cuerpo["usuario"]["nombre"] == "Usuaria de Prueba"
    assert "id" in cuerpo["usuario"]


def test_registro_rechaza_email_duplicado(client: TestClient, email_unico: str):
    primero = client.post("/api/auth/registro", json=payload_registro(email_unico))
    assert primero.status_code == 201

    segundo = client.post("/api/auth/registro", json=payload_registro(email_unico))
    assert segundo.status_code == 409


def test_registro_rechaza_password_corto(client: TestClient, email_unico: str):
    respuesta = client.post("/api/auth/registro", json=payload_registro(email_unico, password="1234567"))
    assert respuesta.status_code == 422


def test_registro_rechaza_ciudad_invalida(client: TestClient, email_unico: str):
    respuesta = client.post("/api/auth/registro", json=payload_registro(email_unico, ciudad="Marte"))
    assert respuesta.status_code == 422


def test_registro_rechaza_menor_de_13_anios(client: TestClient, email_unico: str):
    respuesta = client.post("/api/auth/registro", json=payload_registro(email_unico, fechaNacimiento="2020-01-01"))
    assert respuesta.status_code == 422


def test_login_con_credenciales_correctas(client: TestClient, email_unico: str):
    datos = payload_registro(email_unico)
    client.post("/api/auth/registro", json=datos)

    respuesta = client.post("/api/auth/login", json={"email": email_unico, "password": datos["password"]})
    assert respuesta.status_code == 200
    assert respuesta.json()["usuario"]["email"] == email_unico


def test_login_con_password_incorrecta(client: TestClient, email_unico: str):
    client.post("/api/auth/registro", json=payload_registro(email_unico))

    respuesta = client.post("/api/auth/login", json={"email": email_unico, "password": "otraClave123"})
    assert respuesta.status_code == 401


def test_me_requiere_token(client: TestClient):
    assert client.get("/api/auth/me").status_code == 401


def test_me_con_token_devuelve_el_usuario(client: TestClient, auth_headers: dict):
    respuesta = client.get("/api/auth/me", headers=auth_headers)
    assert respuesta.status_code == 200
    assert "email" in respuesta.json()

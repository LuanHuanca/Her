"""Fixtures compartidas.

Estas pruebas corren contra la base de datos real definida por DATABASE_URL
(la de docker-compose), igual que hace `app.seed` — no hay una base de datos
de pruebas separada. Cada prueba usa un correo único (uuid) para no chocar
con las usuarias demo ni con corridas anteriores. Se ejecutan con:

    docker compose exec backend pytest
"""
import uuid

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture()
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture()
def email_unico() -> str:
    return f"test-{uuid.uuid4().hex[:12]}@her.app"


def payload_registro(email: str, **overrides) -> dict:
    base = {
        "email": email,
        "password": "Contrasena123",
        "nombre": "Usuaria de Prueba",
        "fechaNacimiento": "1995-06-15",
        "ciudad": "La Paz",
        "ocupacion": "Estudiante",
        "hijos": 1,
        "buscaEmpleo": "si",
        "eventos": "ambos",
    }
    base.update(overrides)
    return base


@pytest.fixture()
def token(client: TestClient, email_unico: str) -> str:
    """Registra una usuaria nueva y devuelve su token JWT."""
    respuesta = client.post("/api/auth/registro", json=payload_registro(email_unico))
    assert respuesta.status_code == 201, respuesta.text
    return respuesta.json()["token"]


@pytest.fixture()
def auth_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def admin_headers(client: TestClient) -> dict:
    """Inicia sesión con la cuenta admin sembrada por app.seed (admin@her.app)."""
    respuesta = client.post("/api/auth/login", json={"email": "admin@her.app", "password": "Admin12345"})
    assert respuesta.status_code == 200, respuesta.text
    return {"Authorization": f"Bearer {respuesta.json()['token']}"}

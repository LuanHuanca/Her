"""
Entrypoint principal de la aplicación FastAPI.
En esta fase solo expone un endpoint de healthcheck.
Los routers de dominio (auth, users, challenges, community, events)
se montan en el Plan C.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="Her Platform API",
    description="API backend de la plataforma Her — empoderamiento de madres jóvenes en Bolivia.",
    version="0.1.0",
)

# Configurar CORS para que el frontend (Vite en :5173) pueda llamar al backend
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["health"])
def healthcheck():
    """Verifica que el backend está corriendo."""
    return {"status": "ok", "service": "her-backend"}

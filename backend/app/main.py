"""Entrypoint principal de la aplicación FastAPI."""
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routers import admin, auth, comunidad, empleos, eventos, mensajes, metas, perfil, recompensas, retos

app = FastAPI(
    title="Her Platform API",
    description="API backend de la plataforma Her — empoderamiento de madres jóvenes en Bolivia.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_handler(request, exc: RequestValidationError) -> JSONResponse:
    """Mensaje de error legible en español para el primer campo inválido."""
    primero = exc.errors()[0]
    campo = ".".join(str(p) for p in primero["loc"][1:])
    return JSONResponse(status_code=422, content={"detail": f"{campo}: {primero['msg']}" if campo else primero["msg"]})


@app.get("/", tags=["health"])
def healthcheck():
    return {"status": "ok", "service": "her-backend"}


for router in (auth.router, perfil.router, metas.router, retos.router, recompensas.router, comunidad.router, mensajes.router, eventos.router, empleos.router, admin.router):
    app.include_router(router, prefix="/api")

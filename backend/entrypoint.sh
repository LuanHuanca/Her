#!/bin/sh
set -e

echo "[entrypoint] Aplicando migraciones..."
alembic upgrade head

echo "[entrypoint] Sembrando datos iniciales si hace falta..."
python -m app.seed

echo "[entrypoint] Iniciando uvicorn..."
# PORT: en Render (y otras plataformas) el contenedor debe escuchar en el puerto
# que la plataforma inyecta; localmente (docker-compose) no se define, por eso el 8000 por defecto.
# RELOAD=true solo en desarrollo local (docker-compose lo activa); en producción va apagado.
if [ "${RELOAD:-false}" = "true" ]; then
  exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}" --reload
else
  exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
fi

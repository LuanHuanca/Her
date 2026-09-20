#!/bin/sh
set -e

echo "[entrypoint] Aplicando migraciones..."
alembic upgrade head

echo "[entrypoint] Sembrando datos iniciales si hace falta..."
python -m app.seed

echo "[entrypoint] Iniciando uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

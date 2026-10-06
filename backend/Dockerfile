# ── Imagen base ──────────────────────────────────────────────────────────────
FROM python:3.12-slim

# Instalar uv (gestor de paquetes moderno para Python)
RUN pip install uv --no-cache-dir

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo los archivos de dependencias primero (mejor cache de capas)
COPY pyproject.toml .

# Instalar dependencias con uv (sin crear venv — usamos el Python del sistema)
RUN uv pip install --system --no-cache -r pyproject.toml

# Copiar el resto del código
# En desarrollo, este COPY se sobreescribe por el bind-mount del compose
COPY . .
RUN chmod +x entrypoint.sh

# Exponer el puerto de uvicorn
EXPOSE 8000

# Migra, siembra datos si hace falta y arranca uvicorn (escucha en $PORT si está definido).
# docker-compose lo sobreescribe para pasar RELOAD=true en desarrollo.
CMD ["sh", "./entrypoint.sh"]

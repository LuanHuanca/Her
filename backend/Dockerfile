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

# Exponer el puerto de uvicorn
EXPOSE 8000

# Comando de inicio (sobreescrito por docker-compose en desarrollo para añadir --reload)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

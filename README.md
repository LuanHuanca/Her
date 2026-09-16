# Her Platform

Plataforma web para el empoderamiento económico y social de madres jóvenes y solteras en Bolivia.

---

## Requisitos previos

- [Docker](https://docs.docker.com/get-docker/) 24+
- [Docker Compose](https://docs.docker.com/compose/) v2 (incluido en Docker Desktop)
- Git

## Levantar el entorno de desarrollo

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd her

# 2. Crear tu archivo de variables de entorno local
cp .env.example .env   # en Windows: copy .env.example .env

# 3. Levantar todos los servicios (primera vez tarda ~5 min descargando imágenes)
docker compose up
```

Con esto tendrás disponibles:

| Servicio | URL | Descripción |
|---------|-----|-------------|
| Frontend (React + Vite) | http://localhost:5173 | Aplicación web |
| Backend (FastAPI) | http://localhost:8000 | API REST |
| Swagger UI | http://localhost:8000/docs | Documentación interactiva de la API |
| Adminer (inspector DB) | http://localhost:8080 | Inspeccionar la base de datos |

### Conectarse a Adminer

- **Sistema:** PostgreSQL
- **Servidor:** `db`
- **Usuario:** `her`
- **Contraseña:** `herpassword`
- **Base de datos:** `her_db`

---

## Comandos útiles

```bash
# Rebuild forzado (necesario si cambiás Dockerfile o dependencias)
docker compose up --build

# Solo un servicio
docker compose up backend

# Ver logs en tiempo real
docker compose logs -f backend
docker compose logs -f frontend

# Detener (los datos de la DB persisten en el volumen)
docker compose down

# Detener Y eliminar la base de datos
docker compose down -v
```

---

## Estructura del proyecto

```
her/
├── backend/              # Python 3.12 + FastAPI + SQLAlchemy + Alembic
│   ├── Dockerfile
│   ├── pyproject.toml    # dependencias gestionadas con uv
│   └── app/
│       └── main.py       # entrypoint FastAPI
├── frontend/             # React 18 + Vite 5 + TypeScript
│   ├── Dockerfile
│   ├── package.json      # dependencias gestionadas con pnpm
│   └── src/
│       ├── main.tsx
│       ├── App.tsx       # rutas de todas las pantallas
│       ├── pages/        # una pantalla por archivo (+ su .module.css)
│       ├── components/   # botones, tarjetas, navegación, iconos, ilustraciones
│       ├── store/        # estado global con zustand (persistido en localStorage)
│       ├── data/mock.ts  # datos de ejemplo hasta que existan los endpoints
│       ├── lib/          # utilidades de fechas y texto
│       └── styles/       # tokens de marca y estilos compartidos
├── docker-compose.yml
├── .env.example          # Variables de entorno (copiar a .env)
└── README.md
```

---

## Pantallas del frontend

La app es mobile-first (en escritorio se muestra centrada como un teléfono). Por ahora todas las pantallas usan
datos de ejemplo de `src/data/mock.ts` y guardan lo que hace la usuaria en `localStorage`; los puntos a conectar
con la API están marcados con `TODO`.

| Ruta | Pantalla |
|------|----------|
| `/` | Bienvenida |
| `/registro` | Registro (paso 1 de 2) |
| `/metas` | Personalización de metas (paso 2 de 2) |
| `/inicio` | Inicio: reto actual, semana, tarea y próximo evento |
| `/retos` | Ruta de módulos de 21 días |
| `/retos/hoy` | Tarea del día (audio + reflexión) |
| `/recompensas` | Puntos, nivel e insignias |
| `/comunidad` | Feed de la comunidad |
| `/comunidad/:id` | Publicación y comentarios |
| `/mensajes` | Mensajes |
| `/eventos` | Calendario de eventos e inscripción |
| `/empleos` | Bolsa de empleos |
| `/empleos/:id` | Detalle de la oferta |
| `/empleos/:id/postular` | Enviar CV |
| `/perfil` | Mi perfil y configuración |

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite 5 + TypeScript |
| Backend | Python 3.12 + FastAPI + SQLAlchemy 2 + Alembic |
| Base de datos | PostgreSQL 16 |
| Auth | JWT (HS256) con python-jose |
| Gestor paquetes Python | uv |
| Gestor paquetes JS | pnpm 9 |
| Contenedores | Docker + Docker Compose v2 |

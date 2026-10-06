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
│   ├── entrypoint.sh     # migra + siembra datos + arranca uvicorn
│   ├── pyproject.toml    # dependencias gestionadas con uv
│   ├── migrations/       # migraciones de Alembic
│   └── app/
│       ├── main.py       # entrypoint FastAPI (monta los routers bajo /api)
│       ├── models/       # tablas de SQLAlchemy
│       ├── schemas/      # validación con Pydantic (camelCase hacia el frontend)
│       ├── routers/      # auth, perfil, metas, retos, recompensas, comunidad, mensajes, eventos, empleos
│       └── seed.py        # datos iniciales (módulos, usuarias demo, empleos, eventos...)
├── frontend/             # React 18 + Vite 5 + TypeScript
│   ├── Dockerfile
│   ├── package.json      # dependencias gestionadas con pnpm
│   └── src/
│       ├── main.tsx
│       ├── App.tsx       # rutas de todas las pantallas
│       ├── pages/        # una pantalla por archivo (+ su .module.css)
│       ├── components/   # botones, tarjetas, navegación, iconos, ilustraciones
│       ├── api/          # hooks de React Query, uno por dominio (auth, retos, empleos...)
│       ├── store/        # useAuthStore: sesión (token + usuario), persistida en localStorage
│       ├── data/mock.ts  # picklists de formulario y datos decorativos (no vienen del backend)
│       ├── lib/          # cliente fetch (api.ts) y utilidades de fechas y texto
│       └── styles/       # tokens de marca y estilos compartidos
├── docker-compose.yml
├── .env.example          # Variables de entorno (copiar a .env)
└── README.md
```

---

## Cuenta de prueba

El seed inicial crea varias usuarias demo (contraseña `Her12345` para todas):

| Correo | Notas |
|---|---|
| `litzy@her.app` | Cuenta principal: día 7 del módulo "Amor propio", racha de 6 días, 8 918 pts |
| `diana@her.app` | Módulo completo (día 21), la que aparece como "ganadora de la semana" |
| `lucero@her.app`, `andrea@her.app`, `jessica@her.app`, `cristina@her.app`, `juliana@her.app` | Perfiles de apoyo (autoras de publicaciones, empleos, chats) |

Además, `admin@her.app` / `Admin12345` es la cuenta de administración (rol `admin`) — ver siguiente sección.

## Panel de administración

En `/admin` (enlace también desde Perfil → "Panel de administración" si la cuenta es admin) hay un panel de escritorio,
separado del diseño mobile-first del resto de la app, para administrar todo el contenido sin tocar el código:

| Sección | Qué permite |
|---|---|
| Panel | Resumen: usuarias, publicaciones, empleos, postulaciones, eventos próximos |
| Usuarias | Buscar, cambiar el rol (`usuaria`/`admin`), activar/desactivar cuentas, eliminar |
| Módulos y retos | Crear/editar/eliminar los 6 módulos y, dentro de cada uno, las tareas de sus 21 días |
| Eventos | Crear/editar/eliminar charlas y talleres |
| Empleos | Crear/editar/eliminar ofertas y las empresas que las publican |
| Comunidad | Ver y eliminar publicaciones y comentarios (moderación) |

La seguridad real vive en el backend: cada endpoint bajo `/api/admin/*` exige `rol=admin` vía la dependencia
`get_current_admin` (`backend/app/deps.py`) — el guard del frontend (`RequireAdmin`) es solo para no mostrar la UI a
quien no la necesita, no la barrera de seguridad. Reglas de negocio ya cubiertas: una admin no puede desactivarse ni
eliminarse a sí misma, y no se puede quitar el rol o eliminar a la última cuenta admin que quede.

## Pantallas del frontend

La app es responsive: en celular se ve como una columna a pantalla completa con navegación inferior; a partir de
~700px de ancho (tablet/escritorio) la navegación pasa a una barra lateral y el contenido se centra en una columna
más ancha. Todas las pantallas están conectadas a la API real (ver sección de arriba); solo las "historias" de la
pantalla de Comunidad siguen siendo decorativas porque esa función no está implementada en el backend.

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
| Frontend | React 18 + Vite 5 + TypeScript + React Query |
| Backend | Python 3.12 + FastAPI + SQLAlchemy 2 + Alembic |
| Base de datos | PostgreSQL 16 |
| Auth | JWT (HS256) con python-jose |
| Gestor paquetes Python | uv |
| Gestor paquetes JS | pnpm 9 |
| Contenedores | Docker + Docker Compose v2 |

---

## Pruebas del backend

Hay pruebas de integración (`backend/tests/`) que corren contra la base de datos real de
`docker-compose` (no hay una base de datos de pruebas separada), usando un correo único por
prueba para no chocar con las usuarias demo:

```bash
docker compose exec backend pytest
```

El frontend todavía no tiene pruebas automatizadas (ver "Qué falta" abajo).

---

## Qué falta / próximos pasos

Simplificaciones deliberadas del alcance actual, para que quede claro qué es "no implementado
todavía" y no un bug:

- **Mensajes es de solo lectura.** El backend modela `Chat`/`Mensaje`/`ChatParticipante`
  correctamente, pero no hay pantalla de conversación en el frontend ni endpoint para enviar
  mensajes — solo se lista la conversación con su último mensaje.
- **Postular a un empleo no sube archivos de verdad.** Solo se guarda el *nombre* del CV
  (`cvNombreArchivo`); no hay almacenamiento de archivos (S3, disco, etc.).
- **No hay login con Google.** El botón "Continuar con Google" queda deshabilitado; solo
  funciona el registro por correo/contraseña.
- **Contenido de los 21 días:** solo el día 7 de "Amor propio" tiene contenido diseñado a mano
  (el que ya existía en el prototipo). El resto de los 126 días (6 módulos × 21 días) es texto
  plantilla generado en `backend/app/seed.py` — ya se puede reemplazar sin tocar código desde
  el [panel de administración](#panel-de-administración) (`/admin` → Módulos y retos).
- **Sin pruebas de frontend**, sin CI/CD configurado, y sin verificación visual del diseño
  responsive ni del panel de administración en un navegador real (se validó con `tsc`, el build
  de producción y llamadas directas a la API).

Cosas que faltan para llevar esto a producción (no solo desarrollo local):

- `SECRET_KEY` y las contraseñas de `.env` son valores de ejemplo — hay que generarlos de
  verdad y no commitearlos.
- No hay Dockerfile/compose de producción (el actual usa `--reload`, bind-mounts y expone el
  puerto de Postgres; para producción hace falta una imagen de frontend servida como estático
  detrás de un proxy, y un backend sin `--reload` con varios workers).
- No hay rate-limiting en `/api/auth/login` ni `/api/auth/registro` (protección básica contra
  fuerza bruta).
- No hay recuperación de contraseña ("olvidé mi contraseña") ni verificación de correo.
- Las listas (`/api/comunidad/publicaciones`, `/api/empleos`) no están paginadas — no es un
  problema con datos de semilla, pero sí lo sería con datos reales.

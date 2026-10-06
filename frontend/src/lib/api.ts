/**
 * Cliente HTTP mínimo para hablar con el backend FastAPI.
 * Adjunta el token de sesión y traduce errores a un mensaje legible (campo `detail`).
 */
import { useAuthStore } from '../store/useAuthStore'

// Algunas plataformas (p. ej. Render, vía `fromService: property: host`) solo pueden
// inyectar el hostname del backend sin esquema — se asume https si no viene uno.
const VITE_API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const BASE_URL: string = VITE_API_URL.includes('://') ? VITE_API_URL : `https://${VITE_API_URL}`

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function solicitud<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const { token, cerrarSesion } = useAuthStore.getState()
  const headers = new Headers(opciones.headers)
  headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const respuesta = await fetch(`${BASE_URL}/api${ruta}`, { ...opciones, headers })

  if (respuesta.status === 401) {
    cerrarSesion()
  }

  if (!respuesta.ok) {
    let mensaje = 'Ocurrió un error inesperado. Intenta de nuevo.'
    try {
      const cuerpo = await respuesta.json()
      if (typeof cuerpo.detail === 'string') mensaje = cuerpo.detail
    } catch {
      // La respuesta no traía un cuerpo JSON.
    }
    throw new ApiError(respuesta.status, mensaje)
  }

  if (respuesta.status === 204) return undefined as T
  return (await respuesta.json()) as T
}

export const api = {
  get: <T>(ruta: string) => solicitud<T>(ruta),
  post: <T>(ruta: string, body?: unknown) =>
    solicitud<T>(ruta, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }),
  put: <T>(ruta: string, body?: unknown) => solicitud<T>(ruta, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(ruta: string, body?: unknown) => solicitud<T>(ruta, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(ruta: string) => solicitud<T>(ruta, { method: 'DELETE' }),
}

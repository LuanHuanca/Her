import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useAuthStore } from '../store/useAuthStore'
import type { BuscaEmpleo, PreferenciaEventos, UsuarioAutenticado } from '../types'

export interface RegistroDatos {
  email: string
  password: string
  nombre: string
  fechaNacimiento: string
  ciudad: string
  ocupacion: string
  hijos: number
  buscaEmpleo: BuscaEmpleo
  eventos: PreferenciaEventos
}

interface SesionOut {
  token: string
  usuario: UsuarioAutenticado
}

export function useRegistro() {
  const iniciarSesion = useAuthStore((s) => s.iniciarSesion)
  return useMutation({
    mutationFn: (datos: RegistroDatos) => api.post<SesionOut>('/auth/registro', datos),
    onSuccess: (sesion) => iniciarSesion(sesion.token, sesion.usuario),
  })
}

export function useLogin() {
  const iniciarSesion = useAuthStore((s) => s.iniciarSesion)
  return useMutation({
    mutationFn: (datos: { email: string; password: string }) => api.post<SesionOut>('/auth/login', datos),
    onSuccess: (sesion) => iniciarSesion(sesion.token, sesion.usuario),
  })
}

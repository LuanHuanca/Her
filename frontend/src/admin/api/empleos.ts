import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/useAuthStore'
import type { EmpleoAdmin, EmpleoFormulario, EmpresaAdmin } from '../types'

export function useEmpresasAdmin() {
  const rol = useAuthStore((s) => s.usuario?.rol)
  return useQuery({
    queryKey: ['admin', 'empresas'],
    queryFn: () => api.get<EmpresaAdmin[]>('/admin/empresas'),
    enabled: rol === 'admin',
  })
}

export function useCrearEmpresa() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (nombre: string) => api.post<EmpresaAdmin>('/admin/empresas', { nombre }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'empresas'] }),
  })
}

export function useEliminarEmpresa() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/admin/empresas/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'empresas'] }),
  })
}

export function useEmpleosAdmin() {
  const rol = useAuthStore((s) => s.usuario?.rol)
  return useQuery({
    queryKey: ['admin', 'empleos'],
    queryFn: () => api.get<EmpleoAdmin[]>('/admin/empleos'),
    enabled: rol === 'admin',
  })
}

export function useCrearEmpleo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (datos: EmpleoFormulario) => api.post<EmpleoAdmin>('/admin/empleos', datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'empleos'] }),
  })
}

export function useActualizarEmpleo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...datos }: EmpleoFormulario & { id: string }) => api.put<EmpleoAdmin>(`/admin/empleos/${id}`, datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'empleos'] }),
  })
}

export function useEliminarEmpleo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/admin/empleos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'empleos'] }),
  })
}

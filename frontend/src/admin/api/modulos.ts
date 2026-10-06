import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/useAuthStore'
import type { ModuloAdmin, ModuloFormulario, TareaAdmin, TareaFormulario } from '../types'

export function useModulosAdmin() {
  const rol = useAuthStore((s) => s.usuario?.rol)
  return useQuery({
    queryKey: ['admin', 'modulos'],
    queryFn: () => api.get<ModuloAdmin[]>('/admin/modulos'),
    enabled: rol === 'admin',
  })
}

export function useCrearModulo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (datos: ModuloFormulario) => api.post<ModuloAdmin>('/admin/modulos', datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'modulos'] }),
  })
}

export function useActualizarModulo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...datos }: ModuloFormulario & { id: string }) => api.put<ModuloAdmin>(`/admin/modulos/${id}`, datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'modulos'] }),
  })
}

export function useEliminarModulo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/admin/modulos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'modulos'] }),
  })
}

export function useTareasAdmin(moduloId: string | undefined) {
  const rol = useAuthStore((s) => s.usuario?.rol)
  return useQuery({
    queryKey: ['admin', 'modulos', moduloId, 'tareas'],
    queryFn: () => api.get<TareaAdmin[]>(`/admin/modulos/${moduloId}/tareas`),
    enabled: rol === 'admin' && !!moduloId,
  })
}

export function useCrearTarea(moduloId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (datos: TareaFormulario) => api.post<TareaAdmin>(`/admin/modulos/${moduloId}/tareas`, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'modulos', moduloId, 'tareas'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'modulos'] })
    },
  })
}

export function useActualizarTarea(moduloId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...datos }: TareaFormulario & { id: number }) => api.put<TareaAdmin>(`/admin/tareas/${id}`, datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'modulos', moduloId, 'tareas'] }),
  })
}

export function useEliminarTarea(moduloId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/admin/tareas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'modulos', moduloId, 'tareas'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'modulos'] })
    },
  })
}

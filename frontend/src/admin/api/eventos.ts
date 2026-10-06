import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/useAuthStore'
import type { EventoAdmin, EventoFormulario } from '../types'

export function useEventosAdmin() {
  const rol = useAuthStore((s) => s.usuario?.rol)
  return useQuery({
    queryKey: ['admin', 'eventos'],
    queryFn: () => api.get<EventoAdmin[]>('/admin/eventos'),
    enabled: rol === 'admin',
  })
}

export function useCrearEvento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (datos: EventoFormulario) => api.post<EventoAdmin>('/admin/eventos', datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'eventos'] }),
  })
}

export function useActualizarEvento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...datos }: EventoFormulario & { id: number }) => api.put<EventoAdmin>(`/admin/eventos/${id}`, datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'eventos'] }),
  })
}

export function useEliminarEvento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/admin/eventos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'eventos'] }),
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/useAuthStore'
import type { ComentarioAdmin, PublicacionAdmin } from '../types'

export function usePublicacionesAdmin() {
  const rol = useAuthStore((s) => s.usuario?.rol)
  return useQuery({
    queryKey: ['admin', 'comunidad', 'publicaciones'],
    queryFn: () => api.get<PublicacionAdmin[]>('/admin/comunidad/publicaciones'),
    enabled: rol === 'admin',
  })
}

export function useComentariosAdmin(publicacionId: number | null) {
  const rol = useAuthStore((s) => s.usuario?.rol)
  return useQuery({
    queryKey: ['admin', 'comunidad', 'publicaciones', publicacionId, 'comentarios'],
    queryFn: () => api.get<ComentarioAdmin[]>(`/admin/comunidad/publicaciones/${publicacionId}/comentarios`),
    enabled: rol === 'admin' && publicacionId !== null,
  })
}

export function useEliminarPublicacionAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/admin/comunidad/publicaciones/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'comunidad'] }),
  })
}

export function useEliminarComentarioAdmin(publicacionId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/admin/comunidad/comentarios/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'comunidad', 'publicaciones', publicacionId, 'comentarios'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'comunidad', 'publicaciones'] })
    },
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/useAuthStore'
import type { Rol } from '../../types'
import type { UsuarioAdmin } from '../types'

export function useUsuariosAdmin(busqueda: string) {
  const rol = useAuthStore((s) => s.usuario?.rol)
  return useQuery({
    queryKey: ['admin', 'usuarios', busqueda],
    queryFn: () => api.get<UsuarioAdmin[]>(`/admin/usuarios?q=${encodeURIComponent(busqueda)}`),
    enabled: rol === 'admin',
  })
}

export function useActualizarUsuarioAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...datos }: { id: number; rol?: Rol; activo?: boolean }) =>
      api.patch<UsuarioAdmin>(`/admin/usuarios/${id}`, datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'usuarios'] }),
  })
}

export function useEliminarUsuarioAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/admin/usuarios/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'usuarios'] }),
  })
}

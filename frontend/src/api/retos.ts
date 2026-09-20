import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useAuthStore } from '../store/useAuthStore'
import type { RetoHoy, Ruta } from '../types'

export function useRuta() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['retos'],
    queryFn: () => api.get<Ruta>('/retos'),
    enabled: !!token,
  })
}

export function useRetoHoy() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['retos', 'hoy'],
    queryFn: () => api.get<RetoHoy>('/retos/hoy'),
    enabled: !!token,
  })
}

export function useCompletarReto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (datos: { reflexion: string; compartir: boolean }) => api.post<RetoHoy>('/retos/completar', datos),
    onSuccess: (reto) => {
      queryClient.setQueryData(['retos', 'hoy'], reto)
      queryClient.invalidateQueries({ queryKey: ['retos'] })
      queryClient.invalidateQueries({ queryKey: ['recompensas'] })
      queryClient.invalidateQueries({ queryKey: ['comunidad'] })
    },
  })
}

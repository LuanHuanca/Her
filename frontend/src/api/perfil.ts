import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useAuthStore } from '../store/useAuthStore'
import type { Perfil } from '../types'

export function usePerfil() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['perfil'],
    queryFn: () => api.get<Perfil>('/perfil'),
    enabled: !!token,
  })
}

export function useActualizarPerfil() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (datos: Perfil) => api.put<Perfil>('/perfil', datos),
    onSuccess: (perfil) => queryClient.setQueryData(['perfil'], perfil),
  })
}

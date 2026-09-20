import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useAuthStore } from '../store/useAuthStore'
import type { Metas } from '../types'

export function useMetas() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['metas'],
    queryFn: () => api.get<Metas>('/metas'),
    enabled: !!token,
  })
}

export function useActualizarMetas() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (datos: Metas) => api.put<Metas>('/metas', datos),
    onSuccess: (metas) => queryClient.setQueryData(['metas'], metas),
  })
}

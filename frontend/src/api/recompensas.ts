import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useAuthStore } from '../store/useAuthStore'
import type { Recompensas } from '../types'

export function useRecompensas() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['recompensas'],
    queryFn: () => api.get<Recompensas>('/recompensas'),
    enabled: !!token,
  })
}

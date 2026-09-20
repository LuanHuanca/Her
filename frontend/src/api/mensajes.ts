import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useAuthStore } from '../store/useAuthStore'
import type { Chat } from '../types'

export function useChats() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['mensajes'],
    queryFn: () => api.get<Chat[]>('/mensajes'),
    enabled: !!token,
  })
}

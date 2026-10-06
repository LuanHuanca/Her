import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useAuthStore } from '../store/useAuthStore'
import type { Evento } from '../types'

export function useEventos() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['eventos'],
    queryFn: () => api.get<Evento[]>('/eventos'),
    enabled: !!token,
  })
}

export function useAlternarInscripcion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (eventoId: number) => api.post<{ inscrita: boolean }>(`/eventos/${eventoId}/inscripcion`),
    onMutate: async (eventoId) => {
      queryClient.setQueryData<Evento[]>(['eventos'], (actuales) =>
        actuales?.map((e) => (e.id === eventoId ? { ...e, inscrita: !e.inscrita } : e)),
      )
    },
    onSuccess: (resultado, eventoId) => {
      queryClient.setQueryData<Evento[]>(['eventos'], (actuales) =>
        actuales?.map((e) => (e.id === eventoId ? { ...e, inscrita: resultado.inscrita } : e)),
      )
      queryClient.invalidateQueries({ queryKey: ['recompensas'] })
    },
  })
}

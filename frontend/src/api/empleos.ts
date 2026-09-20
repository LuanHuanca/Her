import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useAuthStore } from '../store/useAuthStore'
import type { Empleo } from '../types'

export function useEmpleos() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['empleos'],
    queryFn: () => api.get<Empleo[]>('/empleos'),
    enabled: !!token,
  })
}

export function useEmpleo(id: string | undefined) {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['empleos', id],
    queryFn: () => api.get<Empleo>(`/empleos/${id}`),
    enabled: !!token && !!id,
  })
}

function actualizarEnCache(queryClient: ReturnType<typeof useQueryClient>, id: string, cambios: Partial<Empleo>) {
  queryClient.setQueryData<Empleo[]>(['empleos'], (actuales) => actuales?.map((e) => (e.id === id ? { ...e, ...cambios } : e)))
  queryClient.setQueryData<Empleo>(['empleos', id], (actual) => (actual ? { ...actual, ...cambios } : actual))
}

export function useAlternarGuardado() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (empleoId: string) => api.post<{ guardado: boolean }>(`/empleos/${empleoId}/guardado`),
    onMutate: async (empleoId) => actualizarEnCache(queryClient, empleoId, { guardado: true }),
    onSuccess: (resultado, empleoId) => actualizarEnCache(queryClient, empleoId, resultado),
  })
}

export function usePostular() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ empleoId, cvNombreArchivo }: { empleoId: string; cvNombreArchivo: string }) =>
      api.post<{ postulada: boolean }>(`/empleos/${empleoId}/postular`, { cvNombreArchivo }),
    onSuccess: (resultado, { empleoId }) => actualizarEnCache(queryClient, empleoId, resultado),
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useAuthStore } from '../store/useAuthStore'
import type { Comentario, Publicacion } from '../types'

export function usePublicaciones() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['comunidad'],
    queryFn: () => api.get<Publicacion[]>('/comunidad/publicaciones'),
    enabled: !!token,
  })
}

export function usePublicacion(id: string) {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['comunidad', id],
    queryFn: () => api.get<Publicacion>(`/comunidad/publicaciones/${id}`),
    enabled: !!token && !!id,
  })
}

export function useCrearPublicacion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (texto: string) => api.post<Publicacion>('/comunidad/publicaciones', { texto }),
    onSuccess: (publicacion) => {
      queryClient.setQueryData<Publicacion[]>(['comunidad'], (actuales) =>
        actuales ? [publicacion, ...actuales] : [publicacion],
      )
    },
  })
}

export function useAlternarLike() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (publicacionId: number) => api.post<{ likes: number; meGusta: boolean }>(`/comunidad/publicaciones/${publicacionId}/like`),
    onMutate: async (publicacionId) => {
      const aplicar = (p: Publicacion) =>
        p.id === publicacionId ? { ...p, meGusta: !p.meGusta, likes: p.likes + (p.meGusta ? -1 : 1) } : p
      queryClient.setQueryData<Publicacion[]>(['comunidad'], (actuales) => actuales?.map(aplicar))
      queryClient.setQueryData<Publicacion>(['comunidad', String(publicacionId)], (actual) => (actual ? aplicar(actual) : actual))
    },
    onSuccess: (resultado, publicacionId) => {
      const aplicar = (p: Publicacion) => (p.id === publicacionId ? { ...p, ...resultado } : p)
      queryClient.setQueryData<Publicacion[]>(['comunidad'], (actuales) => actuales?.map(aplicar))
      queryClient.setQueryData<Publicacion>(['comunidad', String(publicacionId)], (actual) => (actual ? aplicar(actual) : actual))
    },
  })
}

export function useComentar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ publicacionId, texto }: { publicacionId: number; texto: string }) =>
      api.post<Comentario>(`/comunidad/publicaciones/${publicacionId}/comentarios`, { texto }),
    onSuccess: (comentario, { publicacionId }) => {
      const agregar = (p: Publicacion) =>
        p.id === publicacionId ? { ...p, comentarios: [...p.comentarios, comentario] } : p
      queryClient.setQueryData<Publicacion[]>(['comunidad'], (actuales) => actuales?.map(agregar))
      queryClient.setQueryData<Publicacion>(['comunidad', String(publicacionId)], (actual) => (actual ? agregar(actual) : actual))
    },
  })
}

import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/useAuthStore'
import type { ResumenAdmin } from '../types'

export function useResumenAdmin() {
  const rol = useAuthStore((s) => s.usuario?.rol)
  return useQuery({
    queryKey: ['admin', 'resumen'],
    queryFn: () => api.get<ResumenAdmin>('/admin/resumen'),
    enabled: rol === 'admin',
  })
}

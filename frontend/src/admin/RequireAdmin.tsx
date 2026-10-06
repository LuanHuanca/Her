import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

/** Puerta de UX: la seguridad real la hace el backend (get_current_admin) en cada endpoint. */
export default function RequireAdmin() {
  const token = useAuthStore((s) => s.token)
  const rol = useAuthStore((s) => s.usuario?.rol)
  if (!token) return <Navigate to="/login" replace />
  if (rol !== 'admin') return <Navigate to="/inicio" replace />
  return <Outlet />
}

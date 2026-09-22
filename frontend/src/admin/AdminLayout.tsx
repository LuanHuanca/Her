import { useQueryClient } from '@tanstack/react-query'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { cx } from '../lib/texto'
import { useAuthStore } from '../store/useAuthStore'
import styles from './AdminLayout.module.css'

const SECCIONES = [
  { to: '/admin', etiqueta: 'Panel', fin: true },
  { to: '/admin/usuarios', etiqueta: 'Usuarias' },
  { to: '/admin/modulos', etiqueta: 'Módulos y retos' },
  { to: '/admin/eventos', etiqueta: 'Eventos' },
  { to: '/admin/empleos', etiqueta: 'Empleos' },
  { to: '/admin/comunidad', etiqueta: 'Comunidad' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const usuario = useAuthStore((s) => s.usuario)
  const cerrarSesion = useAuthStore((s) => s.cerrarSesion)

  function salir() {
    cerrarSesion()
    queryClient.clear()
    navigate('/')
  }

  return (
    <div className={styles.marco}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          Her
          <span>Administración</span>
        </div>
        <nav className={styles.nav} aria-label="Secciones de administración">
          {SECCIONES.map((s) => (
            <NavLink
              key={s.to}
              to={s.to}
              end={s.fin}
              className={({ isActive }) => cx(styles.item, isActive && styles.activo)}
            >
              {s.etiqueta}
            </NavLink>
          ))}
        </nav>
        <div className={styles.pie}>
          <span className={styles.item} style={{ padding: 0, fontWeight: 400 }}>
            {usuario?.nombre}
          </span>
          <Link to="/inicio" className={styles.volver}>
            Volver a la app
          </Link>
          <button type="button" className={styles.volver} onClick={salir} style={{ border: 0, background: 'none', cursor: 'pointer', textAlign: 'left' }}>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className={styles.contenido}>
        <Outlet />
      </main>
    </div>
  )
}

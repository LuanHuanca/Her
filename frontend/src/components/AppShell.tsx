import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styles from './AppShell.module.css'
import NavegacionInferior from './NavegacionInferior'

/** Rutas principales que muestran la barra de navegación inferior. */
const RUTAS_CON_NAVEGACION = ['/inicio', '/retos', '/comunidad', '/empleos', '/perfil']

export default function AppShell() {
  const { pathname } = useLocation()
  const conNavegacion = RUTAS_CON_NAVEGACION.includes(pathname)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className={styles.marco}>
      <div className={styles.contenido}>
        <Outlet />
      </div>
      {conNavegacion && <NavegacionInferior />}
    </div>
  )
}

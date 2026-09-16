import { NavLink } from 'react-router-dom'
import { cx } from '../lib/texto'
import Icono, { type NombreIcono } from './Icono'
import styles from './NavegacionInferior.module.css'

const PESTANAS: { to: string; etiqueta: string; icono: NombreIcono }[] = [
  { to: '/inicio', etiqueta: 'Inicio', icono: 'inicio' },
  { to: '/retos', etiqueta: 'Retos', icono: 'retos' },
  { to: '/comunidad', etiqueta: 'Comunidad', icono: 'comunidad' },
  { to: '/empleos', etiqueta: 'Empleos', icono: 'empleos' },
  { to: '/perfil', etiqueta: 'Perfil', icono: 'perfil' },
]

export default function NavegacionInferior() {
  return (
    <nav aria-label="Navegación principal" className={styles.nav}>
      {PESTANAS.map((p) => (
        <NavLink key={p.to} to={p.to} className={({ isActive }) => cx(styles.item, isActive && styles.activo)}>
          <Icono nombre={p.icono} />
          <span>{p.etiqueta}</span>
        </NavLink>
      ))}
    </nav>
  )
}

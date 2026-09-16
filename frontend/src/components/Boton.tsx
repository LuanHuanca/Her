import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '../lib/texto'
import ui from '../styles/ui.module.css'

type Variante = 'primario' | 'secundario' | 'oscuro' | 'suave'

interface Comun {
  variante?: Variante
  bloque?: boolean
  compacto?: boolean
  className?: string
  children: ReactNode
}

type ComoEnlace = Comun & { to: string }
type ComoBoton = Comun & { to?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

/** Botón de acción; con `to` se renderiza como enlace de navegación. */
export default function Boton(props: ComoEnlace | ComoBoton) {
  const { variante = 'primario', bloque, compacto, className, children } = props
  const clases = cx(ui.boton, ui[variante], bloque && ui.bloque, compacto && ui.compacto, className)

  if (props.to !== undefined) {
    return (
      <Link to={props.to} className={clases}>
        {children}
      </Link>
    )
  }

  const { variante: _v, bloque: _b, compacto: _c, className: _cn, children: _ch, to: _to, ...atributos } = props
  return (
    <button type="button" {...atributos} className={clases}>
      {children}
    </button>
  )
}

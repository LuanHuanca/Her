import { Link } from 'react-router-dom'
import { cx } from '../lib/texto'
import ui from '../styles/ui.module.css'
import Icono, { type NombreIcono } from './Icono'

interface Props {
  icono: NombreIcono
  /** Nombre accesible: estos botones no tienen texto visible. */
  etiqueta: string
  to?: string
  onClick?: () => void
  tipo?: 'button' | 'submit'
  primario?: boolean
  punto?: boolean
  disabled?: boolean
  className?: string
}

export default function BotonIcono({ icono, etiqueta, to, onClick, tipo = 'button', primario, punto, disabled, className }: Props) {
  const clases = cx(ui.botonIcono, primario && ui.botonIconoPrimario, className)
  const contenido = (
    <>
      <Icono nombre={icono} tamano={20} strokeWidth={2} />
      {punto && <span className={ui.punto} aria-hidden="true" />}
    </>
  )

  if (to) {
    return (
      <Link to={to} aria-label={etiqueta} className={clases}>
        {contenido}
      </Link>
    )
  }
  return (
    <button type={tipo} aria-label={etiqueta} onClick={onClick} disabled={disabled} className={clases}>
      {contenido}
    </button>
  )
}

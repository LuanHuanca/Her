import { cx } from '../lib/texto'
import ui from '../styles/ui.module.css'
import type { Persona, Tono } from '../types'

const CLASE_TONO: Record<Tono, string> = {
  rosa: ui.tonoRosa,
  lavanda: ui.tonoLavanda,
  salvia: ui.tonoSalvia,
  durazno: ui.tonoDurazno,
  cielo: ui.tonoCielo,
}

interface Props {
  persona: Persona
  tamano?: number
  anillo?: boolean
  /** Decorativo cuando el nombre ya aparece junto al avatar. */
  decorativo?: boolean
  className?: string
}

/** Avatar con iniciales; se usa hasta que existan fotos de perfil. */
export default function Avatar({ persona, tamano = 44, anillo, decorativo = true, className }: Props) {
  return (
    <span
      className={cx(ui.avatar, CLASE_TONO[persona.tono], anillo && ui.avatarAnillo, className)}
      style={{ width: tamano, height: tamano, fontSize: Math.round(tamano * 0.36) }}
      role={decorativo ? undefined : 'img'}
      aria-label={decorativo ? undefined : persona.nombre}
      aria-hidden={decorativo ? true : undefined}
    >
      {persona.iniciales}
    </span>
  )
}

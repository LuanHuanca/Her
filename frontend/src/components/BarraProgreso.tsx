import { cx } from '../lib/texto'
import ui from '../styles/ui.module.css'

interface Props {
  /** Entre 0 y 1. */
  valor: number
  etiqueta: string
  invertida?: boolean
  alto?: number
}

export default function BarraProgreso({ valor, etiqueta, invertida, alto }: Props) {
  const porcentaje = Math.round(Math.min(Math.max(valor, 0), 1) * 100)
  return (
    <div
      className={cx(ui.progreso, invertida && ui.progresoInvertido)}
      style={alto ? { height: alto } : undefined}
      role="progressbar"
      aria-label={etiqueta}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={porcentaje}
    >
      <div className={ui.progresoRelleno} style={{ width: `${porcentaje}%` }} />
    </div>
  )
}

import type { ReactNode } from 'react'
import ui from '../styles/ui.module.css'
import BarraProgreso from './BarraProgreso'
import BotonIcono from './BotonIcono'

interface Props {
  titulo: string
  atras?: string
  derecha?: ReactNode
}

/** Cabecera de pantalla secundaria: volver, título centrado y acción opcional. */
export default function Cabecera({ titulo, atras, derecha }: Props) {
  return (
    <header className={ui.cabecera}>
      {atras ? <BotonIcono to={atras} icono="atras" etiqueta="Volver" /> : <span className={ui.cabeceraHueco} />}
      <h1 className={ui.cabeceraTitulo}>{titulo}</h1>
      {derecha ?? <span className={ui.cabeceraHueco} />}
    </header>
  )
}

export function CabeceraPasos({ paso, total, atras }: { paso: number; total: number; atras: string }) {
  return (
    <header className={ui.cabecera}>
      <BotonIcono to={atras} icono="atras" etiqueta="Volver" />
      <div className={ui.pasos}>
        <span className={ui.pasosTexto}>
          Paso {paso} de {total}
        </span>
        <BarraProgreso valor={paso / total} etiqueta={`Paso ${paso} de ${total}`} alto={6} />
      </div>
    </header>
  )
}

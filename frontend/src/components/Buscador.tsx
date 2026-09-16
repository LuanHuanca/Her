import ui from '../styles/ui.module.css'
import Icono from './Icono'

interface Props {
  valor: string
  onCambio: (valor: string) => void
  placeholder: string
  etiqueta: string
}

export default function Buscador({ valor, onCambio, placeholder, etiqueta }: Props) {
  return (
    <div className={ui.buscador} role="search">
      <Icono nombre="buscar" tamano={18} />
      <input
        type="search"
        value={valor}
        onChange={(e) => onCambio(e.target.value)}
        placeholder={placeholder}
        aria-label={etiqueta}
      />
    </div>
  )
}

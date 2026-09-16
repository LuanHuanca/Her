import { useState } from 'react'
import Avatar from '../components/Avatar'
import Buscador from '../components/Buscador'
import Cabecera from '../components/Cabecera'
import { CHATS } from '../data/mock'
import { cx, normalizar } from '../lib/texto'
import ui from '../styles/ui.module.css'
import type { TipoChat } from '../types'
import styles from './Mensajes.module.css'

type Filtro = 'todas' | Exclude<TipoChat, 'amiga'>

const FILTROS: { id: Filtro; etiqueta: string }[] = [
  { id: 'todas', etiqueta: 'Todas' },
  { id: 'mentora', etiqueta: 'Mentoras' },
  { id: 'grupo', etiqueta: 'Grupos' },
]

const ETIQUETA_TIPO: Partial<Record<TipoChat, string>> = { mentora: 'Mentora', grupo: 'Grupo' }

export default function Mensajes() {
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [busqueda, setBusqueda] = useState('')

  const consulta = normalizar(busqueda)
  const chats = CHATS.filter(
    (c) => (filtro === 'todas' || c.tipo === filtro) && (!consulta || normalizar(c.persona.nombre).includes(consulta)),
  )

  return (
    <div className={ui.pantalla}>
      <Cabecera titulo="Mensajes" atras="/comunidad" />

      <main className={ui.cuerpo}>
        <Buscador valor={busqueda} onCambio={setBusqueda} placeholder="Buscar amigas" etiqueta="Buscar conversaciones" />

        <div role="radiogroup" aria-label="Filtrar conversaciones" className={ui.carrusel}>
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={filtro === f.id}
              className={ui.pastilla}
              onClick={() => setFiltro(f.id)}
            >
              {f.etiqueta}
            </button>
          ))}
        </div>

        {chats.length === 0 ? (
          <p className={ui.vacio}>No hay conversaciones con ese filtro.</p>
        ) : (
          <ul className={styles.lista}>
            {chats.map((c) => (
              <li key={c.id} className={styles.chat}>
                <Avatar persona={c.persona} tamano={48} />
                <div className={ui.crece}>
                  <span className={styles.nombre}>
                    {c.persona.nombre}
                    {ETIQUETA_TIPO[c.tipo] && <span className={cx(ui.chip, ui.chipNeutro)}>{ETIQUETA_TIPO[c.tipo]}</span>}
                  </span>
                  <span className={cx(styles.ultimo, c.noLeidos > 0 && styles.noLeido)}>{c.ultimo}</span>
                </div>
                <div className={styles.lado}>
                  <span className={ui.meta}>{c.hace}</span>
                  {c.noLeidos > 0 && (
                    <span className={styles.contador}>
                      {c.noLeidos}
                      <span className="sr-only"> sin leer</span>
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

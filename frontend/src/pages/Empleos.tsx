import { useState } from 'react'
import Buscador from '../components/Buscador'
import Icono from '../components/Icono'
import TarjetaEmpleo from '../components/TarjetaEmpleo'
import { EMPLEOS } from '../data/mock'
import { normalizar, plural } from '../lib/texto'
import { useHerStore } from '../store/useHerStore'
import ui from '../styles/ui.module.css'
import type { Empleo } from '../types'
import styles from './Empleos.module.css'

type Filtro = 'todos' | 'medio' | 'remoto' | 'completo' | 'guardados'

const FILTROS: { id: Filtro; etiqueta: string }[] = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'medio', etiqueta: 'Medio tiempo' },
  { id: 'remoto', etiqueta: 'Remoto' },
  { id: 'completo', etiqueta: 'Tiempo completo' },
  { id: 'guardados', etiqueta: 'Guardados' },
]

export default function Empleos() {
  const perfil = useHerStore((s) => s.perfil)
  const guardados = useHerStore((s) => s.empleosGuardados)
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [busqueda, setBusqueda] = useState('')

  const cumpleFiltro: Record<Filtro, (e: Empleo) => boolean> = {
    todos: () => true,
    medio: (e) => e.jornada === 'Medio tiempo',
    remoto: (e) => e.modalidad === 'Remoto',
    completo: (e) => e.jornada === 'Tiempo completo',
    guardados: (e) => guardados.includes(e.id),
  }

  const consulta = normalizar(busqueda)
  const visibles = EMPLEOS.filter(
    (e) =>
      cumpleFiltro[filtro](e) &&
      (!consulta || normalizar(`${e.puesto} ${e.empresa.nombre} ${e.ciudad}`).includes(consulta)),
  )
  const enTuCiudad = EMPLEOS.filter((e) => e.ciudad === perfil.ciudad || e.modalidad === 'Remoto').length

  return (
    <div className={ui.pantalla}>
      <header className={styles.cabecera}>
        <h1 className={ui.tituloDisplay}>Empleos</h1>
        <p className={ui.lead}>Oportunidades con horarios pensados para ti.</p>
      </header>

      <main className={ui.cuerpo}>
        <Buscador valor={busqueda} onCambio={setBusqueda} placeholder="Puesto, empresa o ciudad" etiqueta="Buscar empleos" />

        <div role="radiogroup" aria-label="Filtrar empleos" className={ui.carrusel}>
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

        {perfil.buscaEmpleo === 'si' && filtro === 'todos' && !consulta && (
          <div className={styles.banner}>
            <span className={styles.bannerIcono}>
              <Icono nombre="rayo" tamano={20} />
            </span>
            <p>
              <strong>{plural(enTuCiudad, 'oferta', 'ofertas')}</strong> en {perfil.ciudad} o remotas encajan con tu perfil.
            </p>
          </div>
        )}

        {visibles.length === 0 ? (
          <p className={ui.vacio}>
            {filtro === 'guardados' ? 'Aún no guardaste ofertas. Toca el corazón para guardarlas.' : 'No hay ofertas con estos filtros.'}
          </p>
        ) : (
          <div className={ui.lista}>
            {visibles.map((e) => (
              <TarjetaEmpleo key={e.id} empleo={e} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

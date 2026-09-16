import { useMemo, useState } from 'react'
import BotonIcono from '../components/BotonIcono'
import Cabecera from '../components/Cabecera'
import Icono from '../components/Icono'
import { EVENTOS } from '../data/mock'
import {
  INICIALES_SEMANA,
  celdasDelMes,
  claveDia,
  diaSemanaCorto,
  fechaLarga,
  inicioDelDia,
  mesCorto,
  sumarDias,
  tituloMes,
} from '../lib/fechas'
import { cx, plural } from '../lib/texto'
import { useHerStore } from '../store/useHerStore'
import ui from '../styles/ui.module.css'
import type { Modalidad } from '../types'
import styles from './Eventos.module.css'

type Filtro = 'todos' | Modalidad

const FILTROS: { id: Filtro; etiqueta: string }[] = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'virtual', etiqueta: 'Virtuales' },
  { id: 'presencial', etiqueta: 'Presenciales' },
]

export default function Eventos() {
  const inscritos = useHerStore((s) => s.eventosInscritos)
  const alternarEvento = useHerStore((s) => s.alternarEvento)

  const hoy = useMemo(() => inicioDelDia(new Date()), [])
  const [mesVisible, setMesVisible] = useState({ anio: hoy.getFullYear(), mes: hoy.getMonth() })
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null)

  const eventos = useMemo(() => EVENTOS.map((e) => ({ ...e, fecha: sumarDias(hoy, e.offsetDias) })), [hoy])
  const diasConEvento = new Set(eventos.map((e) => claveDia(e.fecha)))
  const celdas = celdasDelMes(mesVisible.anio, mesVisible.mes)

  const visibles = eventos.filter(
    (e) => (filtro === 'todos' || e.modalidad === filtro) && (!diaSeleccionado || claveDia(e.fecha) === diaSeleccionado),
  )

  function cambiarMes(delta: number) {
    setMesVisible(({ anio, mes }) => {
      const fecha = new Date(anio, mes + delta, 1)
      return { anio: fecha.getFullYear(), mes: fecha.getMonth() }
    })
    setDiaSeleccionado(null)
  }

  return (
    <div className={ui.pantalla}>
      <Cabecera titulo="Eventos" atras="/inicio" />

      <main className={ui.cuerpo}>
        <section className={styles.calendario} aria-labelledby="titulo-mes">
          <div className={styles.mes}>
            <BotonIcono icono="atras" etiqueta="Mes anterior" onClick={() => cambiarMes(-1)} />
            <h2 id="titulo-mes" className={styles.mesTitulo} aria-live="polite">
              {tituloMes(mesVisible.anio, mesVisible.mes)}
            </h2>
            <BotonIcono icono="adelante" etiqueta="Mes siguiente" onClick={() => cambiarMes(1)} />
          </div>

          <div className={styles.grilla} role="grid" aria-labelledby="titulo-mes">
            <div role="row" className={styles.fila}>
              {INICIALES_SEMANA.map((inicial, i) => (
                <span key={i} role="columnheader" className={styles.diaSemana}>
                  {inicial}
                </span>
              ))}
            </div>
            {Array.from({ length: celdas.length / 7 }, (_, semana) => (
              <div role="row" key={semana} className={styles.fila}>
                {celdas.slice(semana * 7, semana * 7 + 7).map((fecha, i) => {
                  if (!fecha) return <span key={i} role="gridcell" />
                  const clave = claveDia(fecha)
                  const tieneEvento = diasConEvento.has(clave)
                  const esHoy = clave === claveDia(hoy)
                  const clases = cx(
                    styles.celda,
                    esHoy && styles.hoy,
                    tieneEvento && styles.conEvento,
                    diaSeleccionado === clave && styles.seleccionado,
                  )
                  return (
                    <span key={clave} role="gridcell">
                      {tieneEvento ? (
                        <button
                          type="button"
                          className={clases}
                          aria-pressed={diaSeleccionado === clave}
                          aria-label={`${fechaLarga(fecha)}, tiene eventos`}
                          onClick={() => setDiaSeleccionado((actual) => (actual === clave ? null : clave))}
                        >
                          {fecha.getDate()}
                        </button>
                      ) : (
                        <span className={clases} aria-label={esHoy ? `Hoy, ${fechaLarga(fecha)}` : undefined}>
                          {fecha.getDate()}
                        </span>
                      )}
                    </span>
                  )
                })}
              </div>
            ))}
          </div>
        </section>

        <section className={ui.seccion}>
          <div className={ui.seccionCabecera}>
            <h2 className={ui.seccionTitulo}>{plural(visibles.length, 'evento', 'eventos')}</h2>
            {diaSeleccionado && (
              <button type="button" className={styles.limpiar} onClick={() => setDiaSeleccionado(null)}>
                Ver todas las fechas
              </button>
            )}
          </div>

          <div role="radiogroup" aria-label="Filtrar por modalidad" className={ui.carrusel}>
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

          {visibles.length === 0 ? (
            <p className={ui.vacio}>No hay eventos con estos filtros.</p>
          ) : (
            <ul className={ui.lista}>
              {visibles.map((e) => {
                const inscrita = inscritos.includes(e.id)
                return (
                  <li key={e.id} className={ui.tarjeta}>
                    <div className={ui.fila}>
                      <span className={ui.fechaCaja}>
                        <span className={ui.fechaCajaDia}>{e.fecha.getDate()}</span>
                        <span className={ui.fechaCajaMes}>{mesCorto(e.fecha)}</span>
                      </span>
                      <div className={ui.crece}>
                        <span className={ui.titulo}>{e.titulo}</span>
                        <span className={styles.detalle}>
                          <Icono nombre="reloj" tamano={15} />
                          {diaSemanaCorto(e.fecha)} · {e.hora} · {e.duracionMin} min
                        </span>
                        <span className={styles.detalle}>
                          <Icono nombre={e.modalidad === 'virtual' ? 'video' : 'ubicacion'} tamano={15} />
                          {e.modalidad === 'virtual' ? `Virtual · ${e.lugar}` : `Presencial · ${e.lugar}`}
                        </span>
                      </div>
                    </div>
                    <p className={ui.lead}>{e.descripcion}</p>
                    <button
                      type="button"
                      className={cx(ui.boton, ui.compacto, inscrita ? ui.suave : ui.primario)}
                      aria-pressed={inscrita}
                      onClick={() => alternarEvento(e.id)}
                    >
                      {inscrita && <Icono nombre="check" tamano={16} strokeWidth={2.5} />}
                      {inscrita ? 'Inscrita' : 'Inscribirme'}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

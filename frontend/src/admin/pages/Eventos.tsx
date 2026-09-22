import { useState } from 'react'
import { ApiError } from '../../lib/api'
import { useActualizarEvento, useCrearEvento, useEliminarEvento, useEventosAdmin } from '../api/eventos'
import type { EventoAdmin, EventoFormulario } from '../types'
import styles from '../admin.module.css'

const EVENTO_VACIO: EventoFormulario = {
  titulo: '',
  fecha: new Date().toISOString().slice(0, 10),
  hora: '18:00',
  duracionMin: 45,
  modalidad: 'virtual',
  lugar: '',
  descripcion: '',
}

export default function Eventos() {
  const { data: eventos, isLoading } = useEventosAdmin()
  const crear = useCrearEvento()
  const actualizar = useActualizarEvento()
  const eliminar = useEliminarEvento()
  const [enEdicion, setEnEdicion] = useState<EventoAdmin | 'nuevo' | null>(null)
  const [error, setError] = useState('')

  function manejarError(err: unknown) {
    setError(err instanceof ApiError ? err.message : 'No se pudo completar la acción.')
    window.setTimeout(() => setError(''), 5000)
  }

  function borrar(e: EventoAdmin) {
    if (!window.confirm(`¿Eliminar el evento "${e.titulo}"?${e.totalInscritas > 0 ? ` ${e.totalInscritas} usuaria(s) están inscritas.` : ''}`)) return
    eliminar.mutate(e.id, { onError: manejarError })
  }

  return (
    <div>
      <header className={styles.cabecera}>
        <div>
          <h1 className={styles.titulo}>Eventos</h1>
          <p className={styles.subtitulo}>Charlas, talleres y encuentros de la comunidad.</p>
        </div>
        <button type="button" className={styles.boton} onClick={() => setEnEdicion('nuevo')}>
          Nuevo evento
        </button>
      </header>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.envoltorioTabla}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Modalidad</th>
              <th>Lugar</th>
              <th>Inscritas</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(eventos ?? []).map((e) => (
              <tr key={e.id}>
                <td>{e.titulo}</td>
                <td>{e.fecha}</td>
                <td>{e.hora}</td>
                <td>{e.modalidad === 'virtual' ? 'Virtual' : 'Presencial'}</td>
                <td>{e.lugar}</td>
                <td>{e.totalInscritas}</td>
                <td className={styles.celdaAcciones}>
                  <button type="button" className={`${styles.boton} ${styles.botonSecundario} ${styles.botonChico}`} onClick={() => setEnEdicion(e)}>
                    Editar
                  </button>
                  <button type="button" className={`${styles.boton} ${styles.botonPeligro} ${styles.botonChico}`} onClick={() => borrar(e)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {!isLoading && (eventos ?? []).length === 0 && (
              <tr>
                <td colSpan={7} className={styles.vacio}>
                  Todavía no hay eventos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {enEdicion && (
        <FormularioEvento
          evento={enEdicion === 'nuevo' ? null : enEdicion}
          guardando={crear.isPending || actualizar.isPending}
          onCerrar={() => setEnEdicion(null)}
          onGuardar={(datos) => {
            const promesa = enEdicion === 'nuevo' ? crear.mutateAsync(datos) : actualizar.mutateAsync({ id: enEdicion.id, ...datos })
            promesa.then(() => setEnEdicion(null)).catch(manejarError)
          }}
        />
      )}
    </div>
  )
}

function FormularioEvento({
  evento,
  onGuardar,
  onCerrar,
  guardando,
}: {
  evento: EventoAdmin | null
  onGuardar: (datos: EventoFormulario) => void
  onCerrar: () => void
  guardando: boolean
}) {
  const [datos, setDatos] = useState<EventoFormulario>(evento ?? EVENTO_VACIO)
  const valido = datos.titulo.trim().length > 1 && datos.lugar.trim().length > 1 && datos.descripcion.trim().length > 1

  return (
    <div className={styles.panelFormulario} onClick={onCerrar}>
      <form
        className={styles.formulario}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault()
          if (valido) onGuardar(datos)
        }}
      >
        <h2 className={styles.titulo} style={{ fontSize: 20 }}>
          {evento ? 'Editar evento' : 'Nuevo evento'}
        </h2>

        <div className={styles.campo}>
          <label htmlFor="titulo-evento">Título</label>
          <input id="titulo-evento" className={styles.entrada} value={datos.titulo} onChange={(e) => setDatos({ ...datos, titulo: e.target.value })} />
        </div>

        <div className={styles.dosColumnas}>
          <div className={styles.campo}>
            <label htmlFor="fecha">Fecha</label>
            <input id="fecha" type="date" className={styles.entrada} value={datos.fecha} onChange={(e) => setDatos({ ...datos, fecha: e.target.value })} />
          </div>
          <div className={styles.campo}>
            <label htmlFor="hora">Hora</label>
            <input id="hora" type="time" className={styles.entrada} value={datos.hora} onChange={(e) => setDatos({ ...datos, hora: e.target.value })} />
          </div>
        </div>

        <div className={styles.dosColumnas}>
          <div className={styles.campo}>
            <label htmlFor="duracion-evento">Duración (min)</label>
            <input
              id="duracion-evento"
              type="number"
              min={5}
              className={styles.entrada}
              value={datos.duracionMin}
              onChange={(e) => setDatos({ ...datos, duracionMin: Number(e.target.value) })}
            />
          </div>
          <div className={styles.campo}>
            <label htmlFor="modalidad">Modalidad</label>
            <select
              id="modalidad"
              className={styles.entrada}
              value={datos.modalidad}
              onChange={(e) => setDatos({ ...datos, modalidad: e.target.value as EventoFormulario['modalidad'] })}
            >
              <option value="virtual">Virtual</option>
              <option value="presencial">Presencial</option>
            </select>
          </div>
        </div>

        <div className={styles.campo}>
          <label htmlFor="lugar">Lugar {datos.modalidad === 'virtual' ? '(plataforma, ej. Zoom)' : '(ciudad o dirección)'}</label>
          <input id="lugar" className={styles.entrada} value={datos.lugar} onChange={(e) => setDatos({ ...datos, lugar: e.target.value })} />
        </div>
        <div className={styles.campo}>
          <label htmlFor="descripcion-evento">Descripción</label>
          <textarea id="descripcion-evento" className={styles.entrada} value={datos.descripcion} onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })} />
        </div>

        <div className={styles.accionesFormulario}>
          <button type="button" className={`${styles.boton} ${styles.botonSecundario}`} onClick={onCerrar}>
            Cancelar
          </button>
          <button type="submit" className={styles.boton} disabled={!valido || guardando}>
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}

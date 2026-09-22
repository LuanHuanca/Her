import { useEffect, useState } from 'react'
import { ApiError } from '../../lib/api'
import {
  useActualizarModulo,
  useActualizarTarea,
  useCrearModulo,
  useCrearTarea,
  useEliminarModulo,
  useEliminarTarea,
  useModulosAdmin,
  useTareasAdmin,
} from '../api/modulos'
import type { ModuloAdmin, ModuloFormulario, TareaAdmin, TareaFormulario } from '../types'
import styles from '../admin.module.css'

const MODULO_VACIO: ModuloFormulario = { numero: 1, titulo: '', corto: '', descripcion: '' }
const TAREA_VACIA: TareaFormulario = { dia: 1, titulo: '', frase: '', duracionSeg: 300, minutos: 10, puntos: 50, texto: [''], consigna: '' }

export default function Modulos() {
  const { data: modulos, isLoading } = useModulosAdmin()
  const crearModulo = useCrearModulo()
  const actualizarModulo = useActualizarModulo()
  const eliminarModulo = useEliminarModulo()

  const [moduloEnEdicion, setModuloEnEdicion] = useState<ModuloAdmin | 'nuevo' | null>(null)
  const [moduloParaTareas, setModuloParaTareas] = useState<ModuloAdmin | null>(null)
  const [error, setError] = useState('')

  function manejarError(err: unknown) {
    setError(err instanceof ApiError ? err.message : 'No se pudo completar la acción.')
    window.setTimeout(() => setError(''), 5000)
  }

  function eliminar(m: ModuloAdmin) {
    if (!window.confirm(`¿Eliminar el módulo "${m.titulo}" y sus ${m.totalTareas} tareas?`)) return
    eliminarModulo.mutate(m.id, { onError: manejarError })
  }

  return (
    <div>
      <header className={styles.cabecera}>
        <div>
          <h1 className={styles.titulo}>Módulos y retos</h1>
          <p className={styles.subtitulo}>Los 6 módulos de 21 días y las tareas de cada día.</p>
        </div>
        <button type="button" className={styles.boton} onClick={() => setModuloEnEdicion('nuevo')}>
          Nuevo módulo
        </button>
      </header>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.envoltorioTabla}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Nombre corto</th>
              <th>Tareas</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(modulos ?? []).map((m) => (
              <tr key={m.id}>
                <td>{m.numero}</td>
                <td>{m.titulo}</td>
                <td>{m.corto}</td>
                <td>{m.totalTareas} / 21</td>
                <td className={styles.celdaAcciones}>
                  <button type="button" className={`${styles.boton} ${styles.botonSecundario} ${styles.botonChico}`} onClick={() => setModuloParaTareas(m)}>
                    Ver tareas
                  </button>
                  <button type="button" className={`${styles.boton} ${styles.botonSecundario} ${styles.botonChico}`} onClick={() => setModuloEnEdicion(m)}>
                    Editar
                  </button>
                  <button type="button" className={`${styles.boton} ${styles.botonPeligro} ${styles.botonChico}`} onClick={() => eliminar(m)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {!isLoading && (modulos ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className={styles.vacio}>
                  Todavía no hay módulos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {moduloEnEdicion && (
        <FormularioModulo
          modulo={moduloEnEdicion === 'nuevo' ? null : moduloEnEdicion}
          onGuardar={(datos) => {
            const promesa =
              moduloEnEdicion === 'nuevo' ? crearModulo.mutateAsync(datos) : actualizarModulo.mutateAsync({ id: moduloEnEdicion.id, ...datos })
            promesa.then(() => setModuloEnEdicion(null)).catch(manejarError)
          }}
          onCerrar={() => setModuloEnEdicion(null)}
          guardando={crearModulo.isPending || actualizarModulo.isPending}
        />
      )}

      {moduloParaTareas && <PanelTareas modulo={moduloParaTareas} onCerrar={() => setModuloParaTareas(null)} />}
    </div>
  )
}

function FormularioModulo({
  modulo,
  onGuardar,
  onCerrar,
  guardando,
}: {
  modulo: ModuloAdmin | null
  onGuardar: (datos: ModuloFormulario) => void
  onCerrar: () => void
  guardando: boolean
}) {
  const [datos, setDatos] = useState<ModuloFormulario>(modulo ?? MODULO_VACIO)
  const valido = datos.titulo.trim().length > 1 && datos.corto.trim().length > 1 && datos.descripcion.trim().length > 1

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
          {modulo ? 'Editar módulo' : 'Nuevo módulo'}
        </h2>

        <div className={styles.campo}>
          <label htmlFor="numero">Número (orden en la ruta)</label>
          <input
            id="numero"
            type="number"
            min={1}
            className={styles.entrada}
            value={datos.numero}
            onChange={(e) => setDatos({ ...datos, numero: Number(e.target.value) })}
          />
        </div>
        <div className={styles.campo}>
          <label htmlFor="titulo">Título</label>
          <input id="titulo" className={styles.entrada} value={datos.titulo} onChange={(e) => setDatos({ ...datos, titulo: e.target.value })} />
        </div>
        <div className={styles.campo}>
          <label htmlFor="corto">Nombre corto</label>
          <input id="corto" className={styles.entrada} value={datos.corto} onChange={(e) => setDatos({ ...datos, corto: e.target.value })} />
        </div>
        <div className={styles.campo}>
          <label htmlFor="descripcion">Descripción</label>
          <textarea id="descripcion" className={styles.entrada} value={datos.descripcion} onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })} />
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

function PanelTareas({ modulo, onCerrar }: { modulo: ModuloAdmin; onCerrar: () => void }) {
  const { data: tareas, isLoading } = useTareasAdmin(modulo.id)
  const crearTarea = useCrearTarea(modulo.id)
  const actualizarTarea = useActualizarTarea(modulo.id)
  const eliminarTarea = useEliminarTarea(modulo.id)
  const [tareaEnEdicion, setTareaEnEdicion] = useState<TareaAdmin | 'nueva' | null>(null)
  const [error, setError] = useState('')

  function manejarError(err: unknown) {
    setError(err instanceof ApiError ? err.message : 'No se pudo completar la acción.')
    window.setTimeout(() => setError(''), 5000)
  }

  function eliminar(t: TareaAdmin) {
    if (!window.confirm(`¿Eliminar la tarea del día ${t.dia}?`)) return
    eliminarTarea.mutate(t.id, { onError: manejarError })
  }

  return (
    <div className={styles.panelFormulario} onClick={onCerrar}>
      <div className={styles.formulario} onClick={(e) => e.stopPropagation()} style={{ gap: 12 }}>
        {tareaEnEdicion ? (
          <FormularioTarea
            tarea={tareaEnEdicion === 'nueva' ? null : tareaEnEdicion}
            onCancelar={() => setTareaEnEdicion(null)}
            onGuardar={(datos) => {
              const promesa =
                tareaEnEdicion === 'nueva' ? crearTarea.mutateAsync(datos) : actualizarTarea.mutateAsync({ id: tareaEnEdicion.id, ...datos })
              promesa.then(() => setTareaEnEdicion(null)).catch(manejarError)
            }}
            guardando={crearTarea.isPending || actualizarTarea.isPending}
          />
        ) : (
          <>
            <div className={styles.cabecera} style={{ marginBottom: 4 }}>
              <div>
                <h2 className={styles.titulo} style={{ fontSize: 20 }}>
                  {modulo.titulo}
                </h2>
                <p className={styles.subtitulo}>Tareas de los 21 días</p>
              </div>
              <button type="button" className={styles.boton} onClick={() => setTareaEnEdicion('nueva')}>
                Nueva tarea
              </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            {isLoading && <p className={styles.vacio}>Cargando…</p>}
            {!isLoading && (tareas ?? []).length === 0 && <p className={styles.vacio}>Este módulo todavía no tiene tareas.</p>}

            {(tareas ?? []).map((t) => (
              <div key={t.id} className={styles.tarjeta} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <div>
                  <strong>Día {t.dia}</strong> · {t.titulo}
                  <div className={styles.subtitulo}>{t.consigna}</div>
                </div>
                <div className={styles.celdaAcciones}>
                  <button type="button" className={`${styles.boton} ${styles.botonSecundario} ${styles.botonChico}`} onClick={() => setTareaEnEdicion(t)}>
                    Editar
                  </button>
                  <button type="button" className={`${styles.boton} ${styles.botonPeligro} ${styles.botonChico}`} onClick={() => eliminar(t)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            <div className={styles.accionesFormulario}>
              <button type="button" className={`${styles.boton} ${styles.botonSecundario}`} onClick={onCerrar}>
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function FormularioTarea({
  tarea,
  onGuardar,
  onCancelar,
  guardando,
}: {
  tarea: TareaAdmin | null
  onGuardar: (datos: TareaFormulario) => void
  onCancelar: () => void
  guardando: boolean
}) {
  const [datos, setDatos] = useState<TareaFormulario>(tarea ?? TAREA_VACIA)
  const [textoPlano, setTextoPlano] = useState((tarea?.texto ?? ['']).join('\n\n'))

  useEffect(() => {
    setDatos((d) => ({ ...d, texto: textoPlano.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) }))
  }, [textoPlano])

  const valido = datos.titulo.trim().length > 1 && datos.consigna.trim().length > 1 && datos.texto.length > 0

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (valido) onGuardar(datos)
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <h2 className={styles.titulo} style={{ fontSize: 20 }}>
        {tarea ? `Editar tarea (día ${tarea.dia})` : 'Nueva tarea'}
      </h2>

      <div className={styles.dosColumnas}>
        <div className={styles.campo}>
          <label htmlFor="dia">Día (1-21)</label>
          <input id="dia" type="number" min={1} max={21} className={styles.entrada} value={datos.dia} onChange={(e) => setDatos({ ...datos, dia: Number(e.target.value) })} />
        </div>
        <div className={styles.campo}>
          <label htmlFor="puntos">Puntos</label>
          <input id="puntos" type="number" min={1} className={styles.entrada} value={datos.puntos} onChange={(e) => setDatos({ ...datos, puntos: Number(e.target.value) })} />
        </div>
      </div>

      <div className={styles.campo}>
        <label htmlFor="titulo-tarea">Título</label>
        <input id="titulo-tarea" className={styles.entrada} value={datos.titulo} onChange={(e) => setDatos({ ...datos, titulo: e.target.value })} />
      </div>
      <div className={styles.campo}>
        <label htmlFor="frase">Frase destacada</label>
        <input id="frase" className={styles.entrada} value={datos.frase} onChange={(e) => setDatos({ ...datos, frase: e.target.value })} />
      </div>
      <div className={styles.campo}>
        <label htmlFor="texto">Texto (separa párrafos con una línea en blanco)</label>
        <textarea id="texto" className={styles.entrada} style={{ minHeight: 140 }} value={textoPlano} onChange={(e) => setTextoPlano(e.target.value)} />
      </div>
      <div className={styles.campo}>
        <label htmlFor="consigna">Consigna (tarea que escribe la usuaria)</label>
        <input id="consigna" className={styles.entrada} value={datos.consigna} onChange={(e) => setDatos({ ...datos, consigna: e.target.value })} />
      </div>

      <div className={styles.dosColumnas}>
        <div className={styles.campo}>
          <label htmlFor="minutos">Minutos estimados</label>
          <input id="minutos" type="number" min={1} className={styles.entrada} value={datos.minutos} onChange={(e) => setDatos({ ...datos, minutos: Number(e.target.value) })} />
        </div>
        <div className={styles.campo}>
          <label htmlFor="duracion">Duración del audio (seg)</label>
          <input id="duracion" type="number" min={30} className={styles.entrada} value={datos.duracionSeg} onChange={(e) => setDatos({ ...datos, duracionSeg: Number(e.target.value) })} />
        </div>
      </div>

      <div className={styles.accionesFormulario}>
        <button type="button" className={`${styles.boton} ${styles.botonSecundario}`} onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className={styles.boton} disabled={!valido || guardando}>
          {guardando ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}

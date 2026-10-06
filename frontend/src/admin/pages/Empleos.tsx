import { useState } from 'react'
import { ApiError } from '../../lib/api'
import {
  useActualizarEmpleo,
  useCrearEmpleo,
  useCrearEmpresa,
  useEliminarEmpleo,
  useEliminarEmpresa,
  useEmpleosAdmin,
  useEmpresasAdmin,
} from '../api/empleos'
import type { EmpleoAdmin, EmpleoFormulario } from '../types'
import styles from '../admin.module.css'

const EMPLEO_VACIO: Omit<EmpleoFormulario, 'empresaId'> = {
  puesto: '',
  ciudad: 'Cochabamba',
  jornada: 'Tiempo completo',
  modalidad: 'Presencial',
  descripcion: '',
  requisitos: [],
  coincidencias: [],
}

export default function Empleos() {
  const { data: empleos, isLoading } = useEmpleosAdmin()
  const { data: empresas } = useEmpresasAdmin()
  const crear = useCrearEmpleo()
  const actualizar = useActualizarEmpleo()
  const eliminar = useEliminarEmpleo()
  const crearEmpresa = useCrearEmpresa()
  const eliminarEmpresa = useEliminarEmpresa()

  const [enEdicion, setEnEdicion] = useState<EmpleoAdmin | 'nuevo' | null>(null)
  const [mostrarEmpresas, setMostrarEmpresas] = useState(false)
  const [error, setError] = useState('')

  function manejarError(err: unknown) {
    setError(err instanceof ApiError ? err.message : 'No se pudo completar la acción.')
    window.setTimeout(() => setError(''), 5000)
  }

  function borrar(e: EmpleoAdmin) {
    if (!window.confirm(`¿Eliminar la oferta "${e.puesto}"? Se perderán sus ${e.totalPostulaciones} postulación(es).`)) return
    eliminar.mutate(e.id, { onError: manejarError })
  }

  if (!empresas || empresas.length === 0) {
    return (
      <div>
        <header className={styles.cabecera}>
          <div>
            <h1 className={styles.titulo}>Empleos</h1>
            <p className={styles.subtitulo}>Primero necesitas al menos una empresa.</p>
          </div>
        </header>
        <PanelEmpresas empresas={empresas ?? []} crear={crearEmpresa} eliminar={eliminarEmpresa} onError={manejarError} inline />
      </div>
    )
  }

  return (
    <div>
      <header className={styles.cabecera}>
        <div>
          <h1 className={styles.titulo}>Empleos</h1>
          <p className={styles.subtitulo}>Ofertas visibles en la bolsa de empleo.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className={`${styles.boton} ${styles.botonSecundario}`} onClick={() => setMostrarEmpresas(true)}>
            Empresas
          </button>
          <button type="button" className={styles.boton} onClick={() => setEnEdicion('nuevo')}>
            Nueva oferta
          </button>
        </div>
      </header>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.envoltorioTabla}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Puesto</th>
              <th>Empresa</th>
              <th>Ciudad</th>
              <th>Jornada</th>
              <th>Modalidad</th>
              <th>Postulaciones</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(empleos ?? []).map((e) => (
              <tr key={e.id}>
                <td>{e.puesto}</td>
                <td>{e.empresaNombre}</td>
                <td>{e.ciudad}</td>
                <td>{e.jornada}</td>
                <td>{e.modalidad}</td>
                <td>{e.totalPostulaciones}</td>
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
            {!isLoading && (empleos ?? []).length === 0 && (
              <tr>
                <td colSpan={7} className={styles.vacio}>
                  Todavía no hay ofertas publicadas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {enEdicion && (
        <FormularioEmpleo
          empleo={enEdicion === 'nuevo' ? null : enEdicion}
          empresas={empresas}
          guardando={crear.isPending || actualizar.isPending}
          onCerrar={() => setEnEdicion(null)}
          onGuardar={(datos) => {
            const promesa = enEdicion === 'nuevo' ? crear.mutateAsync(datos) : actualizar.mutateAsync({ id: enEdicion.id, ...datos })
            promesa.then(() => setEnEdicion(null)).catch(manejarError)
          }}
        />
      )}

      {mostrarEmpresas && (
        <div className={styles.panelFormulario} onClick={() => setMostrarEmpresas(false)}>
          <div className={styles.formulario} onClick={(e) => e.stopPropagation()}>
            <PanelEmpresas empresas={empresas} crear={crearEmpresa} eliminar={eliminarEmpresa} onError={manejarError} />
            <div className={styles.accionesFormulario}>
              <button type="button" className={`${styles.boton} ${styles.botonSecundario}`} onClick={() => setMostrarEmpresas(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PanelEmpresas({
  empresas,
  crear,
  eliminar,
  onError,
  inline,
}: {
  empresas: { id: number; nombre: string; totalEmpleos: number }[]
  crear: ReturnType<typeof useCrearEmpresa>
  eliminar: ReturnType<typeof useEliminarEmpresa>
  onError: (err: unknown) => void
  inline?: boolean
}) {
  const [nombre, setNombre] = useState('')

  return (
    <div>
      <h2 className={styles.titulo} style={{ fontSize: 20 }}>
        Empresas
      </h2>
      <p className={styles.subtitulo}>Las empresas que publican empleos en la app.</p>

      <form
        style={{ display: 'flex', gap: 8, margin: '16px 0' }}
        onSubmit={(e) => {
          e.preventDefault()
          const limpio = nombre.trim()
          if (!limpio) return
          crear.mutate(limpio, { onSuccess: () => setNombre(''), onError })
        }}
      >
        <input className={styles.entrada} style={{ flex: 1 }} placeholder="Nombre de la empresa" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <button type="submit" className={styles.boton} disabled={!nombre.trim() || crear.isPending}>
          Agregar
        </button>
      </form>

      {empresas.map((e) => (
        <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--her-linea-suave)' }}>
          <span>
            {e.nombre} <span className={styles.subtitulo}>({e.totalEmpleos} empleo(s))</span>
          </span>
          <button
            type="button"
            className={`${styles.boton} ${styles.botonPeligro} ${styles.botonChico}`}
            onClick={() => {
              if (window.confirm(`¿Eliminar la empresa "${e.nombre}"?`)) eliminar.mutate(e.id, { onError })
            }}
          >
            Eliminar
          </button>
        </div>
      ))}
      {inline && empresas.length === 0 && <p className={styles.vacio}>Agrega una empresa para poder publicar empleos.</p>}
    </div>
  )
}

function FormularioEmpleo({
  empleo,
  empresas,
  onGuardar,
  onCerrar,
  guardando,
}: {
  empleo: EmpleoAdmin | null
  empresas: { id: number; nombre: string }[]
  onGuardar: (datos: EmpleoFormulario) => void
  onCerrar: () => void
  guardando: boolean
}) {
  const [datos, setDatos] = useState<EmpleoFormulario>(empleo ?? { ...EMPLEO_VACIO, empresaId: empresas[0]?.id ?? 0 })
  const [requisitosPlano, setRequisitosPlano] = useState((empleo?.requisitos ?? []).join('\n'))
  const [coincidenciasPlano, setCoincidenciasPlano] = useState((empleo?.coincidencias ?? []).join('\n'))

  const valido = datos.puesto.trim().length > 1 && datos.descripcion.trim().length > 1 && datos.empresaId > 0

  function enviar() {
    onGuardar({
      ...datos,
      requisitos: requisitosPlano.split('\n').map((r) => r.trim()).filter(Boolean),
      coincidencias: coincidenciasPlano.split('\n').map((r) => r.trim()).filter(Boolean),
    })
  }

  return (
    <div className={styles.panelFormulario} onClick={onCerrar}>
      <form
        className={styles.formulario}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault()
          if (valido) enviar()
        }}
      >
        <h2 className={styles.titulo} style={{ fontSize: 20 }}>
          {empleo ? 'Editar oferta' : 'Nueva oferta'}
        </h2>

        <div className={styles.campo}>
          <label htmlFor="puesto">Puesto</label>
          <input id="puesto" className={styles.entrada} value={datos.puesto} onChange={(e) => setDatos({ ...datos, puesto: e.target.value })} />
        </div>

        <div className={styles.campo}>
          <label htmlFor="empresa">Empresa</label>
          <select id="empresa" className={styles.entrada} value={datos.empresaId} onChange={(e) => setDatos({ ...datos, empresaId: Number(e.target.value) })}>
            {empresas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.dosColumnas}>
          <div className={styles.campo}>
            <label htmlFor="ciudad-empleo">Ciudad</label>
            <input id="ciudad-empleo" className={styles.entrada} value={datos.ciudad} onChange={(e) => setDatos({ ...datos, ciudad: e.target.value })} />
          </div>
          <div className={styles.campo}>
            <label htmlFor="jornada">Jornada</label>
            <select id="jornada" className={styles.entrada} value={datos.jornada} onChange={(e) => setDatos({ ...datos, jornada: e.target.value as EmpleoFormulario['jornada'] })}>
              <option value="Tiempo completo">Tiempo completo</option>
              <option value="Medio tiempo">Medio tiempo</option>
            </select>
          </div>
        </div>

        <div className={styles.campo}>
          <label htmlFor="modalidad-empleo">Modalidad</label>
          <select
            id="modalidad-empleo"
            className={styles.entrada}
            value={datos.modalidad}
            onChange={(e) => setDatos({ ...datos, modalidad: e.target.value as EmpleoFormulario['modalidad'] })}
          >
            <option value="Presencial">Presencial</option>
            <option value="Remoto">Remoto</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>

        <div className={styles.campo}>
          <label htmlFor="descripcion-empleo">Descripción</label>
          <textarea id="descripcion-empleo" className={styles.entrada} value={datos.descripcion} onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })} />
        </div>
        <div className={styles.campo}>
          <label htmlFor="requisitos">Requisitos (uno por línea)</label>
          <textarea id="requisitos" className={styles.entrada} value={requisitosPlano} onChange={(e) => setRequisitosPlano(e.target.value)} />
        </div>
        <div className={styles.campo}>
          <label htmlFor="coincidencias">Coincidencias destacadas (uno por línea)</label>
          <textarea id="coincidencias" className={styles.entrada} value={coincidenciasPlano} onChange={(e) => setCoincidenciasPlano(e.target.value)} />
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

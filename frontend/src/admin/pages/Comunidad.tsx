import { Fragment, useState } from 'react'
import { ApiError } from '../../lib/api'
import { useComentariosAdmin, useEliminarComentarioAdmin, useEliminarPublicacionAdmin, usePublicacionesAdmin } from '../api/comunidad'
import styles from '../admin.module.css'

export default function Comunidad() {
  const { data: publicaciones, isLoading } = usePublicacionesAdmin()
  const eliminarPublicacion = useEliminarPublicacionAdmin()
  const [expandida, setExpandida] = useState<number | null>(null)
  const [error, setError] = useState('')

  function manejarError(err: unknown) {
    setError(err instanceof ApiError ? err.message : 'No se pudo completar la acción.')
    window.setTimeout(() => setError(''), 5000)
  }

  function borrar(id: number, texto: string) {
    if (!window.confirm(`¿Eliminar la publicación "${texto.slice(0, 60)}${texto.length > 60 ? '…' : ''}"?`)) return
    eliminarPublicacion.mutate(id, { onError: manejarError })
  }

  return (
    <div>
      <header className={styles.cabecera}>
        <div>
          <h1 className={styles.titulo}>Comunidad</h1>
          <p className={styles.subtitulo}>Modera publicaciones y comentarios.</p>
        </div>
      </header>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.envoltorioTabla}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Autora</th>
              <th>Texto</th>
              <th>Etiqueta</th>
              <th>Likes</th>
              <th>Comentarios</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(publicaciones ?? []).map((p) => (
              <Fragment key={p.id}>
                <tr>
                  <td>{p.autoraNombre}</td>
                  <td style={{ maxWidth: 320 }}>{p.texto}</td>
                  <td>{p.etiqueta}</td>
                  <td>{p.likes}</td>
                  <td>
                    <button
                      type="button"
                      className={`${styles.boton} ${styles.botonSecundario} ${styles.botonChico}`}
                      onClick={() => setExpandida(expandida === p.id ? null : p.id)}
                      disabled={p.totalComentarios === 0}
                    >
                      {p.totalComentarios} {expandida === p.id ? '▲' : '▼'}
                    </button>
                  </td>
                  <td className={styles.celdaAcciones}>
                    <button type="button" className={`${styles.boton} ${styles.botonPeligro} ${styles.botonChico}`} onClick={() => borrar(p.id, p.texto)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
                {expandida === p.id && (
                  <tr>
                    <td colSpan={6} style={{ padding: 0 }}>
                      <ComentariosDePublicacion publicacionId={p.id} onError={manejarError} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {!isLoading && (publicaciones ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className={styles.vacio}>
                  No hay publicaciones todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ComentariosDePublicacion({ publicacionId, onError }: { publicacionId: number; onError: (err: unknown) => void }) {
  const { data: comentarios, isLoading } = useComentariosAdmin(publicacionId)
  const eliminarComentario = useEliminarComentarioAdmin(publicacionId)

  return (
    <div className={styles.listaExpandible}>
      {isLoading && <p className={styles.subtitulo}>Cargando comentarios…</p>}
      {(comentarios ?? []).map((c) => (
        <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--her-linea-suave)' }}>
          <div>
            <strong>{c.autoraNombre}</strong> <span className={styles.subtitulo}>· {c.hace}</span>
            <div>{c.texto}</div>
          </div>
          <button
            type="button"
            className={`${styles.boton} ${styles.botonPeligro} ${styles.botonChico}`}
            onClick={() => {
              if (window.confirm('¿Eliminar este comentario?')) eliminarComentario.mutate(c.id, { onError })
            }}
          >
            Eliminar
          </button>
        </div>
      ))}
      {!isLoading && (comentarios ?? []).length === 0 && <p className={styles.subtitulo}>Sin comentarios.</p>}
    </div>
  )
}

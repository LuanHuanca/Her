import { useState } from 'react'
import { useActualizarUsuarioAdmin, useEliminarUsuarioAdmin, useUsuariosAdmin } from '../api/usuarios'
import { ApiError } from '../../lib/api'
import { useAuthStore } from '../../store/useAuthStore'
import type { Rol } from '../../types'
import styles from '../admin.module.css'

export default function Usuarios() {
  const yo = useAuthStore((s) => s.usuario)
  const [busqueda, setBusqueda] = useState('')
  const { data, isLoading } = useUsuariosAdmin(busqueda)
  const actualizar = useActualizarUsuarioAdmin()
  const eliminar = useEliminarUsuarioAdmin()
  const [error, setError] = useState('')

  function manejarError(err: unknown) {
    setError(err instanceof ApiError ? err.message : 'No se pudo completar la acción.')
    window.setTimeout(() => setError(''), 5000)
  }

  function cambiarRol(id: number, rol: Rol) {
    actualizar.mutate({ id, rol }, { onError: manejarError })
  }

  function alternarActivo(id: number, activo: boolean) {
    actualizar.mutate({ id, activo: !activo }, { onError: manejarError })
  }

  function eliminarUsuario(id: number, nombre: string) {
    if (!window.confirm(`¿Eliminar la cuenta de ${nombre}? Esto borra también su progreso, publicaciones y postulaciones.`)) return
    eliminar.mutate(id, { onError: manejarError })
  }

  return (
    <div>
      <header className={styles.cabecera}>
        <div>
          <h1 className={styles.titulo}>Usuarias</h1>
          <p className={styles.subtitulo}>Gestiona roles y el acceso de cada cuenta.</p>
        </div>
        <input
          className={styles.entrada}
          style={{ width: 240 }}
          placeholder="Buscar por nombre o correo…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </header>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.envoltorioTabla}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Ciudad</th>
              <th>Rol</th>
              <th>Estado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.ciudad}</td>
                <td>
                  <select
                    className={styles.entrada}
                    style={{ minHeight: 32, padding: '0 8px' }}
                    value={u.rol}
                    disabled={u.id === yo?.id}
                    onChange={(e) => cambiarRol(u.id, e.target.value as Rol)}
                  >
                    <option value="usuaria">Usuaria</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className={`${styles.badge} ${u.activo ? styles.badgeExito : styles.badgePeligro}`}
                    style={{ border: 0, cursor: u.id === yo?.id ? 'default' : 'pointer' }}
                    disabled={u.id === yo?.id}
                    onClick={() => alternarActivo(u.id, u.activo)}
                  >
                    {u.activo ? 'Activa' : 'Desactivada'}
                  </button>
                </td>
                <td className={styles.celdaAcciones}>
                  <button
                    type="button"
                    className={`${styles.boton} ${styles.botonPeligro} ${styles.botonChico}`}
                    disabled={u.id === yo?.id}
                    onClick={() => eliminarUsuario(u.id, u.nombre)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {!isLoading && (data ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className={styles.vacio}>
                  No hay usuarias con esa búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAlternarLike } from '../api/comunidad'
import { cx } from '../lib/texto'
import ui from '../styles/ui.module.css'
import type { Publicacion } from '../types'
import Avatar from './Avatar'
import Icono from './Icono'
import { FotoIlustrada } from './Ilustraciones'
import styles from './TarjetaPublicacion.module.css'

interface Props {
  publicacion: Publicacion
  /** En el listado, el contador de comentarios lleva al detalle. */
  enlazarDetalle?: boolean
}

export default function TarjetaPublicacion({ publicacion: p, enlazarDetalle = true }: Props) {
  const alternarLike = useAlternarLike()
  const [copiado, setCopiado] = useState(false)

  async function compartir() {
    const url = `${window.location.origin}/comunidad/${p.id}`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Her', text: p.texto, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 2000)
    } catch {
      // La usuaria canceló el diálogo de compartir o el portapapeles no está disponible.
    }
  }

  const contenidoComentarios = (
    <>
      <Icono nombre="mensaje" tamano={20} />
      {p.comentarios.length}
      <span className="sr-only">comentarios</span>
    </>
  )

  return (
    <article className={ui.tarjeta}>
      <div className={ui.fila}>
        <Avatar persona={p.autora} tamano={42} />
        <div className={ui.crece}>
          <span className={styles.autora}>{p.autora.nombre}</span>
          <span className={ui.meta}>{p.hace}</span>
        </div>
        <span className={ui.chip}>{p.etiqueta}</span>
      </div>

      <p className={styles.texto}>{p.texto}</p>

      {p.foto && <FotoIlustrada descripcion={p.foto.descripcion} escena={p.foto.escena} />}

      <div className={styles.acciones}>
        <button
          type="button"
          className={cx(styles.accion, p.meGusta && styles.accionActiva)}
          aria-pressed={p.meGusta}
          onClick={() => alternarLike.mutate(p.id)}
        >
          <Icono nombre="corazon" tamano={20} relleno={p.meGusta} />
          {p.likes}
          <span className="sr-only">me gusta</span>
        </button>

        {enlazarDetalle ? (
          <Link to={`/comunidad/${p.id}`} className={styles.accion}>
            {contenidoComentarios}
          </Link>
        ) : (
          <span className={styles.accion}>{contenidoComentarios}</span>
        )}

        <button type="button" className={cx(styles.accion, styles.compartir)} onClick={compartir}>
          <Icono nombre={copiado ? 'check' : 'compartir'} tamano={20} />
          {copiado ? 'Enlace copiado' : 'Compartir'}
        </button>
      </div>
    </article>
  )
}

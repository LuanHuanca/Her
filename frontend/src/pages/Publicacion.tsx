import { useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import Avatar from '../components/Avatar'
import BotonIcono from '../components/BotonIcono'
import Cabecera from '../components/Cabecera'
import TarjetaPublicacion from '../components/TarjetaPublicacion'
import { PUBLICACIONES } from '../data/mock'
import { useHerStore } from '../store/useHerStore'
import ui from '../styles/ui.module.css'
import styles from './Publicacion.module.css'

export default function Publicacion() {
  const { id = '' } = useParams()
  const publicacionesPropias = useHerStore((s) => s.publicacionesPropias)
  const comentariosPropios = useHerStore((s) => s.comentariosPropios[id])
  const comentar = useHerStore((s) => s.comentar)
  const [texto, setTexto] = useState('')

  const publicacion = [...publicacionesPropias, ...PUBLICACIONES].find((p) => p.id === id)

  if (!publicacion) {
    return (
      <div className={ui.pantalla}>
        <Cabecera titulo="Publicación" atras="/comunidad" />
        <main className={ui.cuerpo}>
          <p className={ui.vacio}>Esta publicación ya no está disponible.</p>
        </main>
      </div>
    )
  }

  const comentarios = [...publicacion.comentarios, ...(comentariosPropios ?? [])]

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    const limpio = texto.trim()
    if (!limpio) return
    comentar(id, limpio)
    setTexto('')
  }

  return (
    <div className={ui.pantalla}>
      <Cabecera titulo="Publicación" atras="/comunidad" />

      <main className={ui.cuerpo}>
        <TarjetaPublicacion publicacion={publicacion} enlazarDetalle={false} />

        <section className={ui.seccion} aria-labelledby="titulo-comentarios">
          <h2 id="titulo-comentarios" className={ui.seccionTitulo}>
            Comentarios
          </h2>
          {comentarios.length === 0 ? (
            <p className={ui.vacio}>Sé la primera en dejar un mensaje de ánimo.</p>
          ) : (
            <ul className={ui.lista}>
              {comentarios.map((c) => (
                <li key={c.id} className={styles.comentario}>
                  <Avatar persona={c.autora} tamano={40} />
                  <div className={styles.burbuja}>
                    <div className={styles.comentarioCabecera}>
                      <span className={styles.nombre}>{c.autora.nombre}</span>
                      <span className={ui.meta}>{c.hace}</span>
                    </div>
                    <p className={styles.texto}>{c.texto}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <form className={`${ui.pie} ${styles.formulario}`} onSubmit={enviar}>
        <label htmlFor="comentario" className="sr-only">
          Escribe un comentario
        </label>
        <input
          id="comentario"
          className={ui.entrada}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe un comentario…"
          autoComplete="off"
        />
        <BotonIcono tipo="submit" icono="enviar" etiqueta="Enviar comentario" primario disabled={!texto.trim()} />
      </form>
    </div>
  )
}

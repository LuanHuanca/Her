import { useMemo, useRef, useState, type FormEvent } from 'react'
import { useCrearPublicacion, usePublicaciones } from '../api/comunidad'
import { useChats } from '../api/mensajes'
import { usePerfil } from '../api/perfil'
import Avatar from '../components/Avatar'
import Boton from '../components/Boton'
import BotonIcono from '../components/BotonIcono'
import Buscador from '../components/Buscador'
import Icono from '../components/Icono'
import TarjetaPublicacion from '../components/TarjetaPublicacion'
import { HISTORIAS } from '../data/mock'
import { iniciales, normalizar, primerNombre } from '../lib/texto'
import ui from '../styles/ui.module.css'
import styles from './Comunidad.module.css'

export default function Comunidad() {
  const { data: perfil } = usePerfil()
  const { data: publicaciones } = usePublicaciones()
  const { data: chats } = useChats()
  const crearPublicacion = useCrearPublicacion()

  const [busqueda, setBusqueda] = useState('')
  const [borrador, setBorrador] = useState('')
  const campoRef = useRef<HTMLTextAreaElement>(null)

  const consulta = normalizar(busqueda)
  const visibles = useMemo(() => {
    const lista = publicaciones ?? []
    return consulta
      ? lista.filter((p) => normalizar(`${p.autora.nombre} ${p.texto} ${p.etiqueta}`).includes(consulta))
      : lista
  }, [publicaciones, consulta])
  const hayMensajesSinLeer = (chats ?? []).some((c) => c.noLeidos > 0)

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    const texto = borrador.trim()
    if (!texto) return
    crearPublicacion.mutate(texto, { onSuccess: () => setBorrador('') })
  }

  if (!perfil) {
    return (
      <div className={ui.pantalla}>
        <p className={ui.vacio}>Cargando…</p>
      </div>
    )
  }

  return (
    <div className={ui.pantalla}>
      <header className={styles.cabecera}>
        <div className={ui.seccionCabecera}>
          <h1 className={ui.tituloDisplay}>Comunidad</h1>
          <BotonIcono
            to="/mensajes"
            icono="mensaje"
            etiqueta={hayMensajesSinLeer ? 'Mensajes, tienes mensajes sin leer' : 'Mensajes'}
            punto={hayMensajesSinLeer}
          />
        </div>
        <Buscador valor={busqueda} onCambio={setBusqueda} placeholder="Buscar amigas o temas" etiqueta="Buscar en la comunidad" />
      </header>

      <main className={ui.cuerpo}>
        <ul className={styles.historias} aria-label="Amigas activas hoy">
          <li>
            <button type="button" className={styles.historia} onClick={() => campoRef.current?.focus()}>
              <span className={styles.historiaNueva}>
                <Icono nombre="agregar" tamano={24} strokeWidth={2.2} />
              </span>
              Tu avance
            </button>
          </li>
          {HISTORIAS.map((persona, i) => (
            <li key={persona.nombre} className={styles.historia}>
              <Avatar persona={persona} tamano={60} anillo={i < 2} />
              {primerNombre(persona.nombre)}
            </li>
          ))}
        </ul>

        <form className={styles.compositor} onSubmit={enviar}>
          <div className={styles.compositorFila}>
            <Avatar persona={{ nombre: perfil.nombre, iniciales: iniciales(perfil.nombre), tono: 'rosa' }} tamano={40} />
            <label htmlFor="nueva-publicacion" className="sr-only">
              Escribe una publicación
            </label>
            <textarea
              id="nueva-publicacion"
              ref={campoRef}
              className={styles.compositorCampo}
              rows={borrador ? 3 : 1}
              value={borrador}
              onChange={(e) => setBorrador(e.target.value)}
              placeholder="¿Qué lograste hoy?"
            />
          </div>
          {borrador.trim() && (
            <Boton type="submit" compacto className={styles.publicar} disabled={crearPublicacion.isPending}>
              {crearPublicacion.isPending ? 'Publicando…' : 'Publicar'}
            </Boton>
          )}
        </form>

        {visibles.length > 0 ? (
          <div className={ui.lista}>
            {visibles.map((p) => (
              <TarjetaPublicacion key={p.id} publicacion={p} />
            ))}
          </div>
        ) : (
          <p className={ui.vacio}>
            {publicaciones === undefined ? 'Cargando publicaciones…' : `No encontramos publicaciones para “${busqueda}”.`}
          </p>
        )}
      </main>
    </div>
  )
}

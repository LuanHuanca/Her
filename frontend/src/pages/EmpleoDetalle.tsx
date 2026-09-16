import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Avatar from '../components/Avatar'
import Boton from '../components/Boton'
import Cabecera from '../components/Cabecera'
import Icono from '../components/Icono'
import { CvIlustrado } from '../components/Ilustraciones'
import { EMPLEOS } from '../data/mock'
import { cx } from '../lib/texto'
import { useHerStore } from '../store/useHerStore'
import ui from '../styles/ui.module.css'
import styles from './EmpleoDetalle.module.css'

export default function EmpleoDetalle() {
  const { id } = useParams()
  const empleo = EMPLEOS.find((e) => e.id === id)
  const guardado = useHerStore((s) => (empleo ? s.empleosGuardados.includes(empleo.id) : false))
  const postulada = useHerStore((s) => (empleo ? s.postulaciones.includes(empleo.id) : false))
  const alternarGuardado = useHerStore((s) => s.alternarGuardado)
  const [copiado, setCopiado] = useState(false)

  if (!empleo) {
    return (
      <div className={ui.pantalla}>
        <Cabecera titulo="Empleabilidad" atras="/empleos" />
        <main className={ui.cuerpo}>
          <p className={ui.vacio}>Esta oferta ya no está disponible.</p>
        </main>
      </div>
    )
  }

  async function compartir() {
    if (!empleo) return
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: empleo.puesto, text: `${empleo.puesto} en ${empleo.empresa.nombre}`, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 2000)
    } catch {
      // Compartir cancelado o portapapeles no disponible.
    }
  }

  return (
    <div className={ui.pantalla}>
      <Cabecera titulo="Empleabilidad" atras="/empleos" />

      <main className={ui.cuerpo}>
        <article className={ui.tarjeta}>
          <div className={ui.fila}>
            <Avatar persona={empleo.publica} tamano={44} />
            <div className={ui.crece}>
              <span className={styles.publica}>{empleo.publica.nombre}</span>
              <span className={ui.meta}>{empleo.hace}</span>
            </div>
          </div>

          <dl className={styles.datos}>
            <div>
              <dt>Puesto:</dt>
              <dd>{empleo.puesto}</dd>
            </div>
            <div>
              <dt>Horario:</dt>
              <dd>{empleo.jornada}</dd>
            </div>
            <div>
              <dt>Empresa:</dt>
              <dd>{empleo.empresa.nombre}</dd>
            </div>
            <div>
              <dt>Lugar:</dt>
              <dd>
                {empleo.ciudad} · {empleo.modalidad}
              </dd>
            </div>
          </dl>

          <CvIlustrado />

          <div className={styles.acciones}>
            <button
              type="button"
              className={cx(styles.accion, guardado && styles.activa)}
              aria-pressed={guardado}
              onClick={() => alternarGuardado(empleo.id)}
            >
              <Icono nombre="corazon" tamano={20} relleno={guardado} />
              {guardado ? 'Guardado' : 'Guardar'}
            </button>
            <button type="button" className={styles.accion} onClick={compartir}>
              <Icono nombre={copiado ? 'check' : 'compartir'} tamano={20} />
              {copiado ? 'Enlace copiado' : 'Compartir'}
            </button>
          </div>
        </article>

        <section className={ui.seccion}>
          <h2 className={ui.seccionTitulo}>Sobre el puesto</h2>
          <p className={ui.lead}>{empleo.descripcion}</p>
        </section>

        <section className={ui.seccion}>
          <h2 className={ui.seccionTitulo}>Requisitos</h2>
          <ul className={styles.requisitos}>
            {empleo.requisitos.map((r) => (
              <li key={r}>
                <Icono nombre="check" tamano={16} strokeWidth={2.5} />
                {r}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className={ui.pie}>
        {postulada ? (
          <p className={cx(ui.aviso, styles.postulada)} role="status">
            <Icono nombre="check" tamano={20} strokeWidth={2.5} />
            Ya enviaste tu postulación
          </p>
        ) : (
          <Boton to={`/empleos/${empleo.id}/postular`} bloque>
            Postular
          </Boton>
        )}
      </footer>
    </div>
  )
}

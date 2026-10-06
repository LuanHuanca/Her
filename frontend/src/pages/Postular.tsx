import { useState, type ChangeEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useEmpleo, useEmpleos, usePostular } from '../api/empleos'
import { usePerfil } from '../api/perfil'
import Avatar from '../components/Avatar'
import Boton from '../components/Boton'
import BotonIcono from '../components/BotonIcono'
import Cabecera from '../components/Cabecera'
import Icono from '../components/Icono'
import { cx, iniciales, primerNombre } from '../lib/texto'
import ui from '../styles/ui.module.css'
import styles from './Postular.module.css'

export default function Postular() {
  const { id } = useParams()
  const { data: empleo, isLoading } = useEmpleo(id)
  const { data: empleos } = useEmpleos()
  const { data: perfil } = usePerfil()
  const postularMutacion = usePostular()
  const [cv, setCv] = useState<string | null>(null)

  if (!empleo || !perfil) {
    return (
      <div className={ui.pantalla}>
        <Cabecera titulo="Postular" atras="/empleos" />
        <main className={ui.cuerpo}>
          <p className={ui.vacio}>{isLoading ? 'Cargando…' : 'Esta oferta ya no está disponible.'}</p>
        </main>
      </div>
    )
  }

  function alSeleccionarArchivo(evento: ChangeEvent<HTMLInputElement>) {
    // El backend por ahora solo guarda el nombre del archivo; no hay subida real de CV.
    const archivo = evento.target.files?.[0]
    if (archivo) setCv(archivo.name)
  }

  const sugerencias = (empleos ?? []).filter((e) => e.id !== empleo.id).slice(0, 2)

  return (
    <div className={ui.pantalla}>
      <header className={ui.cabecera}>
        <BotonIcono to={`/empleos/${empleo.id}`} icono="atras" etiqueta="Volver a la oferta" />
        <Avatar persona={{ nombre: perfil.nombre, iniciales: iniciales(perfil.nombre), tono: 'rosa' }} tamano={44} />
        <div className={ui.crece}>
          <span className={ui.meta}>Hola, {primerNombre(perfil.nombre)}</span>
          <h1 className={styles.titulo}>Envía tu CV</h1>
        </div>
      </header>

      <main className={ui.cuerpo}>
        <section className={ui.tarjeta} aria-label="Oferta seleccionada">
          <div className={ui.fila}>
            <Avatar persona={empleo.empresa} tamano={44} className={styles.logo} />
            <div className={ui.crece}>
              <span className={ui.titulo}>{empleo.puesto}</span>
              <span className={ui.meta}>
                {empleo.empresa.nombre} · {empleo.jornada}
              </span>
            </div>
          </div>
          <div className={styles.coincidencias}>
            <span className={styles.rayo}>
              <Icono nombre="rayo" tamano={20} />
            </span>
            <div className={ui.crece}>
              <span className={styles.coincidenciasTitulo}>Muchas de tus características son requeridas en el puesto</span>
              <ul className={styles.listaCoincidencias}>
                {empleo.coincidencias.map((c) => (
                  <li key={c}>
                    <Icono nombre="check" tamano={14} strokeWidth={3} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {empleo.postulada ? (
          <div className={ui.aviso} role="status">
            <Icono nombre="check" tamano={24} strokeWidth={2.5} />
            <div className={ui.crece}>
              <span className={ui.titulo}>¡Postulación enviada!</span>
              <span>
                {empleo.empresa.nombre} recibió tu CV. Te avisaremos cuando haya novedades.
              </span>
            </div>
          </div>
        ) : (
          <label className={cx(styles.zonaCarga, cv && styles.zonaConArchivo)}>
            <input type="file" accept=".pdf,.doc,.docx,image/*" className="sr-only" onChange={alSeleccionarArchivo} />
            <span className={ui.iconoCirculo}>
              <Icono nombre={cv ? 'archivo' : 'subir'} tamano={22} />
            </span>
            <span className={ui.titulo}>{cv ?? 'Cargar archivo'}</span>
            <span className={ui.meta}>{cv ? 'Toca para reemplazarlo' : 'PDF, Word o una foto de tu CV'}</span>
          </label>
        )}

        <section className={ui.seccion}>
          <h2 className={ui.seccionTitulo}>Sugerencias para ti</h2>
          <ul className={ui.lista}>
            {sugerencias.map((s) => (
              <li key={s.id}>
                <Link to={`/empleos/${s.id}`} className={cx(ui.tarjeta, ui.tarjetaBlush, ui.fila)}>
                  <Avatar persona={s.publica} tamano={44} />
                  <div className={ui.crece}>
                    <span className={ui.titulo}>{s.puesto}</span>
                    <span className={ui.meta}>
                      {s.empresa.nombre} · {s.jornada} · {s.modalidad}
                    </span>
                  </div>
                  <Icono nombre="adelante" tamano={20} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {!empleo.postulada && (
        <footer className={ui.pie}>
          <Boton
            bloque
            disabled={!cv || postularMutacion.isPending}
            onClick={() => cv && postularMutacion.mutate({ empleoId: empleo.id, cvNombreArchivo: cv })}
          >
            {postularMutacion.isPending ? 'Enviando…' : 'Enviar postulación'}
          </Boton>
          {!cv && <p className={cx(ui.meta, ui.centrado)}>Carga tu CV para postular.</p>}
        </footer>
      )}
    </div>
  )
}

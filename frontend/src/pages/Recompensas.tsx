import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar'
import BarraProgreso from '../components/BarraProgreso'
import Cabecera from '../components/Cabecera'
import Decoracion from '../components/Decoracion'
import Icono, { type NombreIcono } from '../components/Icono'
import { GANADORA_SEMANA, TAREA_DEL_DIA } from '../data/mock'
import { cx, formatoPuntos } from '../lib/texto'
import { useHerStore } from '../store/useHerStore'
import ui from '../styles/ui.module.css'
import styles from './Recompensas.module.css'

const NIVELES = [
  { nombre: 'Semilla', desde: 0 },
  { nombre: 'Constante', desde: 5000 },
  { nombre: 'Inspiradora', desde: 10000 },
  { nombre: 'Líder', desde: 20000 },
]

export default function Recompensas() {
  const puntos = useHerStore((s) => s.puntos)
  const reto = useHerStore((s) => s.reto)
  const publicacionesPropias = useHerStore((s) => s.publicacionesPropias)
  const eventosInscritos = useHerStore((s) => s.eventosInscritos)
  const postulaciones = useHerStore((s) => s.postulaciones)

  const indiceNivel = NIVELES.reduce((acc, nivel, i) => (puntos >= nivel.desde ? i : acc), 0)
  const nivel = NIVELES[indiceNivel]
  const siguiente = NIVELES[indiceNivel + 1]
  const avanceNivel = siguiente ? (puntos - nivel.desde) / (siguiente.desde - nivel.desde) : 1

  const insignias: { nombre: string; icono: NombreIcono; lograda: boolean }[] = [
    { nombre: 'Primer día', icono: 'check', lograda: reto.dia > 1 || reto.completadoHoy },
    { nombre: '7 días seguidos', icono: 'retos', lograda: reto.racha >= 7 },
    { nombre: 'Primera publicación', icono: 'mensaje', lograda: publicacionesPropias.length > 0 },
    { nombre: 'Primer evento', icono: 'calendario', lograda: eventosInscritos.length > 0 },
    { nombre: 'Primera postulación', icono: 'empleos', lograda: postulaciones.length > 0 },
    { nombre: 'Módulo completo', icono: 'trofeo', lograda: reto.dia >= 21 && reto.completadoHoy },
  ]

  return (
    <div className={ui.pantalla}>
      <Cabecera titulo="Recompensas" atras="/inicio" />

      <main className={ui.cuerpo}>
        <section className={styles.puntos} aria-label="Tus puntos">
          <Decoracion tamano={180} anillos={2} color="#FFFFFF" grosor={2} className={styles.deco} />
          <div className={styles.puntosFila}>
            <div className={ui.intro}>
              <span className={ui.meta}>Tus puntos acumulados</span>
              <span className={styles.cifra}>
                {formatoPuntos(puntos)} <span>pts</span>
              </span>
            </div>
            <span className={styles.trofeo}>
              <Icono nombre="trofeo" tamano={30} />
            </span>
          </div>
          <div className={styles.nivel}>
            <div className={styles.nivelFila}>
              <strong>Nivel: {nivel.nombre}</strong>
              {siguiente && <span>Próximo: {siguiente.nombre}</span>}
            </div>
            <BarraProgreso valor={avanceNivel} etiqueta={`Avance hacia el nivel ${siguiente?.nombre ?? nivel.nombre}`} />
            {siguiente && <span className={ui.meta}>Te faltan {formatoPuntos(siguiente.desde - puntos)} pts</span>}
          </div>
        </section>

        <Link to="/retos/hoy" className={cx(ui.tarjeta, ui.fila)}>
          <span className={styles.iconoCuadrado}>
            <Icono nombre="editar" tamano={22} />
          </span>
          <div className={ui.crece}>
            <span className={ui.eyebrow}>Tarea del día · +{TAREA_DEL_DIA.puntos} pts</span>
            <span className={ui.titulo}>{TAREA_DEL_DIA.consigna}</span>
          </div>
          {reto.completadoHoy && <span className={cx(ui.chip, ui.chipExito)}>Hecha</span>}
        </Link>

        <section className={ui.seccion}>
          <div className={ui.seccionCabecera}>
            <h2 className={ui.seccionTitulo}>Insignias</h2>
            <span className={ui.meta}>
              {insignias.filter((i) => i.lograda).length} de {insignias.length}
            </span>
          </div>
          <ul className={styles.insignias}>
            {insignias.map((insignia) => (
              <li key={insignia.nombre} className={cx(styles.insignia, !insignia.lograda && styles.bloqueada)}>
                <span className={styles.insigniaIcono}>
                  <Icono nombre={insignia.icono} tamano={24} strokeWidth={insignia.icono === 'check' ? 2.5 : 1.8} />
                </span>
                <span className={styles.insigniaNombre}>{insignia.nombre}</span>
                <span className="sr-only">{insignia.lograda ? 'Conseguida' : 'Pendiente'}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={ui.seccion}>
          <h2 className={ui.seccionTitulo}>Ganadora de la semana</h2>
          <div className={cx(ui.tarjeta, ui.fila)}>
            <Avatar persona={GANADORA_SEMANA.persona} tamano={52} className={styles.ganadora} />
            <div className={ui.crece}>
              <span className={ui.titulo}>{GANADORA_SEMANA.persona.nombre}</span>
              <span className={ui.meta}>{GANADORA_SEMANA.detalle}</span>
            </div>
            <Icono nombre="estrella" tamano={26} relleno etiqueta="Primer lugar" className={styles.estrella} />
          </div>
        </section>
      </main>
    </div>
  )
}

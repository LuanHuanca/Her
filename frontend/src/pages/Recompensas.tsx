import { Link } from 'react-router-dom'
import { useRecompensas } from '../api/recompensas'
import { useRetoHoy } from '../api/retos'
import Avatar from '../components/Avatar'
import BarraProgreso from '../components/BarraProgreso'
import Cabecera from '../components/Cabecera'
import Decoracion from '../components/Decoracion'
import Icono, { type NombreIcono } from '../components/Icono'
import { cx, formatoPuntos } from '../lib/texto'
import ui from '../styles/ui.module.css'
import styles from './Recompensas.module.css'

const NIVELES = [
  { nombre: 'Semilla', desde: 0 },
  { nombre: 'Constante', desde: 5000 },
  { nombre: 'Inspiradora', desde: 10000 },
  { nombre: 'Líder', desde: 20000 },
]

export default function Recompensas() {
  const { data } = useRecompensas()
  const { data: reto } = useRetoHoy()

  if (!data) {
    return (
      <div className={ui.pantalla}>
        <p className={ui.vacio}>Cargando…</p>
      </div>
    )
  }

  const { puntos, insignias, ganadoraSemana } = data
  const indiceNivel = NIVELES.reduce((acc, nivel, i) => (puntos >= nivel.desde ? i : acc), 0)
  const nivel = NIVELES[indiceNivel]
  const siguiente = NIVELES[indiceNivel + 1]
  const avanceNivel = siguiente ? (puntos - nivel.desde) / (siguiente.desde - nivel.desde) : 1

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
            <span className={ui.eyebrow}>Tarea del día{reto ? ` · +${reto.tarea.puntos} pts` : ''}</span>
            <span className={ui.titulo}>{reto?.tarea.consigna ?? 'Ver mi reto de hoy'}</span>
          </div>
          {reto?.completadoHoy && <span className={cx(ui.chip, ui.chipExito)}>Hecha</span>}
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
                  <Icono nombre={insignia.icono as NombreIcono} tamano={24} strokeWidth={insignia.icono === 'check' ? 2.5 : 1.8} />
                </span>
                <span className={styles.insigniaNombre}>{insignia.nombre}</span>
                <span className="sr-only">{insignia.lograda ? 'Conseguida' : 'Pendiente'}</span>
              </li>
            ))}
          </ul>
        </section>

        {ganadoraSemana && (
          <section className={ui.seccion}>
            <h2 className={ui.seccionTitulo}>Ganadora de la semana</h2>
            <div className={cx(ui.tarjeta, ui.fila)}>
              <Avatar persona={ganadoraSemana.persona} tamano={52} className={styles.ganadora} />
              <div className={ui.crece}>
                <span className={ui.titulo}>{ganadoraSemana.persona.nombre}</span>
                <span className={ui.meta}>{ganadoraSemana.detalle}</span>
              </div>
              <Icono nombre="estrella" tamano={26} relleno etiqueta="Primer lugar" className={styles.estrella} />
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

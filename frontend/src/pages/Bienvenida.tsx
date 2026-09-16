import { Link } from 'react-router-dom'
import Boton from '../components/Boton'
import Decoracion from '../components/Decoracion'
import Icono, { type NombreIcono } from '../components/Icono'
import ui from '../styles/ui.module.css'
import styles from './Bienvenida.module.css'

const BENEFICIOS: { icono: NombreIcono; texto: string }[] = [
  { icono: 'retos', texto: 'Retos de 21 días con tareas de 10 minutos' },
  { icono: 'comunidad', texto: 'Comunidad, mentoras y eventos' },
  { icono: 'empleos', texto: 'Empleos con horarios flexibles' },
]

export default function Bienvenida() {
  return (
    <div className={styles.pantalla}>
      <Decoracion tamano={280} className={styles.decoArriba} />
      <Decoracion tamano={180} anillos={2} color="#F7D5DC" className={styles.decoLado} />

      <div className={styles.marca}>
        <h1 className={styles.logo}>Her</h1>
        <p className={styles.lema}>Sé tu mejor versión</p>
      </div>

      <section className={styles.panel}>
        <div className={ui.intro}>
          <h2 className={styles.titular}>Crece a tu ritmo, acompañada.</h2>
          <p className={ui.lead}>
            Pequeños retos diarios, una comunidad que te sostiene y oportunidades de trabajo pensadas para mamás.
          </p>
        </div>

        <ul className={styles.beneficios}>
          {BENEFICIOS.map((b) => (
            <li key={b.texto} className={styles.beneficio}>
              <span className={styles.beneficioIcono}>
                <Icono nombre={b.icono} tamano={18} />
              </span>
              {b.texto}
            </li>
          ))}
        </ul>

        <div className={styles.acciones}>
          <Boton to="/registro" bloque>
            Regístrate aquí
          </Boton>
          {/* TODO: conectar con OAuth de Google cuando exista el router de auth. */}
          <Boton to="/inicio" variante="secundario" bloque>
            <span className={styles.google} aria-hidden="true">
              G
            </span>
            Continuar con Google
          </Boton>
        </div>

        <p className={styles.yaTengo}>
          ¿Ya tienes cuenta? <Link to="/inicio">Inicia sesión</Link>
        </p>
      </section>
    </div>
  )
}

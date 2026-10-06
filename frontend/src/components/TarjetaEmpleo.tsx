import { Link } from 'react-router-dom'
import { useAlternarGuardado } from '../api/empleos'
import { cx } from '../lib/texto'
import ui from '../styles/ui.module.css'
import type { Empleo } from '../types'
import Avatar from './Avatar'
import Icono from './Icono'
import styles from './TarjetaEmpleo.module.css'

export default function TarjetaEmpleo({ empleo }: { empleo: Empleo }) {
  const alternarGuardado = useAlternarGuardado()

  return (
    <article className={ui.tarjeta}>
      <div className={styles.cabecera}>
        <Avatar persona={empleo.empresa} tamano={48} className={styles.logo} />
        <div className={ui.crece}>
          <Link to={`/empleos/${empleo.id}`} className={cx(ui.enlaceEstirado, ui.titulo)}>
            {empleo.puesto}
          </Link>
          <span className={ui.meta}>
            {empleo.empresa.nombre} · {empleo.ciudad}
          </span>
        </div>
        <button
          type="button"
          className={cx(ui.botonIcono, ui.sobreEnlace, empleo.guardado && styles.guardado)}
          aria-pressed={empleo.guardado}
          aria-label={empleo.guardado ? `Quitar ${empleo.puesto} de guardados` : `Guardar ${empleo.puesto}`}
          onClick={() => alternarGuardado.mutate(empleo.id)}
        >
          <Icono nombre="corazon" tamano={20} relleno={empleo.guardado} />
        </button>
      </div>
      <div className={ui.chips}>
        <span className={cx(ui.chip, ui.chipNeutro)}>{empleo.jornada}</span>
        <span className={cx(ui.chip, ui.chipNeutro)}>{empleo.modalidad}</span>
        {empleo.postulada && <span className={cx(ui.chip, ui.chipExito)}>Postulaste</span>}
      </div>
      <p className={styles.coincide}>
        <Icono nombre="rayo" tamano={16} />
        {empleo.coincidencias.length} de tus habilidades coinciden
      </p>
    </article>
  )
}

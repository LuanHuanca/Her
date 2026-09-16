import { Link } from 'react-router-dom'
import BarraProgreso from '../components/BarraProgreso'
import Icono from '../components/Icono'
import { MODULOS } from '../data/mock'
import { cx } from '../lib/texto'
import { useHerStore } from '../store/useHerStore'
import ui from '../styles/ui.module.css'
import styles from './Retos.module.css'

const numero = (n: number) => n.toString().padStart(2, '0')

export default function Retos() {
  const reto = useHerStore((s) => s.reto)
  const indiceActual = Math.max(
    MODULOS.findIndex((m) => m.id === reto.moduloId),
    0,
  )
  const diasHechos = reto.completadoHoy ? reto.dia : reto.dia - 1

  return (
    <div className={ui.pantalla}>
      <header className={styles.cabecera}>
        <div className={ui.seccionCabecera}>
          <h1 className={ui.tituloDisplay}>Tu ruta</h1>
          <span className={styles.racha}>
            <Icono nombre="retos" tamano={16} strokeWidth={2} />
            {reto.racha} días
          </span>
        </div>
        <p className={ui.lead}>Módulos de 21 días. Un paso pequeño cada día.</p>
      </header>

      <main className={ui.cuerpo}>
        <ol className={ui.lista}>
          {MODULOS.map((modulo, i) => {
            if (i < indiceActual) {
              return (
                <li key={modulo.id} className={cx(ui.tarjeta, ui.fila)}>
                  <span className={cx(styles.numero, styles.numeroHecho)}>
                    <Icono nombre="check" tamano={20} strokeWidth={2.5} />
                  </span>
                  <div className={ui.crece}>
                    <span className={ui.titulo}>{modulo.titulo}</span>
                    <span className={ui.meta}>Completado</span>
                  </div>
                </li>
              )
            }

            if (i === indiceActual) {
              return (
                <li key={modulo.id}>
                  <Link to="/retos/hoy" className={cx(ui.tarjeta, ui.tarjetaBlush, styles.actual)}>
                    <div className={ui.fila}>
                      <span className={cx(styles.numero, styles.numeroActual)}>{numero(modulo.numero)}</span>
                      <div className={ui.crece}>
                        <span className={ui.eyebrow}>En curso</span>
                        <span className={styles.tituloActual}>{modulo.titulo}</span>
                      </div>
                    </div>
                    <BarraProgreso valor={diasHechos / 21} etiqueta={`${diasHechos} de 21 días completados`} />
                    <div className={styles.pieActual}>
                      <span>{diasHechos} de 21 días</span>
                      <span className={styles.continuar}>
                        {reto.completadoHoy ? 'Ver tarea de hoy' : 'Continuar'}
                        <Icono nombre="adelante" tamano={16} strokeWidth={2.5} />
                      </span>
                    </div>
                  </Link>
                </li>
              )
            }

            return (
              <li key={modulo.id} className={cx(ui.tarjeta, ui.fila)}>
                <span className={styles.numero}>{numero(modulo.numero)}</span>
                <div className={ui.crece}>
                  <span className={ui.titulo}>{modulo.titulo}</span>
                  <span className={ui.meta}>{modulo.descripcion}</span>
                </div>
                <Icono nombre="candado" tamano={20} etiqueta="Bloqueado" className={styles.candado} />
              </li>
            )
          })}
        </ol>
        <p className={cx(ui.meta, ui.centrado)}>Completa el módulo actual para desbloquear el siguiente.</p>
      </main>
    </div>
  )
}

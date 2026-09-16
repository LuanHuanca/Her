import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar'
import BarraProgreso from '../components/BarraProgreso'
import BotonIcono from '../components/BotonIcono'
import Decoracion from '../components/Decoracion'
import Icono from '../components/Icono'
import { EVENTOS, MODULOS, TAREA_DEL_DIA } from '../data/mock'
import { INICIALES_SEMANA, diaSemanaCorto, diasEntre, fechaLarga, mesCorto, semanaDe, sumarDias } from '../lib/fechas'
import { cx, formatoPuntos, iniciales, primerNombre } from '../lib/texto'
import { useHerStore } from '../store/useHerStore'
import ui from '../styles/ui.module.css'
import styles from './Inicio.module.css'

type EstadoDia = 'hecho' | 'pendiente' | 'perdido' | 'futuro'

export default function Inicio() {
  const perfil = useHerStore((s) => s.perfil)
  const reto = useHerStore((s) => s.reto)
  const puntos = useHerStore((s) => s.puntos)
  const inscritos = useHerStore((s) => s.eventosInscritos)

  const hoy = new Date()
  const modulo = MODULOS.find((m) => m.id === reto.moduloId) ?? MODULOS[0]
  const diasHechos = reto.completadoHoy ? reto.dia : reto.dia - 1
  const rachaAntesDeHoy = reto.completadoHoy ? reto.racha - 1 : reto.racha

  const semana = semanaDe(hoy).map((fecha, i) => {
    const diferencia = diasEntre(hoy, fecha)
    let estado: EstadoDia = 'futuro'
    if (diferencia === 0) estado = reto.completadoHoy ? 'hecho' : 'pendiente'
    else if (diferencia < 0) estado = -diferencia <= rachaAntesDeHoy ? 'hecho' : 'perdido'
    return { fecha, inicial: INICIALES_SEMANA[i], estado, esHoy: diferencia === 0 }
  })
  const hechosEstaSemana = semana.filter((d) => d.estado === 'hecho').length

  const proximoEvento = [...EVENTOS].sort((a, b) => a.offsetDias - b.offsetDias).find((e) => e.offsetDias >= 0)
  const fechaProximo = proximoEvento ? sumarDias(hoy, proximoEvento.offsetDias) : null

  return (
    <div className={ui.pantalla}>
      <header className={ui.cabecera}>
        <Link to="/perfil" aria-label="Mi perfil" className={styles.avatarEnlace}>
          <Avatar persona={{ nombre: perfil.nombre, iniciales: iniciales(perfil.nombre), tono: 'rosa' }} tamano={48} />
        </Link>
        <div className={ui.crece}>
          <span className={ui.meta}>Hola, {primerNombre(perfil.nombre)}</span>
          <span className={styles.fecha}>{fechaLarga(hoy)}</span>
        </div>
        <BotonIcono to="/eventos" icono="calendario" etiqueta="Calendario de eventos" />
      </header>

      <main className={ui.cuerpo}>
        <section className={styles.hero} aria-labelledby="reto-actual">
          <Decoracion tamano={200} anillos={2} color="#E27D93" className={styles.heroDeco} />
          <div className={styles.heroFila}>
            <h2 id="reto-actual" className={styles.heroEyebrow}>
              Reto actual · {modulo.corto}
            </h2>
            <span className={styles.racha}>
              <Icono nombre="retos" tamano={14} strokeWidth={2} />
              Racha de {reto.racha} días
            </span>
          </div>
          <p className={styles.heroDia}>
            Día {reto.dia} <span>de 21</span>
          </p>
          <BarraProgreso valor={diasHechos / 21} invertida etiqueta={`${diasHechos} de 21 días completados`} />
          <Link to="/retos/hoy" className={styles.heroBoton}>
            <Icono nombre={reto.completadoHoy ? 'check' : 'play'} tamano={16} relleno={!reto.completadoHoy} strokeWidth={2.5} />
            {reto.completadoHoy ? 'Ver tarea completada' : 'Empezar tarea de hoy'}
          </Link>
        </section>

        <section className={ui.seccion}>
          <div className={ui.seccionCabecera}>
            <h2 className={ui.seccionTitulo}>Esta semana</h2>
            <span className={ui.meta}>{hechosEstaSemana} de 7 días</span>
          </div>
          <ol className={styles.semana}>
            {semana.map((d) => (
              <li key={d.fecha.toISOString()} className={cx(styles.dia, d.esHoy && styles.diaHoy)}>
                <span className={styles.diaInicial}>{d.esHoy ? 'Hoy' : d.inicial}</span>
                {d.estado === 'hecho' ? (
                  <span className={styles.diaHecho}>
                    <Icono nombre="check" tamano={14} strokeWidth={3} etiqueta={`Día ${d.fecha.getDate()} completado`} />
                  </span>
                ) : (
                  <span className={cx(styles.diaNumero, d.estado === 'pendiente' && styles.diaPendiente)}>{d.fecha.getDate()}</span>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className={ui.seccion}>
          <h2 className={ui.seccionTitulo}>Tu tarea de hoy</h2>
          <Link to="/retos/hoy" className={cx(ui.tarjeta, ui.tarjetaBlush, ui.fila)}>
            <span className={styles.iconoTarea}>
              <Icono nombre="audifonos" tamano={24} />
            </span>
            <div className={ui.crece}>
              <span className={ui.eyebrow}>
                {TAREA_DEL_DIA.minutos} min · +{TAREA_DEL_DIA.puntos} pts
              </span>
              <span className={ui.titulo}>{TAREA_DEL_DIA.titulo}</span>
              <span className={ui.meta}>Audio corto y una reflexión escrita</span>
            </div>
            {reto.completadoHoy ? (
              <span className={cx(ui.chip, ui.chipExito)}>Hecha</span>
            ) : (
              <Icono nombre="adelante" tamano={20} />
            )}
          </Link>
        </section>

        {proximoEvento && fechaProximo && (
          <section className={ui.seccion}>
            <div className={ui.seccionCabecera}>
              <h2 className={ui.seccionTitulo}>Próximo evento</h2>
              <Link to="/eventos" className={ui.enlace}>
                Ver todos
              </Link>
            </div>
            <Link to="/eventos" className={cx(ui.tarjeta, ui.fila)}>
              <span className={ui.fechaCaja}>
                <span className={ui.fechaCajaDia}>{fechaProximo.getDate()}</span>
                <span className={ui.fechaCajaMes}>{mesCorto(fechaProximo)}</span>
              </span>
              <div className={ui.crece}>
                <span className={ui.titulo}>{proximoEvento.titulo}</span>
                <span className={ui.meta}>
                  {diaSemanaCorto(fechaProximo)} · {proximoEvento.hora} ·{' '}
                  {proximoEvento.modalidad === 'virtual' ? 'Virtual' : proximoEvento.lugar}
                </span>
              </div>
              {inscritos.includes(proximoEvento.id) && <span className={cx(ui.chip, ui.chipExito)}>Inscrita</span>}
            </Link>
          </section>
        )}

        <section className={styles.accesos} aria-label="Accesos rápidos">
          <Link to="/recompensas" className={ui.tarjeta}>
            <span className={styles.accesoIcono}>
              <Icono nombre="trofeo" tamano={20} />
            </span>
            <span className={ui.meta}>Recompensas</span>
            <span className={styles.accesoValor}>{formatoPuntos(puntos)} pts</span>
          </Link>
          <Link to="/comunidad" className={ui.tarjeta}>
            <span className={styles.accesoIcono}>
              <Icono nombre="comunidad" tamano={20} />
            </span>
            <span className={ui.meta}>Comunidad</span>
            <span className={styles.accesoValor}>Comparte tu avance</span>
          </Link>
        </section>
      </main>
    </div>
  )
}

import { Link, useNavigate } from 'react-router-dom'
import Avatar from '../components/Avatar'
import Decoracion from '../components/Decoracion'
import Icono, { type NombreIcono } from '../components/Icono'
import { OBJETIVOS } from '../data/mock'
import { edadDesde } from '../lib/fechas'
import { cx, formatoPuntos, iniciales } from '../lib/texto'
import { useHerStore } from '../store/useHerStore'
import ui from '../styles/ui.module.css'
import styles from './Perfil.module.css'

const OPCIONES: { to: string; etiqueta: string; icono: NombreIcono }[] = [
  { to: '/metas', etiqueta: 'Preferencias y metas', icono: 'ajustes' },
  { to: '/registro', etiqueta: 'Editar datos', icono: 'editar' },
  { to: '/recompensas', etiqueta: 'Mis recompensas', icono: 'trofeo' },
]

export default function Perfil() {
  const navigate = useNavigate()
  const perfil = useHerStore((s) => s.perfil)
  const metas = useHerStore((s) => s.metas)
  const reto = useHerStore((s) => s.reto)
  const puntos = useHerStore((s) => s.puntos)
  const eventosInscritos = useHerStore((s) => s.eventosInscritos)
  const cerrarSesion = useHerStore((s) => s.cerrarSesion)

  const edad = edadDesde(perfil.fechaNacimiento)
  const objetivos = OBJETIVOS.filter((o) => metas.objetivos.includes(o.id))

  function salir() {
    // TODO: invalidar el token JWT cuando exista el router de auth.
    cerrarSesion()
    navigate('/')
  }

  return (
    <div className={ui.pantalla}>
      <section className={styles.portada}>
        <Decoracion tamano={260} className={styles.deco} color="#FFFFFF" grosor={2} />
        <h1 className={styles.titulo}>Mi perfil</h1>
        <Avatar
          persona={{ nombre: perfil.nombre, iniciales: iniciales(perfil.nombre), tono: 'rosa' }}
          tamano={112}
          className={styles.avatar}
        />
        <p className={styles.nombre}>{perfil.nombre}</p>
        <div className={styles.chips}>
          {edad !== null && <span className={styles.chipBlanco}>{edad} años</span>}
          <span className={styles.chipBlanco}>{perfil.ciudad}</span>
        </div>
        <p className={styles.detalle}>
          {perfil.ocupacion && <span>{perfil.ocupacion}</span>}
          <span>
            Mamá de {perfil.hijos}
            {perfil.hijos >= 4 ? ' o más' : ''}
          </span>
        </p>
        {perfil.buscaEmpleo === 'si' && <span className={styles.etiquetaEmpleo}>Busca empleo</span>}
      </section>

      <main className={ui.cuerpo}>
        <dl className={styles.estadisticas}>
          <div>
            <dt>Racha</dt>
            <dd>{reto.racha} días</dd>
          </div>
          <div>
            <dt>Puntos</dt>
            <dd>{formatoPuntos(puntos)}</dd>
          </div>
          <div>
            <dt>Eventos</dt>
            <dd>{eventosInscritos.length}</dd>
          </div>
        </dl>

        <section className={ui.seccion}>
          <div className={ui.seccionCabecera}>
            <h2 className={ui.seccionTitulo}>Mis metas</h2>
            <Link to="/metas" className={ui.enlace}>
              Editar
            </Link>
          </div>
          {objetivos.length > 0 ? (
            <ul className={cx(ui.chips, styles.metas)}>
              {objetivos.map((o) => (
                <li key={o.id} className={cx(ui.chip, ui.chipNeutro)}>
                  {o.etiqueta}
                </li>
              ))}
            </ul>
          ) : (
            <p className={ui.meta}>Aún no elegiste metas.</p>
          )}
        </section>

        <section className={ui.seccion}>
          <h2 className={ui.seccionTitulo}>Configuración</h2>
          <ul className={styles.opciones}>
            {OPCIONES.map((o) => (
              <li key={o.to}>
                <Link to={o.to} className={styles.opcion}>
                  <span className={ui.iconoCirculo}>
                    <Icono nombre={o.icono} tamano={20} />
                  </span>
                  <span className={styles.opcionTexto}>{o.etiqueta}</span>
                  <Icono nombre="adelante" tamano={18} />
                </Link>
              </li>
            ))}
            <li>
              <button type="button" className={styles.opcion} onClick={salir}>
                <span className={ui.iconoCirculo}>
                  <Icono nombre="salir" tamano={20} />
                </span>
                <span className={styles.opcionTexto}>Cerrar sesión</span>
              </button>
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}

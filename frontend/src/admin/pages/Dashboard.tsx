import { useResumenAdmin } from '../api/resumen'
import styles from '../admin.module.css'

export default function Dashboard() {
  const { data, isLoading } = useResumenAdmin()

  return (
    <div>
      <header className={styles.cabecera}>
        <div>
          <h1 className={styles.titulo}>Panel de administración</h1>
          <p className={styles.subtitulo}>Resumen general de la plataforma.</p>
        </div>
      </header>

      {isLoading || !data ? (
        <p className={styles.vacio}>Cargando…</p>
      ) : (
        <div className={styles.tarjetas}>
          <div className={styles.tarjeta}>
            <div className={styles.tarjetaValor}>{data.totalUsuarias}</div>
            <div className={styles.tarjetaEtiqueta}>Usuarias</div>
          </div>
          <div className={styles.tarjeta}>
            <div className={styles.tarjetaValor}>{data.totalAdmins}</div>
            <div className={styles.tarjetaEtiqueta}>Administradoras</div>
          </div>
          <div className={styles.tarjeta}>
            <div className={styles.tarjetaValor}>{data.usuariasActivasHoy}</div>
            <div className={styles.tarjetaEtiqueta}>Completaron su reto hoy</div>
          </div>
          <div className={styles.tarjeta}>
            <div className={styles.tarjetaValor}>{data.totalPublicaciones}</div>
            <div className={styles.tarjetaEtiqueta}>Publicaciones en comunidad</div>
          </div>
          <div className={styles.tarjeta}>
            <div className={styles.tarjetaValor}>{data.totalEmpleos}</div>
            <div className={styles.tarjetaEtiqueta}>Empleos publicados</div>
          </div>
          <div className={styles.tarjeta}>
            <div className={styles.tarjetaValor}>{data.totalPostulaciones}</div>
            <div className={styles.tarjetaEtiqueta}>Postulaciones enviadas</div>
          </div>
          <div className={styles.tarjeta}>
            <div className={styles.tarjetaValor}>{data.eventosProximos}</div>
            <div className={styles.tarjetaEtiqueta}>Eventos en los próximos 30 días</div>
          </div>
        </div>
      )}
    </div>
  )
}

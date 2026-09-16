import { useEffect, useState } from 'react'
import BarraProgreso from '../components/BarraProgreso'
import Boton from '../components/Boton'
import BotonIcono from '../components/BotonIcono'
import Decoracion from '../components/Decoracion'
import Icono from '../components/Icono'
import { RetratoIlustrado } from '../components/Ilustraciones'
import { MODULOS, TAREA_DEL_DIA } from '../data/mock'
import { formatoTiempo } from '../lib/fechas'
import { cx } from '../lib/texto'
import { useHerStore } from '../store/useHerStore'
import ui from '../styles/ui.module.css'
import styles from './RetoDelDia.module.css'

export default function RetoDelDia() {
  const tarea = TAREA_DEL_DIA
  const modulo = MODULOS.find((m) => m.id === tarea.moduloId) ?? MODULOS[0]
  const reto = useHerStore((s) => s.reto)
  const completarTarea = useHerStore((s) => s.completarTarea)

  const [reproduciendo, setReproduciendo] = useState(false)
  const [segundos, setSegundos] = useState(0)
  const [reflexion, setReflexion] = useState(reto.reflexion)
  const [compartir, setCompartir] = useState(false)

  // Simulación del audio hasta que el backend sirva el archivo real.
  useEffect(() => {
    if (!reproduciendo) return
    const id = window.setInterval(() => setSegundos((s) => Math.min(s + 1, tarea.duracionSeg)), 1000)
    return () => window.clearInterval(id)
  }, [reproduciendo, tarea.duracionSeg])

  useEffect(() => {
    if (segundos >= tarea.duracionSeg) setReproduciendo(false)
  }, [segundos, tarea.duracionSeg])

  function alternarAudio() {
    if (!reproduciendo && segundos >= tarea.duracionSeg) setSegundos(0)
    setReproduciendo((r) => !r)
  }

  const puedeCompletar = reflexion.trim().length > 0

  return (
    <div className={styles.pantalla}>
      <div className={styles.portada}>
        <Decoracion tamano={300} anillos={2} color="#FFFFFF" grosor={2} className={styles.deco} />
        <header className={styles.barra}>
          <BotonIcono to="/inicio" icono="cerrar" etiqueta="Cerrar" className={styles.botonClaro} />
          <span className={ui.cabeceraTitulo}>
            Día {tarea.dia} · {modulo.corto}
          </span>
          <span className={ui.cabeceraHueco} />
        </header>
        <div className={styles.retrato}>
          <RetratoIlustrado />
        </div>
        <button
          type="button"
          className={styles.play}
          onClick={alternarAudio}
          aria-label={reproduciendo ? 'Pausar audio' : 'Reproducir audio'}
        >
          <Icono nombre={reproduciendo ? 'pausa' : 'play'} tamano={24} relleno />
        </button>
      </div>

      <div className={styles.hoja}>
        <main className={styles.contenido}>
          <div className={styles.encabezado}>
            <span className={ui.eyebrow}>{tarea.titulo}</span>
            <h1 className={styles.frase}>{tarea.frase}</h1>
          </div>

          <div className={styles.audio}>
            <span className={ui.meta}>{formatoTiempo(segundos)}</span>
            <BarraProgreso valor={segundos / tarea.duracionSeg} etiqueta="Progreso del audio" alto={6} />
            <span className={ui.meta}>{formatoTiempo(tarea.duracionSeg)}</span>
          </div>

          {tarea.texto.map((parrafo) => (
            <p key={parrafo} className={ui.lead}>
              {parrafo}
            </p>
          ))}

          <div className={styles.tarea}>
            <label htmlFor="reflexion" className={ui.intro}>
              <span className={ui.eyebrow}>Tu tarea de hoy</span>
              <span className={ui.titulo}>{tarea.consigna}</span>
            </label>
            <textarea
              id="reflexion"
              className={ui.entrada}
              rows={4}
              value={reflexion}
              onChange={(e) => setReflexion(e.target.value)}
              readOnly={reto.completadoHoy}
              placeholder={'1. Mi paciencia con mis hijas\n2. …'}
            />
            {!reto.completadoHoy && (
              <label className={styles.compartir}>
                <input type="checkbox" checked={compartir} onChange={(e) => setCompartir(e.target.checked)} />
                Compartir mi reflexión en la comunidad
              </label>
            )}
          </div>

          {reto.completadoHoy && (
            <div className={ui.aviso} role="status">
              <Icono nombre="check" tamano={24} strokeWidth={2.5} />
              <div className={ui.crece}>
                <span className={ui.titulo}>¡Día {tarea.dia} completado! +{tarea.puntos} pts</span>
                <span>Tu racha: {reto.racha} días seguidos.</span>
              </div>
            </div>
          )}
        </main>

        <footer className={ui.pie}>
          {reto.completadoHoy ? (
            <Boton to="/inicio" variante="oscuro" bloque>
              Volver al inicio
            </Boton>
          ) : (
            <>
              <Boton bloque disabled={!puedeCompletar} onClick={() => completarTarea(reflexion.trim(), compartir)}>
                Marcar como completada
              </Boton>
              {!puedeCompletar && <p className={cx(ui.meta, ui.centrado)}>Escribe tu reflexión para completar el día.</p>}
            </>
          )}
        </footer>
      </div>
    </div>
  )
}

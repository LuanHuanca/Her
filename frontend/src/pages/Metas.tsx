import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Boton from '../components/Boton'
import { CabeceraPasos } from '../components/Cabecera'
import Icono from '../components/Icono'
import { OBJETIVOS } from '../data/mock'
import { plural } from '../lib/texto'
import { useHerStore } from '../store/useHerStore'
import ui from '../styles/ui.module.css'

const MINUTOS = [5, 15, 30]
const HORIZONTES = [
  { meses: 3, etiqueta: '3 meses' },
  { meses: 6, etiqueta: '6 meses' },
  { meses: 12, etiqueta: '1 año' },
]

export default function Metas() {
  const navigate = useNavigate()
  const metasGuardadas = useHerStore((s) => s.metas)
  const guardarMetas = useHerStore((s) => s.guardarMetas)

  const [objetivos, setObjetivos] = useState<string[]>(metasGuardadas.objetivos)
  const [minutosAlDia, setMinutosAlDia] = useState(metasGuardadas.minutosAlDia)
  const [horizonteMeses, setHorizonteMeses] = useState(metasGuardadas.horizonteMeses)

  const alternarObjetivo = (id: string) =>
    setObjetivos((actuales) => (actuales.includes(id) ? actuales.filter((x) => x !== id) : [...actuales, id]))

  function comenzar() {
    guardarMetas({ objetivos, minutosAlDia, horizonteMeses })
    navigate('/inicio')
  }

  return (
    <div className={ui.pantalla}>
      <CabeceraPasos paso={2} total={2} atras="/registro" />

      <main className={ui.cuerpo}>
        <div className={ui.intro}>
          <h1 className={ui.tituloDisplay}>Configura tus metas</h1>
          <p className={ui.lead}>Elige lo que quieres lograr. Con esto armamos tu ruta de retos.</p>
        </div>

        <section className={ui.seccion}>
          <div className={ui.seccionCabecera}>
            <h2 id="pregunta-objetivos" className={ui.seccionTitulo}>
              ¿Qué te gustaría lograr?
            </h2>
            <span className={ui.meta} aria-live="polite">
              {plural(objetivos.length, 'elegida', 'elegidas')}
            </span>
          </div>
          <div role="group" aria-labelledby="pregunta-objetivos" className={ui.opciones}>
            {OBJETIVOS.map((o) => (
              <button
                key={o.id}
                type="button"
                role="checkbox"
                aria-checked={objetivos.includes(o.id)}
                className={ui.opcion}
                onClick={() => alternarObjetivo(o.id)}
              >
                <span className={ui.check} aria-hidden="true">
                  <Icono nombre="check" tamano={14} strokeWidth={3} />
                </span>
                {o.etiqueta}
              </button>
            ))}
          </div>
        </section>

        <section className={ui.seccion}>
          <h2 id="pregunta-minutos" className={ui.seccionTitulo}>
            ¿Cuánto tiempo al día tienes?
          </h2>
          <div role="radiogroup" aria-labelledby="pregunta-minutos" className={ui.pastillasIguales}>
            {MINUTOS.map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={minutosAlDia === m}
                className={ui.pastilla}
                onClick={() => setMinutosAlDia(m)}
              >
                {m} min
              </button>
            ))}
          </div>
        </section>

        <section className={ui.seccion}>
          <h2 id="pregunta-horizonte" className={ui.seccionTitulo}>
            ¿En cuánto tiempo quieres alcanzarlas?
          </h2>
          <div role="radiogroup" aria-labelledby="pregunta-horizonte" className={ui.pastillasIguales}>
            {HORIZONTES.map((h) => (
              <button
                key={h.meses}
                type="button"
                role="radio"
                aria-checked={horizonteMeses === h.meses}
                className={ui.pastilla}
                onClick={() => setHorizonteMeses(h.meses)}
              >
                {h.etiqueta}
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className={ui.pie}>
        <Boton bloque onClick={comenzar} disabled={objetivos.length === 0}>
          Comenzar mi primer reto
        </Boton>
        {objetivos.length === 0 && <p className={`${ui.meta} ${ui.centrado}`}>Elige al menos una meta para continuar.</p>}
      </footer>
    </div>
  )
}

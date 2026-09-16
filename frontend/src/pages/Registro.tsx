import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Boton from '../components/Boton'
import { CabeceraPasos } from '../components/Cabecera'
import { CIUDADES } from '../data/mock'
import { useHerStore } from '../store/useHerStore'
import ui from '../styles/ui.module.css'
import type { BuscaEmpleo, Perfil, PreferenciaEventos } from '../types'

const OPCIONES_EMPLEO: { id: BuscaEmpleo; etiqueta: string }[] = [
  { id: 'si', etiqueta: 'Sí, estoy buscando' },
  { id: 'no', etiqueta: 'No por ahora' },
  { id: 'nose', etiqueta: 'No estoy segura' },
]

const OPCIONES_EVENTOS: { id: PreferenciaEventos; etiqueta: string }[] = [
  { id: 'virtual', etiqueta: 'Virtuales' },
  { id: 'presencial', etiqueta: 'Presenciales' },
  { id: 'ambos', etiqueta: 'Ambos' },
]

const OPCIONES_HIJOS = [1, 2, 3, 4]

export default function Registro() {
  const navigate = useNavigate()
  const perfilGuardado = useHerStore((s) => s.perfil)
  const guardarPerfil = useHerStore((s) => s.guardarPerfil)
  const [perfil, setPerfil] = useState<Perfil>(perfilGuardado)

  const actualizar = <K extends keyof Perfil>(campo: K, valor: Perfil[K]) =>
    setPerfil((actual) => ({ ...actual, [campo]: valor }))

  const esValido = perfil.nombre.trim().length > 1
  const hoyIso = new Date().toISOString().slice(0, 10)

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    if (!esValido) return
    // TODO: enviar a POST /users cuando exista el router de usuarios.
    guardarPerfil({ ...perfil, nombre: perfil.nombre.trim(), ocupacion: perfil.ocupacion.trim() })
    navigate('/metas')
  }

  return (
    <form className={ui.pantalla} onSubmit={enviar} noValidate>
      <CabeceraPasos paso={1} total={2} atras="/" />

      <main className={ui.cuerpo}>
        <div className={ui.intro}>
          <h1 className={ui.tituloDisplay}>Cuéntanos sobre ti</h1>
          <p className={ui.lead}>Con estas respuestas personalizamos tus retos, eventos y empleos en Her.</p>
        </div>

        <div className={ui.campos}>
          <div className={ui.campo}>
            <label htmlFor="nombre" className={ui.etiqueta}>
              Nombre completo
            </label>
            <input
              id="nombre"
              className={ui.entrada}
              value={perfil.nombre}
              onChange={(e) => actualizar('nombre', e.target.value)}
              placeholder="Ej. Litzy Tapia"
              autoComplete="name"
              required
            />
          </div>

          <div className={ui.dosColumnas}>
            <div className={ui.campo}>
              <label htmlFor="nacimiento" className={ui.etiqueta}>
                Fecha de nacimiento
              </label>
              <input
                id="nacimiento"
                type="date"
                className={ui.entrada}
                value={perfil.fechaNacimiento}
                max={hoyIso}
                onChange={(e) => actualizar('fechaNacimiento', e.target.value)}
                autoComplete="bday"
              />
            </div>
            <div className={ui.campo}>
              <label htmlFor="ciudad" className={ui.etiqueta}>
                Ciudad
              </label>
              <select id="ciudad" className={ui.entrada} value={perfil.ciudad} onChange={(e) => actualizar('ciudad', e.target.value)}>
                {CIUDADES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={ui.campo}>
            <label htmlFor="ocupacion" className={ui.etiqueta}>
              Ocupación
            </label>
            <input
              id="ocupacion"
              className={ui.entrada}
              value={perfil.ocupacion}
              onChange={(e) => actualizar('ocupacion', e.target.value)}
              placeholder="Estudiante, trabajo medio tiempo, etc."
              autoComplete="organization-title"
            />
          </div>
        </div>

        <section className={ui.seccion}>
          <h2 id="pregunta-hijos" className={ui.seccionTitulo}>
            ¿Cuántas hijas o hijos tienes?
          </h2>
          <div role="radiogroup" aria-labelledby="pregunta-hijos" className={ui.pastillasIguales}>
            {OPCIONES_HIJOS.map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={perfil.hijos === n}
                className={ui.pastilla}
                onClick={() => actualizar('hijos', n)}
              >
                {n === 4 ? '4 o más' : n}
              </button>
            ))}
          </div>
        </section>

        <section className={ui.seccion}>
          <h2 id="pregunta-empleo" className={ui.seccionTitulo}>
            ¿Buscas empleo?
          </h2>
          <div role="radiogroup" aria-labelledby="pregunta-empleo" className={ui.opciones}>
            {OPCIONES_EMPLEO.map((o) => (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={perfil.buscaEmpleo === o.id}
                className={ui.opcion}
                onClick={() => actualizar('buscaEmpleo', o.id)}
              >
                {o.etiqueta}
                <span className={ui.radio} aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>

        <section className={ui.seccion}>
          <h2 id="pregunta-eventos" className={ui.seccionTitulo}>
            ¿Qué eventos te interesan?
          </h2>
          <div role="radiogroup" aria-labelledby="pregunta-eventos" className={ui.pastillasIguales}>
            {OPCIONES_EVENTOS.map((o) => (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={perfil.eventos === o.id}
                className={ui.pastilla}
                onClick={() => actualizar('eventos', o.id)}
              >
                {o.etiqueta}
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className={ui.pie}>
        <Boton type="submit" bloque disabled={!esValido}>
          Siguiente
        </Boton>
      </footer>
    </form>
  )
}

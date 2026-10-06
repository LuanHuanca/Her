import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRegistro } from '../api/auth'
import { useActualizarPerfil, usePerfil } from '../api/perfil'
import Boton from '../components/Boton'
import Cabecera, { CabeceraPasos } from '../components/Cabecera'
import { CIUDADES } from '../data/mock'
import { ApiError } from '../lib/api'
import { useAuthStore } from '../store/useAuthStore'
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

const PERFIL_INICIAL: Perfil = {
  nombre: '',
  fechaNacimiento: '',
  ciudad: CIUDADES[0],
  ocupacion: '',
  hijos: 1,
  buscaEmpleo: 'nose',
  eventos: 'ambos',
}

export default function Registro() {
  const navigate = useNavigate()
  const modoEdicion = !!useAuthStore((s) => s.token)
  const registro = useRegistro()
  const { data: perfilGuardado } = usePerfil()
  const actualizarPerfil = useActualizarPerfil()
  const [perfil, setPerfil] = useState<Perfil>(PERFIL_INICIAL)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')

  useEffect(() => {
    if (modoEdicion && perfilGuardado) setPerfil(perfilGuardado)
  }, [modoEdicion, perfilGuardado])

  const actualizar = <K extends keyof Perfil>(campo: K, valor: Perfil[K]) =>
    setPerfil((actual) => ({ ...actual, [campo]: valor }))

  const contraseñasCoinciden = password.length > 0 && password === confirmar
  const esValido =
    perfil.nombre.trim().length > 1 &&
    perfil.fechaNacimiento.length > 0 &&
    (modoEdicion || (/\S+@\S+\.\S+/.test(email) && password.length >= 8 && contraseñasCoinciden))
  const hoyIso = new Date().toISOString().slice(0, 10)
  const guardando = registro.isPending || actualizarPerfil.isPending

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    if (!esValido || guardando) return
    const perfilLimpio = { ...perfil, nombre: perfil.nombre.trim(), ocupacion: perfil.ocupacion.trim() }
    if (modoEdicion) {
      actualizarPerfil.mutate(perfilLimpio, { onSuccess: () => navigate('/perfil') })
      return
    }
    registro.mutate(
      { ...perfilLimpio, email: email.trim().toLowerCase(), password },
      { onSuccess: () => navigate('/metas') },
    )
  }

  return (
    <form className={ui.pantalla} onSubmit={enviar} noValidate>
      {modoEdicion ? <Cabecera titulo="Editar datos" atras="/perfil" /> : <CabeceraPasos paso={1} total={2} atras="/" />}

      <main className={ui.cuerpo}>
        <div className={ui.intro}>
          <h1 className={ui.tituloDisplay}>{modoEdicion ? 'Tus datos' : 'Cuéntanos sobre ti'}</h1>
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

          {!modoEdicion && (
            <div className={ui.campo}>
              <label htmlFor="email" className={ui.etiqueta}>
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                className={ui.entrada}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                autoComplete="email"
                required
              />
            </div>
          )}

          {!modoEdicion && (
          <div className={ui.dosColumnas}>
            <div className={ui.campo}>
              <label htmlFor="password" className={ui.etiqueta}>
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className={ui.entrada}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
            <div className={ui.campo}>
              <label htmlFor="confirmar" className={ui.etiqueta}>
                Confirmar contraseña
              </label>
              <input
                id="confirmar"
                type="password"
                className={ui.entrada}
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                required
              />
            </div>
          </div>
          )}
          {!modoEdicion && confirmar.length > 0 && !contraseñasCoinciden && (
            <p className={ui.meta} style={{ color: 'var(--her-rosa-oscuro)' }}>
              Las contraseñas no coinciden.
            </p>
          )}

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

        {(registro.isError || actualizarPerfil.isError) && (
          <p role="alert" className={ui.meta} style={{ color: 'var(--her-rosa-oscuro)' }}>
            {(() => {
              const error = registro.error ?? actualizarPerfil.error
              return error instanceof ApiError ? error.message : 'No pudimos guardar tus datos.'
            })()}
          </p>
        )}
      </main>

      <footer className={ui.pie}>
        <Boton type="submit" bloque disabled={!esValido || guardando}>
          {guardando ? 'Guardando…' : modoEdicion ? 'Guardar cambios' : 'Siguiente'}
        </Boton>
      </footer>
    </form>
  )
}

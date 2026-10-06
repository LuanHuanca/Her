import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '../api/auth'
import Boton from '../components/Boton'
import Cabecera from '../components/Cabecera'
import { ApiError } from '../lib/api'
import ui from '../styles/ui.module.css'

export default function Login() {
  const navigate = useNavigate()
  const login = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const esValido = email.trim().length > 3 && password.length > 0

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    if (!esValido) return
    login.mutate(
      { email: email.trim().toLowerCase(), password },
      { onSuccess: () => navigate('/inicio') },
    )
  }

  return (
    <form className={ui.pantalla} onSubmit={enviar} noValidate>
      <Cabecera titulo="Iniciar sesión" atras="/" />

      <main className={ui.cuerpo}>
        <div className={ui.intro}>
          <h1 className={ui.tituloDisplay}>Hola de nuevo</h1>
          <p className={ui.lead}>Ingresa con tu correo y contraseña para continuar tu ruta.</p>
        </div>

        <div className={ui.campos}>
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
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        {login.isError && (
          <p className={ui.meta} role="alert" style={{ color: 'var(--her-rosa-oscuro)' }}>
            {login.error instanceof ApiError ? login.error.message : 'No pudimos iniciar sesión.'}
          </p>
        )}
      </main>

      <footer className={ui.pie}>
        <Boton type="submit" bloque disabled={!esValido || login.isPending}>
          {login.isPending ? 'Ingresando…' : 'Ingresar'}
        </Boton>
        <p className={`${ui.meta} ${ui.centrado}`}>
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </footer>
    </form>
  )
}

/**
 * Componente raíz: define las rutas de todas las pantallas de Her.
 * Las pantallas usan datos de ejemplo (src/data/mock.ts) hasta que el backend
 * exponga los routers de dominio.
 */
import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import Bienvenida from './pages/Bienvenida'
import Comunidad from './pages/Comunidad'
import EmpleoDetalle from './pages/EmpleoDetalle'
import Empleos from './pages/Empleos'
import Eventos from './pages/Eventos'
import Inicio from './pages/Inicio'
import Mensajes from './pages/Mensajes'
import Metas from './pages/Metas'
import Perfil from './pages/Perfil'
import Postular from './pages/Postular'
import Publicacion from './pages/Publicacion'
import Recompensas from './pages/Recompensas'
import Registro from './pages/Registro'
import RetoDelDia from './pages/RetoDelDia'
import Retos from './pages/Retos'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* Onboarding */}
        <Route index element={<Bienvenida />} />
        <Route path="registro" element={<Registro />} />
        <Route path="metas" element={<Metas />} />

        {/* Retos de 21 días */}
        <Route path="inicio" element={<Inicio />} />
        <Route path="retos" element={<Retos />} />
        <Route path="retos/hoy" element={<RetoDelDia />} />
        <Route path="recompensas" element={<Recompensas />} />

        {/* Comunidad y eventos */}
        <Route path="comunidad" element={<Comunidad />} />
        <Route path="comunidad/:id" element={<Publicacion />} />
        <Route path="mensajes" element={<Mensajes />} />
        <Route path="eventos" element={<Eventos />} />

        {/* Empleabilidad y perfil */}
        <Route path="empleos" element={<Empleos />} />
        <Route path="empleos/:id" element={<EmpleoDetalle />} />
        <Route path="empleos/:id/postular" element={<Postular />} />
        <Route path="perfil" element={<Perfil />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App

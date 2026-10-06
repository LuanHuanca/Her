/**
 * Componente raíz: define las rutas de todas las pantallas de Her.
 */
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './admin/AdminLayout'
import Comunidad from './admin/pages/Comunidad'
import Dashboard from './admin/pages/Dashboard'
import Empleos from './admin/pages/Empleos'
import Eventos from './admin/pages/Eventos'
import Modulos from './admin/pages/Modulos'
import Usuarios from './admin/pages/Usuarios'
import RequireAdmin from './admin/RequireAdmin'
import AppShell from './components/AppShell'
import RequireAuth from './components/RequireAuth'
import Bienvenida from './pages/Bienvenida'
import ComunidadConsumidora from './pages/Comunidad'
import EmpleoDetalle from './pages/EmpleoDetalle'
import EmpleosConsumidora from './pages/Empleos'
import EventosConsumidora from './pages/Eventos'
import Inicio from './pages/Inicio'
import Login from './pages/Login'
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
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />

        <Route element={<RequireAuth />}>
          <Route path="metas" element={<Metas />} />

          {/* Retos de 21 días */}
          <Route path="inicio" element={<Inicio />} />
          <Route path="retos" element={<Retos />} />
          <Route path="retos/hoy" element={<RetoDelDia />} />
          <Route path="recompensas" element={<Recompensas />} />

          {/* Comunidad y eventos */}
          <Route path="comunidad" element={<ComunidadConsumidora />} />
          <Route path="comunidad/:id" element={<Publicacion />} />
          <Route path="mensajes" element={<Mensajes />} />
          <Route path="eventos" element={<EventosConsumidora />} />

          {/* Empleabilidad y perfil */}
          <Route path="empleos" element={<EmpleosConsumidora />} />
          <Route path="empleos/:id" element={<EmpleoDetalle />} />
          <Route path="empleos/:id/postular" element={<Postular />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
      </Route>

      {/* Panel de administración: layout propio, fuera del AppShell mobile-first. */}
      <Route path="admin" element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="modulos" element={<Modulos />} />
          <Route path="eventos" element={<Eventos />} />
          <Route path="empleos" element={<Empleos />} />
          <Route path="comunidad" element={<Comunidad />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

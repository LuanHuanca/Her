/** Sesión de la usuaria: token JWT + sus datos básicos. Persistido en localStorage. */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UsuarioAutenticado } from '../types'

interface AuthState {
  token: string | null
  usuario: UsuarioAutenticado | null
  iniciarSesion: (token: string, usuario: UsuarioAutenticado) => void
  actualizarUsuario: (usuario: UsuarioAutenticado) => void
  cerrarSesion: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      iniciarSesion: (token, usuario) => set({ token, usuario }),
      actualizarUsuario: (usuario) => set({ usuario }),
      cerrarSesion: () => set({ token: null, usuario: null }),
    }),
    { name: 'her-auth' },
  ),
)

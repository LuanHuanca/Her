/**
 * Estado global de la app (zustand), persistido en localStorage.
 * Mientras no existan los endpoints, aquí vive todo lo que la usuaria
 * registra o modifica: perfil, metas, progreso del reto, likes, eventos, postulaciones.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TAREA_DEL_DIA } from '../data/mock'
import { iniciales } from '../lib/texto'
import type { Comentario, Metas, Perfil, Persona, Publicacion } from '../types'

interface EstadoReto {
  moduloId: string
  dia: number
  racha: number
  completadoHoy: boolean
  reflexion: string
}

interface Datos {
  perfil: Perfil
  metas: Metas
  reto: EstadoReto
  puntos: number
  likes: Record<string, boolean>
  publicacionesPropias: Publicacion[]
  comentariosPropios: Record<string, Comentario[]>
  eventosInscritos: string[]
  empleosGuardados: string[]
  postulaciones: string[]
  cv: string | null
}

interface Acciones {
  guardarPerfil: (perfil: Perfil) => void
  guardarMetas: (metas: Metas) => void
  completarTarea: (reflexion: string, compartir: boolean) => void
  alternarLike: (publicacionId: string) => void
  publicar: (texto: string) => void
  comentar: (publicacionId: string, texto: string) => void
  alternarEvento: (eventoId: string) => void
  alternarGuardado: (empleoId: string) => void
  subirCv: (nombreArchivo: string) => void
  postular: (empleoId: string) => void
  cerrarSesion: () => void
}

const datosIniciales: Datos = {
  perfil: {
    nombre: 'Litzy Tapia',
    fechaNacimiento: '1996-05-17',
    ciudad: 'Cochabamba',
    ocupacion: 'Ingeniera de sistemas',
    hijos: 2,
    buscaEmpleo: 'si',
    eventos: 'ambos',
  },
  metas: { objetivos: ['empleo', 'tiempo'], minutosAlDia: 15, horizonteMeses: 6 },
  reto: { moduloId: TAREA_DEL_DIA.moduloId, dia: TAREA_DEL_DIA.dia, racha: 6, completadoHoy: false, reflexion: '' },
  puntos: 8918,
  likes: {},
  publicacionesPropias: [],
  comentariosPropios: {},
  eventosInscritos: [],
  empleosGuardados: [],
  postulaciones: [],
  cv: null,
}

const crearId = (prefijo: string) => `${prefijo}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

const personaDesdePerfil = (perfil: Perfil): Persona => ({
  nombre: perfil.nombre,
  iniciales: iniciales(perfil.nombre),
  tono: 'rosa',
})

const alternar = (lista: string[], id: string) => (lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id])

export const useHerStore = create<Datos & Acciones>()(
  persist(
    (set, get) => ({
      ...datosIniciales,

      guardarPerfil: (perfil) => set({ perfil }),

      guardarMetas: (metas) => set({ metas }),

      completarTarea: (reflexion, compartir) => {
        const { reto, puntos, perfil, publicacionesPropias } = get()
        if (reto.completadoHoy) return
        const publicacion: Publicacion = {
          id: crearId('p'),
          autora: personaDesdePerfil(perfil),
          hace: 'Ahora',
          etiqueta: `Día ${reto.dia}`,
          texto: reflexion,
          likes: 0,
          comentarios: [],
        }
        set({
          reto: { ...reto, completadoHoy: true, racha: reto.racha + 1, reflexion },
          puntos: puntos + TAREA_DEL_DIA.puntos,
          publicacionesPropias: compartir ? [publicacion, ...publicacionesPropias] : publicacionesPropias,
        })
      },

      alternarLike: (publicacionId) =>
        set((s) => ({ likes: { ...s.likes, [publicacionId]: !s.likes[publicacionId] } })),

      publicar: (texto) =>
        set((s) => ({
          publicacionesPropias: [
            {
              id: crearId('p'),
              autora: personaDesdePerfil(s.perfil),
              hace: 'Ahora',
              etiqueta: 'Mi avance',
              texto,
              likes: 0,
              comentarios: [],
            },
            ...s.publicacionesPropias,
          ],
        })),

      comentar: (publicacionId, texto) =>
        set((s) => ({
          comentariosPropios: {
            ...s.comentariosPropios,
            [publicacionId]: [
              ...(s.comentariosPropios[publicacionId] ?? []),
              { id: crearId('c'), autora: personaDesdePerfil(s.perfil), hace: 'Ahora', texto },
            ],
          },
        })),

      alternarEvento: (eventoId) => set((s) => ({ eventosInscritos: alternar(s.eventosInscritos, eventoId) })),

      alternarGuardado: (empleoId) => set((s) => ({ empleosGuardados: alternar(s.empleosGuardados, empleoId) })),

      subirCv: (nombreArchivo) => set({ cv: nombreArchivo }),

      postular: (empleoId) =>
        set((s) => (s.postulaciones.includes(empleoId) ? s : { postulaciones: [...s.postulaciones, empleoId] })),

      cerrarSesion: () => set({ ...datosIniciales }),
    }),
    { name: 'her-app', version: 1 },
  ),
)

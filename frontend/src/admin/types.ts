import type { Modalidad, Rol } from '../types'

export interface UsuarioAdmin {
  id: number
  email: string
  nombre: string
  ciudad: string
  rol: Rol
  activo: boolean
  creadoEn: string
}

export interface ModuloAdmin {
  id: string
  numero: number
  titulo: string
  corto: string
  descripcion: string
  totalTareas: number
}

export interface ModuloFormulario {
  numero: number
  titulo: string
  corto: string
  descripcion: string
}

export interface TareaAdmin {
  id: number
  dia: number
  titulo: string
  frase: string
  duracionSeg: number
  minutos: number
  puntos: number
  texto: string[]
  consigna: string
}

export type TareaFormulario = Omit<TareaAdmin, 'id'>

export interface EventoAdmin {
  id: number
  titulo: string
  fecha: string
  hora: string
  duracionMin: number
  modalidad: Modalidad
  lugar: string
  descripcion: string
  totalInscritas: number
}

export type EventoFormulario = Omit<EventoAdmin, 'id' | 'totalInscritas'>

export interface EmpresaAdmin {
  id: number
  nombre: string
  iniciales: string
  tono: string
  totalEmpleos: number
}

export interface EmpleoAdmin {
  id: string
  puesto: string
  empresaId: number
  empresaNombre: string
  ciudad: string
  jornada: 'Tiempo completo' | 'Medio tiempo'
  modalidad: 'Presencial' | 'Remoto' | 'Híbrido'
  descripcion: string
  requisitos: string[]
  coincidencias: string[]
  totalPostulaciones: number
  totalGuardados: number
}

export type EmpleoFormulario = Omit<EmpleoAdmin, 'id' | 'empresaNombre' | 'totalPostulaciones' | 'totalGuardados'>

export interface PublicacionAdmin {
  id: number
  autoraNombre: string
  hace: string
  etiqueta: string
  texto: string
  likes: number
  totalComentarios: number
}

export interface ComentarioAdmin {
  id: number
  autoraNombre: string
  hace: string
  texto: string
}

export interface ResumenAdmin {
  totalUsuarias: number
  totalAdmins: number
  usuariasActivasHoy: number
  totalPublicaciones: number
  totalEmpleos: number
  totalPostulaciones: number
  eventosProximos: number
}

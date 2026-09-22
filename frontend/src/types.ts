export type Tono = 'rosa' | 'lavanda' | 'salvia' | 'durazno' | 'cielo'

export interface Persona {
  nombre: string
  iniciales: string
  tono: Tono
}

export type BuscaEmpleo = 'si' | 'no' | 'nose'
export type PreferenciaEventos = 'virtual' | 'presencial' | 'ambos'

export interface Perfil {
  nombre: string
  /** Fecha ISO (AAAA-MM-DD). */
  fechaNacimiento: string
  ciudad: string
  ocupacion: string
  hijos: number
  buscaEmpleo: BuscaEmpleo
  eventos: PreferenciaEventos
}

export type Rol = 'usuaria' | 'admin'

export interface UsuarioAutenticado extends Perfil {
  id: number
  email: string
  tono: Tono
  rol: Rol
  activo: boolean
}

export interface Metas {
  objetivos: string[]
  minutosAlDia: number
  horizonteMeses: number
}

export interface Modulo {
  id: string
  numero: number
  titulo: string
  corto: string
  descripcion: string
}

export type EstadoModulo = 'completado' | 'actual' | 'bloqueado'

export interface ModuloEnRuta extends Modulo {
  estado: EstadoModulo
  diasHechos: number | null
}

export interface Ruta {
  racha: number
  modulos: ModuloEnRuta[]
}

export interface TareaDelDia {
  titulo: string
  frase: string
  duracionSeg: number
  minutos: number
  puntos: number
  texto: string[]
  consigna: string
}

export interface RetoHoy {
  dia: number
  racha: number
  completadoHoy: boolean
  reflexion: string
  puntosTotales: number
  moduloCorto: string
  tarea: TareaDelDia
}

export interface Insignia {
  nombre: string
  icono: string
  lograda: boolean
}

export interface GanadoraSemana {
  persona: Persona
  detalle: string
}

export interface Recompensas {
  puntos: number
  racha: number
  insignias: Insignia[]
  ganadoraSemana: GanadoraSemana | null
}

export interface Comentario {
  id: number
  autora: Persona
  hace: string
  texto: string
}

export interface Publicacion {
  id: number
  autora: Persona
  hace: string
  etiqueta: string
  texto: string
  /** Foto adjunta: su descripción es el texto alternativo; la escena elige la ilustración provisional. */
  foto?: { descripcion: string; escena: 'actividad' | 'estudio' } | null
  likes: number
  meGusta: boolean
  comentarios: Comentario[]
}

export type TipoChat = 'amiga' | 'mentora' | 'grupo'

export interface Chat {
  id: number
  persona: Persona
  tipo: TipoChat
  ultimo: string
  hace: string
  noLeidos: number
}

export type Modalidad = 'virtual' | 'presencial'

export interface Evento {
  id: number
  titulo: string
  /** Fecha ISO (AAAA-MM-DD), ya calculada por el backend. */
  fecha: string
  hora: string
  duracionMin: number
  modalidad: Modalidad
  lugar: string
  descripcion: string
  inscrita: boolean
}

export interface Empleo {
  id: string
  puesto: string
  empresa: Persona
  ciudad: string
  jornada: 'Tiempo completo' | 'Medio tiempo'
  modalidad: 'Presencial' | 'Remoto' | 'Híbrido'
  publica: Persona
  hace: string
  descripcion: string
  requisitos: string[]
  coincidencias: string[]
  guardado: boolean
  postulada: boolean
}

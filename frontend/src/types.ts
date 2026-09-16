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

export interface TareaDelDia {
  moduloId: string
  dia: number
  titulo: string
  frase: string
  duracionSeg: number
  minutos: number
  puntos: number
  texto: string[]
  consigna: string
}

export interface Comentario {
  id: string
  autora: Persona
  hace: string
  texto: string
}

export interface Publicacion {
  id: string
  autora: Persona
  hace: string
  etiqueta: string
  texto: string
  /** Foto adjunta: su descripción es el texto alternativo; la escena elige la ilustración provisional. */
  foto?: { descripcion: string; escena: 'actividad' | 'estudio' }
  likes: number
  comentarios: Comentario[]
}

export type TipoChat = 'amiga' | 'mentora' | 'grupo'

export interface Chat {
  id: string
  persona: Persona
  tipo: TipoChat
  ultimo: string
  hace: string
  noLeidos: number
}

export type Modalidad = 'virtual' | 'presencial'

export interface Evento {
  id: string
  titulo: string
  /** Días desde hoy; permite que el calendario de ejemplo siempre tenga eventos próximos. */
  offsetDias: number
  hora: string
  duracionMin: number
  modalidad: Modalidad
  lugar: string
  descripcion: string
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
}

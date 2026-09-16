/*
 * Datos de ejemplo para el prototipo navegable.
 * Se reemplazarán por llamadas a la API cuando existan los routers de dominio
 * (auth, users, challenges, community, events).
 */
import type { Chat, Empleo, Evento, Modulo, Persona, Publicacion, TareaDelDia } from '../types'

export const PERSONAS = {
  diana: { nombre: 'Diana Romero', iniciales: 'DR', tono: 'rosa' },
  lucero: { nombre: 'Lucero Quiroz', iniciales: 'LQ', tono: 'lavanda' },
  andrea: { nombre: 'Andrea Sánchez', iniciales: 'AS', tono: 'salvia' },
  jessica: { nombre: 'Jessica Pérez', iniciales: 'JP', tono: 'durazno' },
  cristina: { nombre: 'Cristina Montaño', iniciales: 'CM', tono: 'cielo' },
  juliana: { nombre: 'Juliana Portillo', iniciales: 'JP', tono: 'rosa' },
} satisfies Record<string, Persona>

export const CIUDADES = ['Cochabamba', 'La Paz', 'El Alto', 'Santa Cruz', 'Otra']

export const OBJETIVOS = [
  { id: 'curso', etiqueta: 'Terminar un curso de mi área profesional' },
  { id: 'tiempo', etiqueta: 'Organizar mejor mi tiempo' },
  { id: 'finanzas', etiqueta: 'Mejorar mis finanzas personales' },
  { id: 'programar', etiqueta: 'Aprender a programar' },
  { id: 'empleo', etiqueta: 'Conseguir un empleo' },
  { id: 'negocio', etiqueta: 'Emprender o hacer crecer mi negocio' },
  { id: 'red', etiqueta: 'Ampliar mi red de contactos' },
]

export const MODULOS: Modulo[] = [
  { id: 'amor-propio', numero: 1, titulo: 'Amor propio y autoconfianza', corto: 'Amor propio', descripcion: 'Conócete, valórate y habla bien de ti' },
  { id: 'mentalidad', numero: 2, titulo: 'Mentalidad', corto: 'Mentalidad', descripcion: 'Hábitos y creencias que te impulsan' },
  { id: 'finanzas', numero: 3, titulo: 'Finanzas personales', corto: 'Finanzas', descripcion: 'Presupuesto, ahorro y metas' },
  { id: 'organizacion', numero: 4, titulo: 'Organización y equilibrio', corto: 'Organización', descripcion: 'Tiempo, roles y responsabilidades' },
  { id: 'liderazgo', numero: 5, titulo: 'Liderazgo', corto: 'Liderazgo', descripcion: 'Comunicación y toma de decisiones' },
  { id: 'habilidades', numero: 6, titulo: 'Habilidades para el trabajo', corto: 'Habilidades', descripcion: 'Herramientas digitales, CV y entrevistas' },
]

export const TAREA_DEL_DIA: TareaDelDia = {
  moduloId: 'amor-propio',
  dia: 7,
  titulo: '¿Quién soy realmente?',
  frase: 'No puedes amarte si no te conoces primero',
  duracionSeg: 300,
  minutos: 10,
  puntos: 50,
  texto: [
    'Conocerte a ti misma es el primer paso para transformarte. Cuando te tomas el tiempo de mirar hacia adentro, descubres quién eres, qué amas, qué te motiva y qué te hace única.',
    'Saber quién eres te da claridad para tomar mejores decisiones, poner límites cuando hace falta y vivir desde tu autenticidad.',
  ],
  consigna: 'Escribe 3 cosas que admiras de ti misma',
}

export const HISTORIAS: Persona[] = [PERSONAS.diana, PERSONAS.lucero, PERSONAS.andrea, PERSONAS.jessica, PERSONAS.cristina]

export const PUBLICACIONES: Publicacion[] = [
  {
    id: 'p1',
    autora: PERSONAS.diana,
    hace: 'Hace 2 minutos',
    etiqueta: 'Día 5',
    texto: 'Estoy muy feliz de decidir hacer ejercicio hoy a pesar de estar muy ocupada. ¡El reto me está ayudando a darme un espacio!',
    foto: { descripcion: 'Zapatillas rosadas, botella de agua y cuerda para saltar', escena: 'actividad' },
    likes: 121,
    comentarios: [
      { id: 'c1', autora: PERSONAS.andrea, hace: 'Hace 1 minuto', texto: '¡Qué bien, Diana! Ese espacio para ti vale oro.' },
    ],
  },
  {
    id: 'p2',
    autora: PERSONAS.lucero,
    hace: 'Hace 5 minutos',
    etiqueta: 'Evento',
    texto: 'La última reunión me inspiró a tomar este nuevo curso. ¡Gracias a las mentoras por compartir sus historias!',
    foto: { descripcion: 'Mujer estudiando frente a su laptop', escena: 'estudio' },
    likes: 121,
    comentarios: [
      { id: 'c2', autora: PERSONAS.cristina, hace: 'Hace 2 minutos', texto: 'Felicidades, ¿me pasas el enlace? Me interesa.' },
      { id: 'c3', autora: PERSONAS.jessica, hace: 'Hace 1 minuto', texto: '¡Vamos, Lucero! Cuéntanos cómo te va.' },
    ],
  },
  {
    id: 'p3',
    autora: PERSONAS.jessica,
    hace: 'Hace 1 hora',
    etiqueta: 'Finanzas',
    texto: 'Hoy armé mi primer presupuesto semanal con la plantilla del módulo. Pequeños pasos, grandes cambios.',
    likes: 64,
    comentarios: [],
  },
]

export const CHATS: Chat[] = [
  { id: 'm1', persona: PERSONAS.jessica, tipo: 'amiga', ultimo: 'Espero que estés bien', hace: '2 s', noLeidos: 1 },
  { id: 'm2', persona: PERSONAS.diana, tipo: 'amiga', ultimo: 'Nos vemos en la reunión', hace: '1 min', noLeidos: 0 },
  { id: 'm3', persona: PERSONAS.lucero, tipo: 'amiga', ultimo: 'Tu historia me inspiró', hace: '2 min', noLeidos: 0 },
  { id: 'm4', persona: PERSONAS.andrea, tipo: 'mentora', ultimo: '¿Ya hiciste tu reto de hoy?', hace: '5 min', noLeidos: 2 },
  {
    id: 'm5',
    persona: { nombre: 'Mamás emprendedoras', iniciales: 'ME', tono: 'salvia' },
    tipo: 'grupo',
    ultimo: 'Andrea: ¿Quién va al encuentro del sábado?',
    hace: '20 min',
    noLeidos: 3,
  },
  { id: 'm6', persona: PERSONAS.cristina, tipo: 'amiga', ultimo: '¡Hola!', hace: '1 día', noLeidos: 0 },
  { id: 'm7', persona: PERSONAS.juliana, tipo: 'amiga', ultimo: '¡Me encanta!', hace: '1 día', noLeidos: 0 },
]

export const EVENTOS: Evento[] = [
  {
    id: 'e1',
    titulo: 'Glow Up: mamás que emprenden',
    offsetDias: 2,
    hora: '19:00',
    duracionMin: 45,
    modalidad: 'virtual',
    lugar: 'Zoom',
    descripcion: 'Dos mamás emprendedoras comparten cómo equilibran su negocio y su familia.',
  },
  {
    id: 'e2',
    titulo: 'Mujeres de éxito',
    offsetDias: 5,
    hora: '19:30',
    duracionMin: 45,
    modalidad: 'virtual',
    lugar: 'Google Meet',
    descripcion: 'Historias reales de liderazgo contadas por sus protagonistas.',
  },
  {
    id: 'e3',
    titulo: 'Mejora tu LinkedIn',
    offsetDias: 9,
    hora: '10:00',
    duracionMin: 45,
    modalidad: 'virtual',
    lugar: 'Zoom',
    descripcion: 'Arma, paso a paso, un perfil que atraiga oportunidades.',
  },
  {
    id: 'e4',
    titulo: 'Encuentro de mamás',
    offsetDias: 16,
    hora: '16:00',
    duracionMin: 90,
    modalidad: 'presencial',
    lugar: 'Cochabamba',
    descripcion: 'Un espacio para conocernos, compartir avances y hacer red.',
  },
  {
    id: 'e5',
    titulo: 'Finanzas para el hogar',
    offsetDias: 23,
    hora: '10:00',
    duracionMin: 60,
    modalidad: 'presencial',
    lugar: 'La Paz',
    descripcion: 'Taller práctico de presupuesto familiar y ahorro.',
  },
]

export const EMPLEOS: Empleo[] = [
  {
    id: 'ejecutiva-ventas',
    puesto: 'Ejecutiva de ventas',
    empresa: { nombre: 'Pata Pila', iniciales: 'PP', tono: 'durazno' },
    ciudad: 'Cochabamba',
    jornada: 'Tiempo completo',
    modalidad: 'Presencial',
    publica: PERSONAS.lucero,
    hace: 'Hace 5 minutos',
    descripcion: 'Buscamos a alguien con ganas de crecer, buena comunicación y orientación a metas para atender clientes y cerrar ventas.',
    requisitos: ['Buena comunicación oral', 'Organización del tiempo', 'Experiencia en atención al cliente (deseable)'],
    coincidencias: ['Comunicación', 'Organización del tiempo', 'Atención al cliente'],
  },
  {
    id: 'consultora-junior',
    puesto: 'Consultora junior',
    empresa: { nombre: 'Estudio Andino', iniciales: 'EA', tono: 'salvia' },
    ciudad: 'La Paz',
    jornada: 'Medio tiempo',
    modalidad: 'Remoto',
    publica: PERSONAS.andrea,
    hace: 'Hace 3 horas',
    descripcion: 'Apoyo en la elaboración de informes y seguimiento a clientes, con horario flexible de 4 horas diarias.',
    requisitos: ['Excel básico', 'Redacción clara', 'Disponibilidad de 4 horas diarias'],
    coincidencias: ['Excel básico', 'Redacción'],
  },
  {
    id: 'encargada-tienda',
    puesto: 'Encargada de tienda',
    empresa: { nombre: 'Tienda Awayo', iniciales: 'TA', tono: 'rosa' },
    ciudad: 'Cochabamba',
    jornada: 'Medio tiempo',
    modalidad: 'Presencial',
    publica: PERSONAS.diana,
    hace: 'Ayer',
    descripcion: 'Atención al público, control de inventario y cierre de caja en turno de mañana.',
    requisitos: ['Manejo de caja', 'Atención al cliente', 'Turno de mañana'],
    coincidencias: ['Atención al cliente'],
  },
  {
    id: 'asistente-administrativa',
    puesto: 'Asistente administrativa',
    empresa: { nombre: 'Contadores Illimani', iniciales: 'CI', tono: 'cielo' },
    ciudad: 'El Alto',
    jornada: 'Medio tiempo',
    modalidad: 'Híbrido',
    publica: PERSONAS.jessica,
    hace: 'Hace 2 días',
    descripcion: 'Gestión de documentos, agenda y archivo digital. Dos días presenciales por semana.',
    requisitos: ['Office básico', 'Orden y puntualidad', 'Bachillerato concluido'],
    coincidencias: ['Organización del tiempo', 'Office básico'],
  },
  {
    id: 'desarrolladora-web',
    puesto: 'Desarrolladora web junior',
    empresa: { nombre: 'Nube Sur', iniciales: 'NS', tono: 'lavanda' },
    ciudad: 'Santa Cruz',
    jornada: 'Tiempo completo',
    modalidad: 'Remoto',
    publica: PERSONAS.lucero,
    hace: 'Hace 3 días',
    descripcion: 'Maquetación de sitios y mantenimiento de páginas para clientes pequeños. Incluye mentoría semanal.',
    requisitos: ['HTML y CSS', 'Ganas de aprender JavaScript', 'Portafolio (aunque sea pequeño)'],
    coincidencias: ['Ganas de aprender'],
  },
]

export const GANADORA_SEMANA = {
  persona: { nombre: 'Jessica Solano', iniciales: 'JS', tono: 'durazno' } satisfies Persona,
  detalle: '21 días seguidos · 1 240 pts esta semana',
}

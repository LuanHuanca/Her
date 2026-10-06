/**
 * Datos estáticos que siguen viviendo en el frontend porque son picklists de formulario
 * (reflejan los mismos valores que valida el backend, ver backend/app/constants.py) o
 * elementos puramente decorativos (HISTORIAS: no hay backend de "historias" todavía).
 * Todo lo demás (módulos, tareas, publicaciones, chats, eventos, empleos) ahora viene de la API.
 */
import type { Persona } from '../types'

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

const PERSONAS = {
  diana: { nombre: 'Diana Romero', iniciales: 'DR', tono: 'rosa' },
  lucero: { nombre: 'Lucero Quiroz', iniciales: 'LQ', tono: 'lavanda' },
  andrea: { nombre: 'Andrea Sánchez', iniciales: 'AS', tono: 'salvia' },
  jessica: { nombre: 'Jessica Pérez', iniciales: 'JP', tono: 'durazno' },
  cristina: { nombre: 'Cristina Montaño', iniciales: 'CM', tono: 'cielo' },
} satisfies Record<string, Persona>

/** Decorativo: aún no hay backend de "historias" (estados tipo Instagram). */
export const HISTORIAS: Persona[] = [PERSONAS.diana, PERSONAS.lucero, PERSONAS.andrea, PERSONAS.jessica, PERSONAS.cristina]

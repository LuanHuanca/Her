const LOCALE = 'es-BO'
const MS_POR_DIA = 86_400_000

export const INICIALES_SEMANA = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function inicioDelDia(fecha: Date): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
}

export function sumarDias(fecha: Date, dias: number): Date {
  const resultado = new Date(fecha)
  resultado.setDate(resultado.getDate() + dias)
  return resultado
}

/** Días completos de `desde` a `hasta` (negativo si `hasta` es anterior), ignorando la hora. */
export function diasEntre(desde: Date, hasta: Date): number {
  return Math.round((inicioDelDia(hasta).getTime() - inicioDelDia(desde).getTime()) / MS_POR_DIA)
}

export function claveDia(fecha: Date): string {
  return `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`
}

/** "Jueves, 8 de julio" */
export function fechaLarga(fecha: Date): string {
  return capitalizar(new Intl.DateTimeFormat(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' }).format(fecha))
}

/** "Jue" */
export function diaSemanaCorto(fecha: Date): string {
  return capitalizar(new Intl.DateTimeFormat(LOCALE, { weekday: 'short' }).format(fecha).replace('.', ''))
}

/** "JUL" */
export function mesCorto(fecha: Date): string {
  return new Intl.DateTimeFormat(LOCALE, { month: 'short' }).format(fecha).replace('.', '').toUpperCase()
}

/** "Julio de 2026" */
export function tituloMes(anio: number, mes: number): string {
  return capitalizar(new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' }).format(new Date(anio, mes, 1)))
}

/** Lunes a domingo de la semana que contiene `fecha`. */
export function semanaDe(fecha: Date): Date[] {
  const base = inicioDelDia(fecha)
  const lunes = sumarDias(base, -((base.getDay() + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i))
}

/** Celdas del calendario mensual empezando en lunes; `null` para los huecos. */
export function celdasDelMes(anio: number, mes: number): (Date | null)[] {
  const huecos = (new Date(anio, mes, 1).getDay() + 6) % 7
  const diasEnMes = new Date(anio, mes + 1, 0).getDate()
  const celdas: (Date | null)[] = Array.from({ length: huecos }, () => null)
  for (let dia = 1; dia <= diasEnMes; dia++) celdas.push(new Date(anio, mes, dia))
  while (celdas.length % 7 !== 0) celdas.push(null)
  return celdas
}

export function edadDesde(fechaIso: string, hoy = new Date()): number | null {
  const [anio, mes, dia] = fechaIso.split('-').map(Number)
  if (!anio || !mes || !dia) return null
  const cumplioEsteAnio = hoy.getMonth() + 1 > mes || (hoy.getMonth() + 1 === mes && hoy.getDate() >= dia)
  return hoy.getFullYear() - anio - (cumplioEsteAnio ? 0 : 1)
}

/** 72 → "1:12" */
export function formatoTiempo(segundos: number): string {
  const minutos = Math.floor(segundos / 60)
  const resto = Math.floor(segundos % 60)
  return `${minutos}:${resto.toString().padStart(2, '0')}`
}

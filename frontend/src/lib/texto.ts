export function cx(...clases: Array<string | false | null | undefined>): string {
  return clases.filter(Boolean).join(' ')
}

export function iniciales(nombre: string): string {
  const letras = nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('')
  return letras || 'H'
}

export function primerNombre(nombre: string): string {
  return nombre.trim().split(/\s+/)[0] ?? ''
}

export function formatoPuntos(puntos: number): string {
  return new Intl.NumberFormat('es-BO').format(puntos)
}

/** Minúsculas y sin tildes, para búsquedas tolerantes. */
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
}

export function plural(cantidad: number, singular: string, pluralTexto: string): string {
  return `${cantidad} ${cantidad === 1 ? singular : pluralTexto}`
}

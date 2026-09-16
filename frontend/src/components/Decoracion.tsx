interface Props {
  tamano: number
  anillos?: number
  color?: string
  grosor?: number
  className?: string
}

/** Círculos concéntricos de la identidad visual de Her. */
export default function Decoracion({ tamano, anillos = 3, color = '#F4C3CE', grosor = 1.5, className }: Props) {
  const centro = tamano / 2
  const paso = (centro - grosor) / (anillos + 0.5)
  return (
    <svg width={tamano} height={tamano} viewBox={`0 0 ${tamano} ${tamano}`} fill="none" aria-hidden="true" className={className}>
      {Array.from({ length: anillos }, (_, i) => (
        <circle key={i} cx={centro} cy={centro} r={centro - grosor - paso * i} stroke={color} strokeWidth={grosor} />
      ))}
    </svg>
  )
}

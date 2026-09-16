/*
 * Ilustraciones vectoriales provisionales. Se reemplazarán por imágenes reales
 * (fotos de publicaciones, arte de los retos) cuando el backend las sirva.
 */

export function RetratoIlustrado({ tamano = 176 }: { tamano?: number }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 176 176" role="img" aria-label="Ilustración de una mujer sonriendo rodeada de hojas">
      <rect width="176" height="176" fill="#F9C9D3" />
      <circle cx="88" cy="70" r="46" fill="#FBDDB8" />
      <path d="M18 60c14-10 30-6 38 8-16 4-30 2-38-8z" fill="#E48A9C" />
      <path d="M158 54c-14-10-32-4-38 10 16 4 30 0 38-10z" fill="#C8385A" />
      <path d="M30 120c8-18 26-22 38-12-12 12-26 16-38 12z" fill="#D9A441" />
      <path d="M150 116c-10-16-28-18-38-6 12 10 28 12 38 6z" fill="#E48A9C" />
      <path d="M54 176c0-30 15-50 34-50s34 20 34 50z" fill="#C8385A" />
      <path d="M58 84c0-26 13-42 30-42s30 16 30 42c0 8-4 18-8 22H66c-4-4-8-14-8-22z" fill="#5A2E2A" />
      <ellipse cx="88" cy="88" rx="20" ry="24" fill="#E7B48F" />
      <path d="M79 96c5 5 13 5 18 0" stroke="#7A2238" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M78 84c2-2 5-2 7 0M91 84c2-2 5-2 7 0" stroke="#5A2E2A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/** Placeholder de la foto de una publicación; la descripción es su texto alternativo. */
export function FotoIlustrada({ descripcion, escena }: { descripcion: string; escena: 'actividad' | 'estudio' }) {
  return (
    <svg
      viewBox="0 0 320 170"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={descripcion}
      style={{ display: 'block', width: '100%', height: 170, borderRadius: 16 }}
    >
      {escena === 'actividad' ? (
        <>
          <rect width="320" height="170" fill="#FCE8EC" />
          <circle cx="252" cy="50" r="26" fill="#FBDDB8" />
          <path d="M0 125c50-40 100-40 150-10s110 20 170-20v75H0z" fill="#E48A9C" />
          <path d="M0 146c60-24 120-20 180 0s100 10 140-6v30H0z" fill="#C8385A" />
          <rect x="54" y="72" width="22" height="46" rx="8" fill="#FFFFFF" />
        </>
      ) : (
        <>
          <rect width="320" height="170" fill="#F4EEF0" />
          <rect x="0" y="118" width="320" height="52" fill="#E3CBD2" />
          <rect x="96" y="52" width="128" height="72" rx="6" fill="#2B1B21" />
          <rect x="104" y="60" width="112" height="56" rx="3" fill="#FCE8EC" />
          <path d="M80 124h160l-12 10H92z" fill="#72606A" />
          <circle cx="262" cy="92" r="14" fill="#D9A441" />
          <rect x="116" y="72" width="60" height="6" rx="3" fill="#E48A9C" />
          <rect x="116" y="86" width="84" height="6" rx="3" fill="#F1D5DC" />
        </>
      )}
    </svg>
  )
}

export function CvIlustrado() {
  return (
    <svg
      viewBox="0 0 320 180"
      role="img"
      aria-label="Ilustración de un currículum revisado con marcas de aprobación"
      style={{ display: 'block', width: '100%', height: 180, borderRadius: 18 }}
    >
      <rect width="320" height="180" fill="#FCE8EC" />
      <rect x="92" y="18" width="136" height="162" rx="8" fill="#FFFFFF" />
      <circle cx="126" cy="54" r="18" fill="#F9C9D3" />
      <rect x="152" y="44" width="56" height="8" rx="4" fill="#2B1B21" />
      <rect x="152" y="58" width="40" height="6" rx="3" fill="#E3CBD2" />
      <rect x="108" y="88" width="104" height="6" rx="3" fill="#F1D5DC" />
      <rect x="108" y="102" width="88" height="6" rx="3" fill="#F1D5DC" />
      <rect x="108" y="124" width="104" height="6" rx="3" fill="#F1D5DC" />
      <rect x="108" y="138" width="72" height="6" rx="3" fill="#F1D5DC" />
      <circle cx="238" cy="98" r="22" fill="#C8385A" />
      <path d="M228 98l7 7 13-14" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="74" cy="138" r="16" fill="#D9A441" />
      <path d="M67 138l5 5 9-10" stroke="#FFFFFF" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

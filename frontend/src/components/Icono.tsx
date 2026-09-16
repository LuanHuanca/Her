import type { ReactElement, SVGProps } from 'react'

/** Trazos de 24×24 con línea de 1.8px; heredan el color del texto. */
const TRAZOS = {
  inicio: <path d="M3.5 10.5L12 4l8.5 6.5V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1z" />,
  retos: <path d="M12 3c.8 3.6 5 5.2 5 10a5 5 0 0 1-10 0c0-2.4 1.3-3.6 2-5 .9.9 1.4 1.9 1.5 3 1.6-1.6 2-4.6 1.5-8z" />,
  comunidad: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.5a3.5 3.5 0 0 1 0 7M18 14.3c2 .7 3.5 2.8 3.5 5.7" />
    </>
  ),
  empleos: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12.5h18" />
    </>
  ),
  perfil: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </>
  ),
  calendario: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  atras: <path d="M15 5l-7 7 7 7" />,
  adelante: <path d="M9 5l7 7-7 7" />,
  cerrar: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  corazon: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />,
  mensaje: <path d="M4 5h16v11H9l-5 4z" />,
  compartir: <path d="M12 3v12M7 8l5-5 5 5M5 14v6h14v-6" />,
  buscar: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </>
  ),
  play: <path d="M8 5v14l11-7z" />,
  pausa: (
    <>
      <rect x="6.5" y="5" width="3.5" height="14" rx="1" />
      <rect x="14" y="5" width="3.5" height="14" rx="1" />
    </>
  ),
  agregar: <path d="M12 5v14M5 12h14" />,
  trofeo: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
      <path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20.5h7M10 17h4v3.5h-4z" />
    </>
  ),
  subir: <path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" />,
  ubicacion: (
    <>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  reloj: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6.5" width="12.5" height="11" rx="2" />
      <path d="M15.5 10.5l5-3v9l-5-3z" />
    </>
  ),
  candado: (
    <>
      <rect x="5" y="11" width="14" height="9.5" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  editar: <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />,
  salir: <path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10" />,
  ajustes: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </>
  ),
  ayuda: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.7 9.5a2.4 2.4 0 1 1 3.4 2.2c-.7.4-1.1.9-1.1 1.7v.4M12 16.8v.2" />
    </>
  ),
  audifonos: (
    <>
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <rect x="3" y="14" width="4.5" height="6.5" rx="1.5" />
      <rect x="16.5" y="14" width="4.5" height="6.5" rx="1.5" />
    </>
  ),
  estrella: <path d="M12 3.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z" />,
  rayo: <path d="M13 3L5 13.5h6L10 21l8-10.5h-6z" />,
  enviar: <path d="M4 12l16-8-6 16-2.5-6.5z" />,
  imagen: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.8" />
      <path d="M21 16l-5-5-8 8" />
    </>
  ),
  archivo: <path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8zM14 3v5h5" />,
} satisfies Record<string, ReactElement>

export type NombreIcono = keyof typeof TRAZOS

type Props = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  nombre: NombreIcono
  tamano?: number
  relleno?: boolean
  /** Si se indica, el icono se anuncia a lectores de pantalla; si no, es decorativo. */
  etiqueta?: string
}

export default function Icono({ nombre, tamano = 22, relleno = false, etiqueta, ...resto }: Props) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill={relleno ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={etiqueta ? 'img' : undefined}
      aria-label={etiqueta}
      aria-hidden={etiqueta ? undefined : true}
      focusable="false"
      {...resto}
    >
      {TRAZOS[nombre]}
    </svg>
  )
}

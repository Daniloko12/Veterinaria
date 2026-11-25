interface BotonProps {
  texto: string
  onClick?: () => void
  tipo?: 'button' | 'submit' | 'reset'
  /** Variante de Bootstrap: primary, success, danger, outline-secondary, etc. */
  variante?: string
  tamano?: 'sm' | 'lg'
  deshabilitado?: boolean
  clase?: string
  etiquetaAccesible?: string
}

function Boton({
  texto,
  onClick,
  tipo = 'button',
  variante = 'primary',
  tamano,
  deshabilitado = false,
  clase = '',
  etiquetaAccesible,
}: BotonProps) {
  const clases = ['btn', `btn-${variante}`, tamano ? `btn-${tamano}` : '', clase].filter(Boolean).join(' ')

  return (
    <button type={tipo} className={clases} onClick={onClick} disabled={deshabilitado} aria-label={etiquetaAccesible}>
      {texto}
    </button>
  )
}

export default Boton

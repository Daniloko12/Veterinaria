import { Link } from 'react-router-dom'

interface BotonEnlaceProps {
  a: string
  texto: string
  variante?: string
  tamano?: 'sm' | 'lg'
  clase?: string
}

// Enlace de React Router con apariencia de boton de Bootstrap
function BotonEnlace({ a, texto, variante = 'primary', tamano, clase = '' }: BotonEnlaceProps) {
  const clases = ['btn', `btn-${variante}`, tamano ? `btn-${tamano}` : '', clase].filter(Boolean).join(' ')

  return (
    <Link to={a} className={clases}>
      {texto}
    </Link>
  )
}

export default BotonEnlace

import { formatearPrecio } from '../../utilidades/formato'
import { aplicarDescuento } from '../../utilidades/productos'

interface PrecioProps {
  precio: number
  descuento?: number
}

// Muestra el precio y, si hay oferta, el precio anterior tachado
function Precio({ precio, descuento = 0 }: PrecioProps) {
  if (descuento <= 0) {
    return <span className="fw-bold">{formatearPrecio(precio)}</span>
  }

  return (
    <span>
      <del className="text-muted me-2">{formatearPrecio(precio)}</del>
      <span className="fw-bold text-danger">{formatearPrecio(aplicarDescuento(precio, descuento))}</span>
    </span>
  )
}

export default Precio

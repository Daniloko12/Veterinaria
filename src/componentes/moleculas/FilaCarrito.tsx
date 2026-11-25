import type { ItemCarrito } from '../../tipos'
import { calcularSubtotal } from '../../utilidades/carrito'
import { formatearPrecio } from '../../utilidades/formato'

interface FilaCarritoProps {
  item: ItemCarrito
  onCambiarCantidad: (productoId: number, cantidad: number) => void
  onQuitar: (productoId: number) => void
}

function FilaCarrito({ item, onCambiarCantidad, onQuitar }: FilaCarritoProps) {
  return (
    <tr>
      <td>
        <img src={item.imagen} alt="" className="miniatura" />
      </td>
      <td>{item.nombre}</td>
      <td>{formatearPrecio(item.precio)}</td>
      <td>
        <div className="d-flex align-items-center gap-1">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => onCambiarCantidad(item.productoId, item.cantidad - 1)}
            aria-label={`Disminuir cantidad de ${item.nombre}`}
          >
            −
          </button>
          <span className="px-2" data-testid={`cantidad-${item.productoId}`}>
            {item.cantidad}
          </span>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => onCambiarCantidad(item.productoId, item.cantidad + 1)}
            aria-label={`Aumentar cantidad de ${item.nombre}`}
          >
            +
          </button>
        </div>
      </td>
      <td>{formatearPrecio(calcularSubtotal(item))}</td>
      <td>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => onQuitar(item.productoId)}
          aria-label={`Eliminar ${item.nombre}`}
        >
          Eliminar
        </button>
      </td>
    </tr>
  )
}

export default FilaCarrito

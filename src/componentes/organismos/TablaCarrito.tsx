import type { ItemCarrito } from '../../tipos'
import { calcularTotal } from '../../utilidades/carrito'
import { formatearPrecio } from '../../utilidades/formato'
import FilaCarrito from '../moleculas/FilaCarrito'

interface TablaCarritoProps {
  items: ItemCarrito[]
  onCambiarCantidad: (productoId: number, cantidad: number) => void
  onQuitar: (productoId: number) => void
}

function TablaCarrito({ items, onCambiarCantidad, onQuitar }: TablaCarritoProps) {
  if (items.length === 0) {
    return <p className="alert alert-secondary">Tu carrito está vacío.</p>
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th scope="col">Imagen</th>
            <th scope="col">Nombre</th>
            <th scope="col">Precio</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Subtotal</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <FilaCarrito
              key={item.productoId}
              item={item}
              onCambiarCantidad={onCambiarCantidad}
              onQuitar={onQuitar}
            />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={4} className="text-end">
              Total
            </th>
            <th colSpan={2} data-testid="total-carrito">
              {formatearPrecio(calcularTotal(items))}
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default TablaCarrito

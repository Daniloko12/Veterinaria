import type { ItemCarrito } from '../../tipos'
import { calcularSubtotal } from '../../utilidades/carrito'
import { formatearPrecio } from '../../utilidades/formato'

interface TablaItemsOrdenProps {
  items: ItemCarrito[]
}

// Detalle de productos de una compra (solo lectura)
function TablaItemsOrden({ items }: TablaItemsOrdenProps) {
  return (
    <div className="table-responsive">
      <table className="table table-sm align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">Imagen</th>
            <th scope="col">Nombre</th>
            <th scope="col">Precio</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.productoId}>
              <td>
                <img src={item.imagen} alt="" className="miniatura" />
              </td>
              <td>{item.nombre}</td>
              <td>{formatearPrecio(item.precio)}</td>
              <td>{item.cantidad}</td>
              <td>{formatearPrecio(calcularSubtotal(item))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablaItemsOrden

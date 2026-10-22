import type { Producto } from '../../tipos'
import Boton from '../atomos/Boton'
import BotonEnlace from '../atomos/BotonEnlace'
import Insignia from '../atomos/Insignia'
import Precio from '../atomos/Precio'

interface CardProductoProps {
  producto: Producto
  /** Nombre de la categoria (opcional) */
  categoria?: string
  /** Si se entrega, se muestra el boton para agregar al carrito */
  onAgregar?: (producto: Producto) => void
}

function CardProducto({ producto, categoria, onAgregar }: CardProductoProps) {
  const sinStock = producto.stock <= 0

  return (
    <article className="card h-100 shadow-sm card-producto">
      {producto.descuento > 0 && (
        <Insignia texto={`-${producto.descuento}%`} color="danger" clase="position-absolute top-0 start-0 m-2" />
      )}

      <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />

      <div className="card-body d-flex flex-column">
        {categoria && <small className="text-muted text-uppercase">{categoria}</small>}
        <h3 className="card-title h6">{producto.nombre}</h3>
        <p className="card-text mb-1">
          <Precio precio={producto.precio} descuento={producto.descuento} />
        </p>
        <p className="card-text small text-muted">
          {sinStock ? 'Sin stock' : `Stock disponible: ${producto.stock}`}
        </p>

        <div className="mt-auto d-grid gap-2">
          <BotonEnlace a={`/producto/${producto.id}`} texto="Ver detalle" variante="outline-primary" tamano="sm" />
          {onAgregar && (
            <Boton
              texto={sinStock ? 'Sin stock' : 'Añadir al carrito'}
              variante="success"
              tamano="sm"
              deshabilitado={sinStock}
              onClick={() => onAgregar(producto)}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export default CardProducto

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Boton from '../../componentes/atomos/Boton'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Aviso from '../../componentes/moleculas/Aviso'
import ListaProductos from '../../componentes/organismos/ListaProductos'
import TablaCarrito from '../../componentes/organismos/TablaCarrito'
import { obtenerProductos } from '../../datos/baseDatos'
import { useAgregarAlCarrito } from '../../hooks/useAgregarAlCarrito'
import { useCarrito } from '../../hooks/useCarrito'
import { formatearPrecio } from '../../utilidades/formato'

function Carrito() {
  const { items, total, cantidadTotal, cambiarCantidad, quitarProducto, vaciarCarrito } = useCarrito()
  const { aviso, agregar, cerrarAviso } = useAgregarAlCarrito()
  const [productos] = useState(() => obtenerProductos())
  const navigate = useNavigate()

  const sugeridos = productos
    .filter((producto) => producto.stock > 0 && !items.some((item) => item.productoId === producto.id))
    .slice(0, 4)

  return (
    <div className="container">
      <h1 className="h2 mb-3">Carrito de compras</h1>

      <div className="row g-4">
        <div className="col-lg-8">
          <TablaCarrito items={items} onCambiarCantidad={cambiarCantidad} onQuitar={quitarProducto} />
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5">Resumen</h2>
              <p className="d-flex justify-content-between mb-1">
                <span>Productos</span>
                <span>{cantidadTotal}</span>
              </p>
              <p className="d-flex justify-content-between fs-5">
                <span>Total</span>
                <strong>{formatearPrecio(total)}</strong>
              </p>
              <div className="d-grid gap-2">
                <Boton
                  texto="Comprar ahora"
                  variante="success"
                  deshabilitado={items.length === 0}
                  onClick={() => navigate('/checkout')}
                />
                <Boton
                  texto="Limpiar carrito"
                  variante="outline-secondary"
                  deshabilitado={items.length === 0}
                  onClick={vaciarCarrito}
                />
                <BotonEnlace a="/productos" texto="Seguir comprando" variante="link" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {sugeridos.length > 0 && (
        <section className="mt-5">
          <h2 className="h4 mb-3">También te puede interesar</h2>
          <Aviso mensaje={aviso?.mensaje} tipo={aviso?.tipo} onCerrar={cerrarAviso} />
          <ListaProductos productos={sugeridos} onAgregar={agregar} />
        </section>
      )}
    </div>
  )
}

export default Carrito

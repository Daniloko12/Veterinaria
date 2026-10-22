import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Boton from '../../componentes/atomos/Boton'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Insignia from '../../componentes/atomos/Insignia'
import Precio from '../../componentes/atomos/Precio'
import Aviso from '../../componentes/moleculas/Aviso'
import ListaProductos from '../../componentes/organismos/ListaProductos'
import { obtenerCategoriaPorId, obtenerProductoPorId, obtenerProductosPorCategoria } from '../../datos/baseDatos'
import { useAgregarAlCarrito } from '../../hooks/useAgregarAlCarrito'

interface VistaDetalleProps {
  id: number
}

function VistaDetalle({ id }: VistaDetalleProps) {
  const producto = obtenerProductoPorId(id)
  const [cantidad, setCantidad] = useState(1)
  const { aviso, agregar, cerrarAviso } = useAgregarAlCarrito()

  if (!producto) {
    return (
      <div className="container text-center py-5">
        <h1 className="h3">Producto no encontrado</h1>
        <p className="text-muted">El producto que buscas no existe o fue eliminado.</p>
        <BotonEnlace a="/productos" texto="Volver al catálogo" />
      </div>
    )
  }

  const categoria = obtenerCategoriaPorId(producto.categoriaId)
  const relacionados = obtenerProductosPorCategoria(producto.categoriaId)
    .filter((item) => item.id !== producto.id)
    .slice(0, 4)
  const sinStock = producto.stock <= 0

  return (
    <div className="container">
      <nav aria-label="Ruta de navegación">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Inicio</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/productos">Productos</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {producto.nombre}
          </li>
        </ol>
      </nav>

      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded border bg-white imagen-detalle" />
        </div>
        <div className="col-md-6">
          {categoria && <Link to={`/categorias/${categoria.id}`}>{categoria.nombre}</Link>}
          <h1 className="h2 mt-1">{producto.nombre}</h1>
          <p className="small text-muted">Código: {producto.codigo}</p>
          <p className="fs-4 mb-1">
            <Precio precio={producto.precio} descuento={producto.descuento} />
          </p>
          {producto.descuento > 0 && <Insignia texto={`Oferta -${producto.descuento}%`} color="danger" />}
          <p className="mt-3">{producto.descripcion}</p>
          <p className="small text-muted">{sinStock ? 'Sin stock' : `Stock disponible: ${producto.stock}`}</p>

          <div className="d-flex align-items-end gap-2 mb-3">
            <div>
              <label htmlFor="detalle-cantidad" className="form-label">
                Cantidad
              </label>
              <input
                id="detalle-cantidad"
                type="number"
                className="form-control"
                min={1}
                max={producto.stock}
                value={cantidad}
                disabled={sinStock}
                onChange={(evento) =>
                  setCantidad(Math.min(producto.stock, Math.max(1, Number(evento.target.value) || 1)))
                }
                style={{ width: '6rem' }}
              />
            </div>
            <Boton
              texto={sinStock ? 'Sin stock' : 'Añadir al carrito'}
              variante="success"
              deshabilitado={sinStock}
              onClick={() => agregar(producto, cantidad)}
            />
          </div>

          <Aviso mensaje={aviso?.mensaje} tipo={aviso?.tipo} onCerrar={cerrarAviso} />
          <BotonEnlace a="/productos" texto="Volver al catálogo" variante="outline-secondary" />
        </div>
      </div>

      {relacionados.length > 0 && (
        <section>
          <h2 className="h4 mb-3">Productos relacionados</h2>
          <ListaProductos productos={relacionados} onAgregar={(item) => agregar(item)} />
        </section>
      )}
    </div>
  )
}

function DetalleProducto() {
  // Obtenemos el id que viene en la URL (/producto/:id).
  // La key reinicia el estado (cantidad, aviso) al cambiar de producto.
  const { id } = useParams()
  return <VistaDetalle key={id} id={Number(id)} />
}

export default DetalleProducto

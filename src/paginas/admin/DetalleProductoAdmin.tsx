import { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { ErrorApi } from '../../api/cliente'
import { listarOrdenes } from '../../api/ordenesApi'
import { obtenerProducto } from '../../api/productosApi'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Insignia from '../../componentes/atomos/Insignia'
import Precio from '../../componentes/atomos/Precio'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import EstadoCarga from '../../componentes/moleculas/EstadoCarga'
import { useCargar } from '../../hooks/useCargar'
import { formatearPrecio } from '../../utilidades/formato'
import { esStockCritico } from '../../utilidades/productos'
import { productosMasVendidos } from '../../utilidades/reportes'

// Producto (ms-productos) + sus ventas calculadas con las órdenes (ms-ordenes)
async function cargarProducto(id: number) {
  try {
    const [producto, ordenes] = await Promise.all([obtenerProducto(id), listarOrdenes()])
    return { producto, ordenes }
  } catch (error) {
    if (error instanceof ErrorApi && error.estado === 404) return { producto: null, ordenes: [] }
    throw error
  }
}

// "Mostrar producto" del panel administrador
function DetalleProductoAdmin() {
  const { id } = useParams()
  const location = useLocation()
  const [aviso, setAviso] = useState<string | null>(
    () => (location.state as { aviso?: string } | null)?.aviso ?? null,
  )
  const { datos, cargando, error, recargar } = useCargar(() => cargarProducto(Number(id)))

  if (!datos) {
    return <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
  }

  const { producto, ordenes } = datos
  if (!producto) {
    return (
      <div>
        <p className="alert alert-warning">El producto no existe.</p>
        <BotonEnlace a="/admin/productos" texto="Volver a productos" variante="outline-secondary" />
      </div>
    )
  }

  const ventas = productosMasVendidos(ordenes, Number.MAX_SAFE_INTEGER).find(
    (venta) => venta.productoId === producto.id,
  )

  return (
    <div>
      <EncabezadoPagina
        titulo={producto.nombre}
        descripcion={`Código ${producto.codigo}`}
        acciones={
          <>
            <BotonEnlace a={`/admin/productos/${producto.id}/editar`} texto="Editar producto" />
            <BotonEnlace a="/admin/productos" texto="Volver" variante="outline-secondary" />
          </>
        }
      />

      <Aviso mensaje={aviso} onCerrar={() => setAviso(null)} />

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-4">
              <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded border" />
            </div>
            <div className="col-md-8">
              <dl className="row mb-0">
                <dt className="col-sm-4">Categoría</dt>
                <dd className="col-sm-8">{producto.categoriaNombre ?? 'Sin categoría'}</dd>
                <dt className="col-sm-4">Descripción</dt>
                <dd className="col-sm-8">{producto.descripcion || '—'}</dd>
                <dt className="col-sm-4">Precio</dt>
                <dd className="col-sm-8">
                  <Precio precio={producto.precio} descuento={producto.descuento} />
                </dd>
                <dt className="col-sm-4">Descuento</dt>
                <dd className="col-sm-8">{producto.descuento}%</dd>
                <dt className="col-sm-4">Stock</dt>
                <dd className="col-sm-8">
                  {producto.stock} unidades{' '}
                  {esStockCritico(producto) && <Insignia texto="Stock crítico" color="danger" />}
                </dd>
                <dt className="col-sm-4">Stock crítico</dt>
                <dd className="col-sm-8">{producto.stockCritico} unidades</dd>
                <dt className="col-sm-4">Unidades vendidas</dt>
                <dd className="col-sm-8">
                  {ventas ? `${ventas.unidades} (${formatearPrecio(ventas.monto)})` : 'Sin ventas registradas'}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleProductoAdmin

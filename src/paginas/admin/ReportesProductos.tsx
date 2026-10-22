import { useState } from 'react'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import { obtenerCategorias, obtenerOrdenes, obtenerProductos } from '../../datos/baseDatos'
import { formatearPrecio } from '../../utilidades/formato'
import { inventarioPorCategoria, productosMasVendidos } from '../../utilidades/reportes'

function ReportesProductos() {
  const [productos] = useState(() => obtenerProductos())
  const [categorias] = useState(() => obtenerCategorias())
  const [ordenes] = useState(() => obtenerOrdenes())

  const inventario = inventarioPorCategoria(productos, categorias)
  const valorTotal = inventario.reduce((suma, fila) => suma + fila.valor, 0)
  const masVendidos = productosMasVendidos(ordenes, 5)

  return (
    <div>
      <EncabezadoPagina
        titulo="Reportes de productos"
        descripcion={`Valor total del inventario: ${formatearPrecio(valorTotal)}`}
        acciones={<BotonEnlace a="/admin/productos" texto="Volver" variante="outline-secondary" />}
      />

      <div className="row g-4">
        <div className="col-xl-7">
          <section className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h5">Inventario por categoría</h2>
              <div className="table-responsive">
                <table className="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Categoría</th>
                      <th scope="col">Productos</th>
                      <th scope="col">Unidades</th>
                      <th scope="col">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventario.map((fila) => (
                      <tr key={fila.categoria}>
                        <td>{fila.categoria}</td>
                        <td>{fila.productos}</td>
                        <td>{fila.unidades}</td>
                        <td>{formatearPrecio(fila.valor)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        <div className="col-xl-5">
          <section className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h5">Productos más vendidos</h2>
              {masVendidos.length === 0 ? (
                <p className="text-muted mb-0">Todavía no hay ventas.</p>
              ) : (
                <ol className="list-group list-group-numbered">
                  {masVendidos.map((venta) => (
                    <li key={venta.productoId} className="list-group-item d-flex justify-content-between">
                      <span className="ms-2 me-auto">{venta.nombre}</span>
                      <span className="badge text-bg-primary rounded-pill">{venta.unidades} u.</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ReportesProductos

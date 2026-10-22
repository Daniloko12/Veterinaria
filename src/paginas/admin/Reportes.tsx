import { useState } from 'react'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import TarjetaEstadistica from '../../componentes/moleculas/TarjetaEstadistica'
import { obtenerCategorias, obtenerOrdenes, obtenerProductos } from '../../datos/baseDatos'
import { formatearPrecio } from '../../utilidades/formato'
import { productosMasVendidos, resumenVentas, ventasPorCategoria } from '../../utilidades/reportes'

function Reportes() {
  const [ordenes] = useState(() => obtenerOrdenes())
  const [productos] = useState(() => obtenerProductos())
  const [categorias] = useState(() => obtenerCategorias())

  const resumen = resumenVentas(ordenes)
  const porCategoria = ventasPorCategoria(ordenes, productos, categorias)
  const masVendidos = productosMasVendidos(ordenes, 5)
  const tasaAprobacion = ordenes.length > 0 ? Math.round((resumen.ordenesPagadas / ordenes.length) * 100) : 0

  return (
    <div>
      <EncabezadoPagina titulo="Reportes" descripcion="Resumen de ventas de la tienda" />

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <TarjetaEstadistica titulo="Total vendido" valor={formatearPrecio(resumen.totalVendido)} color="primary" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <TarjetaEstadistica
            titulo="Órdenes pagadas"
            valor={resumen.ordenesPagadas}
            detalle={`Rechazadas: ${resumen.ordenesRechazadas}`}
            color="success"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <TarjetaEstadistica titulo="Ticket promedio" valor={formatearPrecio(resumen.ticketPromedio)} color="info" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <TarjetaEstadistica
            titulo="Tasa de aprobación"
            valor={`${tasaAprobacion}%`}
            detalle={`${resumen.unidadesVendidas} unidades vendidas`}
            color="warning"
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <section className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h5">Ventas por categoría</h2>
              {porCategoria.length === 0 && <p className="text-muted">Todavía no hay ventas.</p>}
              {porCategoria.map((fila) => (
                <div key={fila.categoria} className="mb-3">
                  <div className="d-flex justify-content-between small">
                    <span>{fila.categoria}</span>
                    <span>
                      {formatearPrecio(fila.monto)} ({fila.porcentaje}%)
                    </span>
                  </div>
                  <div
                    className="progress"
                    role="progressbar"
                    aria-label={`Ventas de ${fila.categoria}`}
                    aria-valuenow={fila.porcentaje}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div className="progress-bar" style={{ width: `${fila.porcentaje}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-lg-6">
          <section className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h5">Top 5 productos</h2>
              <div className="table-responsive">
                <table className="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Producto</th>
                      <th scope="col">Unidades</th>
                      <th scope="col">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {masVendidos.map((venta) => (
                      <tr key={venta.productoId}>
                        <td>{venta.nombre}</td>
                        <td>{venta.unidades}</td>
                        <td>{formatearPrecio(venta.monto)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Reportes

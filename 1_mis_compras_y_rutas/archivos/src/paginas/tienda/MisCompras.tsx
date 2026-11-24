import { listarMisOrdenes } from '../../api/ordenesApi'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import EstadoCarga from '../../componentes/moleculas/EstadoCarga'
import InsigniaEstado from '../../componentes/moleculas/InsigniaEstado'
import { useCargar } from '../../hooks/useCargar'
import { useSesion } from '../../hooks/useSesion'
import { formatearFecha, formatearPrecio } from '../../utilidades/formato'

// GET /api/ordenes/mis-ordenes: el backend devuelve solo las compras del usuario del token
function MisCompras() {
  const { sesion } = useSesion()
  const { datos: ordenes, cargando, error, recargar } = useCargar(listarMisOrdenes)

  return (
    <div className="container">
      <h1 className="h2">Mis compras</h1>
      <p className="text-muted">Historial de compras de {sesion?.nombre} {sesion?.apellidos}.</p>

      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />

      {ordenes && ordenes.length === 0 && (
        <div className="alert alert-info">
          Todavía no tienes compras. <BotonEnlace a="/productos" texto="Ver productos" variante="link" />
        </div>
      )}

      {ordenes && ordenes.length > 0 && (
        <div className="table-responsive bg-white rounded shadow-sm">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">N° orden</th>
                <th scope="col">Fecha</th>
                <th scope="col">Productos</th>
                <th scope="col">Total</th>
                <th scope="col">Estado</th>
                <th scope="col">Boleta</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id}>
                  <td>{orden.numero}</td>
                  <td>{formatearFecha(orden.fecha)}</td>
                  <td>{orden.items.reduce((suma, item) => suma + item.cantidad, 0)}</td>
                  <td>{formatearPrecio(orden.total)}</td>
                  <td>
                    <InsigniaEstado estado={orden.estado} />
                  </td>
                  <td>
                    <BotonEnlace a={`/mis-compras/${orden.id}`} texto="Ver boleta" variante="outline-primary" tamano="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MisCompras

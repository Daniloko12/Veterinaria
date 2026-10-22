import { useState } from 'react'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Insignia from '../../componentes/atomos/Insignia'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import { obtenerOrdenes } from '../../datos/baseDatos'
import type { EstadoOrden } from '../../tipos'
import { formatearFecha, formatearPrecio } from '../../utilidades/formato'

type FiltroEstado = 'todas' | EstadoOrden

function Ordenes() {
  const [ordenes] = useState(() =>
    [...obtenerOrdenes()].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()),
  )
  const [filtro, setFiltro] = useState<FiltroEstado>('todas')

  const visibles = filtro === 'todas' ? ordenes : ordenes.filter((orden) => orden.estado === filtro)

  return (
    <div>
      <EncabezadoPagina titulo="Órdenes / Boletas" descripcion="Todas las compras realizadas en la tienda" />

      <div className="mb-3" style={{ maxWidth: '16rem' }}>
        <label htmlFor="filtro-estado" className="form-label">
          Estado
        </label>
        <select
          id="filtro-estado"
          className="form-select"
          value={filtro}
          onChange={(evento) => setFiltro(evento.target.value as FiltroEstado)}
        >
          <option value="todas">Todas</option>
          <option value="pagada">Pagadas</option>
          <option value="rechazada">Rechazadas</option>
        </select>
      </div>

      {visibles.length === 0 ? (
        <p className="alert alert-info">No hay órdenes para mostrar.</p>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">N° orden</th>
                <th scope="col">Fecha</th>
                <th scope="col">Cliente</th>
                <th scope="col">Total</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((orden) => (
                <tr key={orden.id}>
                  <td>{orden.numero}</td>
                  <td>{formatearFecha(orden.fecha)}</td>
                  <td>
                    {orden.cliente.nombre} {orden.cliente.apellidos}
                    <div className="small text-muted">{orden.cliente.correo}</div>
                  </td>
                  <td>{formatearPrecio(orden.total)}</td>
                  <td>
                    <Insignia
                      texto={orden.estado === 'pagada' ? 'Pagada' : 'Rechazada'}
                      color={orden.estado === 'pagada' ? 'success' : 'danger'}
                    />
                  </td>
                  <td>
                    <BotonEnlace a={`/admin/ordenes/${orden.id}`} texto="Ver boleta" variante="outline-primary" tamano="sm" />
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

export default Ordenes

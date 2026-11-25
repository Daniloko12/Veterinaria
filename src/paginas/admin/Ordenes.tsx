import { useState } from 'react'
import { mensajeDeError } from '../../api/cliente'
import { eliminarOrden, listarOrdenes } from '../../api/ordenesApi'
import Boton from '../../componentes/atomos/Boton'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import EstadoCarga from '../../componentes/moleculas/EstadoCarga'
import InsigniaEstado from '../../componentes/moleculas/InsigniaEstado'
import { useCargar } from '../../hooks/useCargar'
import { useSesion } from '../../hooks/useSesion'
import type { EstadoOrden, Orden } from '../../tipos'
import { formatearFecha, formatearPrecio } from '../../utilidades/formato'

type FiltroEstado = 'todas' | EstadoOrden

// GET /api/ordenes (ms-ordenes): administrador y recepcionista
function Ordenes() {
  const { esAdmin } = useSesion()
  const { datos, cargando, error, recargar } = useCargar(listarOrdenes)
  const [filtro, setFiltro] = useState<FiltroEstado>('todas')
  const [aviso, setAviso] = useState<{ tipo: string; mensaje: string } | null>(null)

  const ordenes = [...(datos ?? [])].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  const visibles = filtro === 'todas' ? ordenes : ordenes.filter((orden) => orden.estado === filtro)

  // DELETE /api/ordenes/{id}: solo administrador
  async function eliminar(orden: Orden) {
    if (!window.confirm(`¿Eliminar la orden ${orden.numero}? Esta acción no se puede deshacer.`)) {
      return
    }
    try {
      await eliminarOrden(orden.id)
      setAviso({ tipo: 'success', mensaje: `Orden ${orden.numero} eliminada` })
      recargar()
    } catch (problema) {
      setAviso({ tipo: 'danger', mensaje: mensajeDeError(problema) })
    }
  }

  return (
    <div>
      <EncabezadoPagina titulo="Órdenes / Boletas" descripcion="Todas las compras realizadas en la tienda" />

      <Aviso mensaje={aviso?.mensaje} tipo={aviso?.tipo} onCerrar={() => setAviso(null)} />

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
          <option value="enviada">Enviadas</option>
          <option value="entregada">Entregadas</option>
          <option value="rechazada">Rechazadas</option>
        </select>
      </div>

      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />

      {datos && visibles.length === 0 && <p className="alert alert-info">No hay órdenes para mostrar.</p>}

      {visibles.length > 0 && (
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
                    <InsigniaEstado estado={orden.estado} />
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      <BotonEnlace a={`/admin/ordenes/${orden.id}`} texto="Ver boleta" variante="outline-primary" tamano="sm" />
                      {esAdmin && (
                        <Boton
                          texto="Eliminar"
                          variante="outline-danger"
                          tamano="sm"
                          etiquetaAccesible={`Eliminar orden ${orden.numero}`}
                          onClick={() => eliminar(orden)}
                        />
                      )}
                    </div>
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

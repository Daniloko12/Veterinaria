import { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { ErrorApi } from '../../api/cliente'
import { listarOrdenes } from '../../api/ordenesApi'
import { obtenerUsuario } from '../../api/usuariosApi'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Insignia from '../../componentes/atomos/Insignia'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import EstadoCarga from '../../componentes/moleculas/EstadoCarga'
import InsigniaEstado from '../../componentes/moleculas/InsigniaEstado'
import { useCargar } from '../../hooks/useCargar'
import { formatearFecha, formatearPrecio } from '../../utilidades/formato'
import { estaPagada } from '../../utilidades/ordenes'

// Usuario (ms-usuarios) + su historial: órdenes con su id o su correo (ms-ordenes)
async function cargarUsuario(id: number) {
  try {
    const [usuario, ordenes] = await Promise.all([obtenerUsuario(id), listarOrdenes()])
    const correo = usuario.correo.toLowerCase()
    const historial = ordenes.filter(
      (orden) => orden.usuarioId === usuario.id || orden.cliente.correo.toLowerCase() === correo,
    )
    return { usuario, historial }
  } catch (error) {
    if (error instanceof ErrorApi && error.estado === 404) return { usuario: null, historial: [] }
    throw error
  }
}

// "Mostrar usuario" + historial de compras
function DetalleUsuario() {
  const { id } = useParams()
  const location = useLocation()
  const [aviso, setAviso] = useState<string | null>(
    () => (location.state as { aviso?: string } | null)?.aviso ?? null,
  )
  const { datos, cargando, error, recargar } = useCargar(() => cargarUsuario(Number(id)))

  if (!datos) {
    return <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
  }

  const { usuario, historial } = datos
  if (!usuario) {
    return (
      <div>
        <p className="alert alert-warning">El usuario no existe.</p>
        <BotonEnlace a="/admin/usuarios" texto="Volver a usuarios" variante="outline-secondary" />
      </div>
    )
  }

  const totalGastado = historial
    .filter(estaPagada)
    .reduce((suma, orden) => suma + orden.total, 0)

  return (
    <div>
      <EncabezadoPagina
        titulo={`${usuario.nombre} ${usuario.apellidos}`}
        descripcion={usuario.correo}
        acciones={
          <>
            <BotonEnlace a={`/admin/usuarios/${usuario.id}/editar`} texto="Editar usuario" />
            <BotonEnlace a="/admin/usuarios" texto="Volver" variante="outline-secondary" />
          </>
        }
      />

      <Aviso mensaje={aviso} onCerrar={() => setAviso(null)} />

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <dl className="row mb-0">
            <dt className="col-sm-3">RUN</dt>
            <dd className="col-sm-9">{usuario.run}</dd>
            <dt className="col-sm-3">Rol</dt>
            <dd className="col-sm-9 text-capitalize">{usuario.rol}</dd>
            <dt className="col-sm-3">Estado</dt>
            <dd className="col-sm-9">
              <Insignia texto={usuario.activo ? 'Activo' : 'Desactivado'} color={usuario.activo ? 'success' : 'secondary'} />
            </dd>
            <dt className="col-sm-3">Fecha de nacimiento</dt>
            <dd className="col-sm-9">{usuario.fechaNacimiento || '—'}</dd>
            <dt className="col-sm-3">Dirección</dt>
            <dd className="col-sm-9">
              {usuario.direccion}, {usuario.comuna}, {usuario.region}
            </dd>
          </dl>
        </div>
      </div>

      <section>
        <h2 className="h5">Historial de compras</h2>
        {historial.length === 0 ? (
          <p className="alert alert-info">Este usuario todavía no tiene compras.</p>
        ) : (
          <>
            <p className="text-muted">Total gastado: {formatearPrecio(totalGastado)}</p>
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
                  {historial.map((orden) => (
                    <tr key={orden.id}>
                      <td>{orden.numero}</td>
                      <td>{formatearFecha(orden.fecha)}</td>
                      <td>{orden.items.reduce((suma, item) => suma + item.cantidad, 0)}</td>
                      <td>{formatearPrecio(orden.total)}</td>
                      <td>
                        <InsigniaEstado estado={orden.estado} />
                      </td>
                      <td>
                        <BotonEnlace a={`/admin/ordenes/${orden.id}`} texto="Ver" variante="outline-primary" tamano="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default DetalleUsuario

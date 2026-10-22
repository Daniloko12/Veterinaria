import { useParams } from 'react-router-dom'
import Boton from '../../componentes/atomos/Boton'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Insignia from '../../componentes/atomos/Insignia'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import BoletaOrden from '../../componentes/organismos/BoletaOrden'
import { obtenerOrdenPorId } from '../../datos/baseDatos'

// "Mostrar boleta" del panel administrador
function DetalleOrden() {
  const { id } = useParams()
  const orden = obtenerOrdenPorId(Number(id))

  if (!orden) {
    return (
      <div>
        <p className="alert alert-warning">La orden no existe.</p>
        <BotonEnlace a="/admin/ordenes" texto="Volver a órdenes" variante="outline-secondary" />
      </div>
    )
  }

  return (
    <div>
      <EncabezadoPagina
        titulo={`Boleta ${orden.numero}`}
        acciones={
          <>
            <Boton texto="Imprimir boleta" variante="outline-dark" onClick={() => window.print()} />
            <BotonEnlace a="/admin/ordenes" texto="Volver" variante="outline-secondary" />
          </>
        }
      />

      <div className="card shadow-sm">
        <div className="card-body">
          <p>
            Estado:{' '}
            <Insignia
              texto={orden.estado === 'pagada' ? 'Pagada' : 'Rechazada'}
              color={orden.estado === 'pagada' ? 'success' : 'danger'}
            />
            {orden.motivoRechazo && <span className="ms-2 text-danger small">{orden.motivoRechazo}</span>}
          </p>
          <BoletaOrden orden={orden} titulo={orden.estado === 'pagada' ? 'Boleta electrónica' : 'Detalle del pedido (no pagado)'} />
        </div>
      </div>
    </div>
  )
}

export default DetalleOrden

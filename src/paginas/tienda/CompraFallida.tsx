import { useParams } from 'react-router-dom'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import BoletaOrden from '../../componentes/organismos/BoletaOrden'
import { leerUltimaOrden } from '../../datos/almacenamiento'

function CompraFallida() {
  const { id } = useParams()
  // La orden recién creada la guarda el checkout (sirve también para compras sin cuenta)
  const orden = leerUltimaOrden(Number(id))

  if (!orden || orden.estado !== 'rechazada') {
    return (
      <div className="container text-center py-5">
        <h1 className="h3">Orden no encontrada</h1>
        <BotonEnlace a="/" texto="Volver al inicio" />
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card shadow-sm mx-auto contenedor-angosto">
        <div className="card-body p-4">
          <h1 className="h4 text-danger">✕ No se pudo realizar el pago. nro #{orden.numero}</h1>
          <p className="text-muted">Motivo: {orden.motivoRechazo}</p>
          <p className="small">Tus productos siguen en el carrito. Puedes intentarlo nuevamente.</p>

          <div className="text-center mb-4">
            <BotonEnlace a="/checkout" texto="Volver a realizar el pago" variante="success" />
          </div>

          <BoletaOrden orden={orden} titulo="Detalle del pedido (no pagado)" />
        </div>
      </div>
    </div>
  )
}

export default CompraFallida

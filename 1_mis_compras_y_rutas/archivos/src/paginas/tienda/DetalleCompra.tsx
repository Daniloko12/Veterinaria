import { useParams } from 'react-router-dom'
import { obtenerOrden } from '../../api/ordenesApi'
import Boton from '../../componentes/atomos/Boton'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import EstadoCarga from '../../componentes/moleculas/EstadoCarga'
import InsigniaEstado from '../../componentes/moleculas/InsigniaEstado'
import BoletaOrden from '../../componentes/organismos/BoletaOrden'
import { useCargar } from '../../hooks/useCargar'
import { estaPagada } from '../../utilidades/ordenes'

interface VistaCompraProps {
  id: number
}

// GET /api/ordenes/{id}: si la orden es de otro cliente, el backend responde 403
function VistaCompra({ id }: VistaCompraProps) {
  const { datos: orden, cargando, error, recargar } = useCargar(() => obtenerOrden(id))

  return (
    <div className="container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 no-imprimir">
        <h1 className="h3 mb-0">Detalle de la compra</h1>
        <div className="d-flex gap-2">
          {orden && <Boton texto="Imprimir boleta" variante="outline-dark" onClick={() => window.print()} />}
          <BotonEnlace a="/mis-compras" texto="Volver" variante="outline-secondary" />
        </div>
      </div>

      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />

      {orden && (
        <div className="card shadow-sm">
          <div className="card-body">
            <p className="no-imprimir">
              Estado: <InsigniaEstado estado={orden.estado} />
            </p>
            <BoletaOrden orden={orden} titulo={estaPagada(orden) ? 'Boleta electrónica' : 'Detalle del pedido (no pagado)'} />
          </div>
        </div>
      )}
    </div>
  )
}

function DetalleCompra() {
  const { id } = useParams()
  return <VistaCompra key={id} id={Number(id)} />
}

export default DetalleCompra

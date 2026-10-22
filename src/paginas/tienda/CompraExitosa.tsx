import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Boton from '../../componentes/atomos/Boton'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Aviso from '../../componentes/moleculas/Aviso'
import BoletaOrden from '../../componentes/organismos/BoletaOrden'
import { obtenerOrdenPorId } from '../../datos/baseDatos'

function CompraExitosa() {
  const { id } = useParams()
  const orden = obtenerOrdenPorId(Number(id))
  const [mensaje, setMensaje] = useState('')

  if (!orden || orden.estado !== 'pagada') {
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
          <div className="no-imprimir">
            <h1 className="h4 text-success">✓ Pago aprobado. Compra nro #{orden.numero}</h1>
            <p className="small text-muted">Gracias por tu compra. Esta es tu boleta, puedes imprimirla o guardarla.</p>
          </div>

          <BoletaOrden orden={orden} />

          <div className="no-imprimir">
            <Aviso mensaje={mensaje} tipo="info" onCerrar={() => setMensaje('')} />

            <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
              {/* Abre el diálogo de impresión; ahí también se puede elegir "Guardar como PDF" */}
              <Boton texto="Imprimir boleta" variante="danger" onClick={() => window.print()} />
              <Boton
                texto="Enviar boleta por email"
                variante="success"
                onClick={() => setMensaje(`La boleta fue enviada a ${orden.cliente.correo} (simulado).`)}
              />
              <BotonEnlace a="/productos" texto="Seguir comprando" variante="outline-primary" />
            </div>
            <p className="small text-muted text-center mt-2 mb-0">
              Para guardarla en PDF, elige “Guardar como PDF” en la ventana de impresión.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompraExitosa

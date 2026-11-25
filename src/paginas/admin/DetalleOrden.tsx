import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorApi, mensajeDeError } from '../../api/cliente'
import { cambiarEstadoOrden, obtenerOrden } from '../../api/ordenesApi'
import Boton from '../../componentes/atomos/Boton'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import EstadoCarga from '../../componentes/moleculas/EstadoCarga'
import InsigniaEstado from '../../componentes/moleculas/InsigniaEstado'
import BoletaOrden from '../../componentes/organismos/BoletaOrden'
import { useCargar } from '../../hooks/useCargar'
import { ESTADOS_ORDEN, estaPagada, siguienteEstado } from '../../utilidades/ordenes'

async function cargarOrden(id: number) {
  try {
    return await obtenerOrden(id)
  } catch (error) {
    if (error instanceof ErrorApi && error.estado === 404) return null
    throw error
  }
}

interface VistaOrdenProps {
  id: number
}

// "Mostrar boleta" del panel: GET /api/ordenes/{id} y cambio de estado del despacho
function VistaOrden({ id }: VistaOrdenProps) {
  const { datos: orden, cargando, error, recargar } = useCargar(() => cargarOrden(id))
  const [aviso, setAviso] = useState<{ tipo: string; mensaje: string } | null>(null)
  const [guardando, setGuardando] = useState(false)

  if (cargando || error) {
    return <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
  }

  if (!orden) {
    return (
      <div>
        <p className="alert alert-warning">La orden no existe.</p>
        <BotonEnlace a="/admin/ordenes" texto="Volver a órdenes" variante="outline-secondary" />
      </div>
    )
  }

  const siguiente = siguienteEstado(orden.estado)

  // PUT /api/ordenes/{id}/estado
  async function avanzarEstado() {
    if (!orden || !siguiente) return
    setGuardando(true)
    try {
      await cambiarEstadoOrden(orden.id, siguiente)
      setAviso({ tipo: 'success', mensaje: `La orden quedó como "${ESTADOS_ORDEN[siguiente].texto}"` })
      recargar()
    } catch (problema) {
      setAviso({ tipo: 'danger', mensaje: mensajeDeError(problema) })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div>
      <EncabezadoPagina
        titulo={`Boleta ${orden.numero}`}
        acciones={
          <>
            {siguiente && (
              <Boton
                texto={guardando ? 'Guardando…' : `Marcar como ${ESTADOS_ORDEN[siguiente].texto.toLowerCase()}`}
                variante="success"
                deshabilitado={guardando}
                onClick={avanzarEstado}
              />
            )}
            <Boton texto="Imprimir boleta" variante="outline-dark" onClick={() => window.print()} />
            <BotonEnlace a="/admin/ordenes" texto="Volver" variante="outline-secondary" />
          </>
        }
      />

      <Aviso mensaje={aviso?.mensaje} tipo={aviso?.tipo} onCerrar={() => setAviso(null)} />

      <div className="card shadow-sm">
        <div className="card-body">
          <p>
            Estado: <InsigniaEstado estado={orden.estado} />
            {orden.motivoRechazo && <span className="ms-2 text-danger small">{orden.motivoRechazo}</span>}
          </p>
          <BoletaOrden orden={orden} titulo={estaPagada(orden) ? 'Boleta electrónica' : 'Detalle del pedido (no pagado)'} />
        </div>
      </div>
    </div>
  )
}

function DetalleOrden() {
  const { id } = useParams()
  return <VistaOrden key={id} id={Number(id)} />
}

export default DetalleOrden

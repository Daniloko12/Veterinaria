import type { EstadoOrden } from '../../tipos'
import { ESTADOS_ORDEN } from '../../utilidades/ordenes'
import Insignia from '../atomos/Insignia'

interface InsigniaEstadoProps {
  estado: EstadoOrden
}

// Muestra el estado de una orden con su color (Pagada, Enviada, Entregada o Rechazada)
function InsigniaEstado({ estado }: InsigniaEstadoProps) {
  const { texto, color } = ESTADOS_ORDEN[estado] ?? { texto: estado, color: 'secondary' }
  return <Insignia texto={texto} color={color} />
}

export default InsigniaEstado

import type { EstadoOrden, Orden } from '../tipos'

export const ESTADOS_ORDEN: Record<EstadoOrden, { texto: string; color: string }> = {
  pagada: { texto: 'Pagada', color: 'success' },
  enviada: { texto: 'Enviada', color: 'info' },
  entregada: { texto: 'Entregada', color: 'primary' },
  rechazada: { texto: 'Rechazada', color: 'danger' },
}

/** Pagada, enviada y entregada cuentan como venta; rechazada no */
export function estaPagada(orden: Pick<Orden, 'estado'>): boolean {
  return orden.estado !== 'rechazada'
}

/** Siguiente paso del despacho: pagada → enviada → entregada */
export function siguienteEstado(estado: EstadoOrden): EstadoOrden | null {
  if (estado === 'pagada') return 'enviada'
  if (estado === 'enviada') return 'entregada'
  return null
}

/** Formatea un numero como precio chileno. Ej: 15990 -> "$15.990" */
export function formatearPrecio(valor: number): string {
  const entero = Math.round(valor)
  const signo = entero < 0 ? '-' : ''
  const conPuntos = Math.abs(entero)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${signo}$${conPuntos}`
}

/** Formatea una fecha ISO como dd-mm-aaaa */
export function formatearFecha(fechaIso: string): string {
  const fecha = new Date(fechaIso)
  if (Number.isNaN(fecha.getTime())) {
    return fechaIso
  }
  const dia = String(fecha.getDate()).padStart(2, '0')
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  return `${dia}-${mes}-${fecha.getFullYear()}`
}

/** Formatea una fecha ISO como dd-mm-aaaa hh:mm */
export function formatearFechaHora(fechaIso: string): string {
  const fecha = new Date(fechaIso)
  if (Number.isNaN(fecha.getTime())) {
    return fechaIso
  }
  const hora = String(fecha.getHours()).padStart(2, '0')
  const minutos = String(fecha.getMinutes()).padStart(2, '0')
  return `${formatearFecha(fechaIso)} ${hora}:${minutos}`
}

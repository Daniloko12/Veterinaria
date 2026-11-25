// Funciones del pago simulado con tarjeta

/** Número que el "banco" simulado siempre rechaza (sirve para mostrar el pago con error) */
const TARJETAS_RECHAZADAS = ['4000000000000002']

export const TASA_IVA = 0.19

export function soloDigitos(texto: string): string {
  return texto.replace(/\D/g, '')
}

/** "4242424242424242" -> "4242 4242 4242 4242" (mientras el usuario escribe) */
export function formatearNumeroTarjeta(texto: string): string {
  return soloDigitos(texto)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
}

/** "1230" -> "12/30" (mientras el usuario escribe) */
export function formatearVencimiento(texto: string): string {
  const digitos = soloDigitos(texto).slice(0, 4)
  return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos
}

/** Reconoce la marca por los primeros dígitos */
export function detectarMarca(numero: string): string {
  const digitos = soloDigitos(numero)
  if (/^4/.test(digitos)) return 'Visa'
  if (/^(5[1-5]|2[2-7])/.test(digitos)) return 'Mastercard'
  if (/^3[47]/.test(digitos)) return 'American Express'
  return 'Tarjeta'
}

export function ultimosCuatro(numero: string): string {
  return soloDigitos(numero).slice(-4)
}

export function tarjetaRechazada(numero: string): boolean {
  return TARJETAS_RECHAZADAS.includes(soloDigitos(numero))
}

/** Código de autorización de 6 dígitos que entrega el "banco" simulado */
export function generarCodigoAutorizacion(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

/** Los precios incluyen IVA: separa el monto neto y el IVA (19%) */
export function calcularIva(total: number): { neto: number; iva: number } {
  const neto = Math.round(total / (1 + TASA_IVA))
  return { neto, iva: total - neto }
}

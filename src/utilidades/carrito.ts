import type { ItemCarrito } from '../tipos'

export function calcularSubtotal(item: ItemCarrito): number {
  return item.precio * item.cantidad
}

export function calcularTotal(items: ItemCarrito[]): number {
  return items.reduce((total, item) => total + calcularSubtotal(item), 0)
}

export function contarUnidades(items: ItemCarrito[]): number {
  return items.reduce((total, item) => total + item.cantidad, 0)
}

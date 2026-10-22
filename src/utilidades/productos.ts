import type { Producto } from '../tipos'

export type OrdenProductos = 'relevancia' | 'precio-asc' | 'precio-desc' | 'nombre'

export interface FiltrosProductos {
  texto: string
  /** 0 = todas las categorias */
  categoriaId: number
  soloOfertas: boolean
  orden: OrdenProductos
}

export const filtrosVacios: FiltrosProductos = {
  texto: '',
  categoriaId: 0,
  soloOfertas: false,
  orden: 'relevancia',
}

/** Aplica un porcentaje de descuento a un precio */
export function aplicarDescuento(precio: number, descuento: number): number {
  if (descuento <= 0) {
    return precio
  }
  return Math.round((precio * (100 - descuento)) / 100)
}

/** Precio que realmente paga el cliente (considera la oferta) */
export function precioFinal(producto: Producto): number {
  return aplicarDescuento(producto.precio, producto.descuento)
}

export function esStockCritico(producto: Producto): boolean {
  return producto.stock <= producto.stockCritico
}

/** Quita tildes y pasa a minusculas para comparar textos */
export function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

/** Filtra y ordena productos segun los filtros de busqueda */
export function filtrarProductos(productos: Producto[], filtros: FiltrosProductos): Producto[] {
  const texto = normalizarTexto(filtros.texto)

  const filtrados = productos.filter((producto) => {
    const coincideTexto =
      texto === '' ||
      normalizarTexto(producto.nombre).includes(texto) ||
      normalizarTexto(producto.descripcion).includes(texto) ||
      normalizarTexto(producto.codigo).includes(texto)
    const coincideCategoria = filtros.categoriaId === 0 || producto.categoriaId === filtros.categoriaId
    const coincideOferta = !filtros.soloOfertas || producto.descuento > 0
    return coincideTexto && coincideCategoria && coincideOferta
  })

  switch (filtros.orden) {
    case 'precio-asc':
      return [...filtrados].sort((a, b) => precioFinal(a) - precioFinal(b))
    case 'precio-desc':
      return [...filtrados].sort((a, b) => precioFinal(b) - precioFinal(a))
    case 'nombre':
      return [...filtrados].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
    default:
      return filtrados
  }
}

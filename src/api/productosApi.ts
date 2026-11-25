// Microservicio ms-productos (puerto 8082, se llama a través del gateway): catálogo de productos y categorías
import type { Categoria, Producto } from '../tipos'
import { pedir } from './cliente'
import { URL_PRODUCTOS } from './config'

const PRODUCTOS = `${URL_PRODUCTOS}/api/productos`
const CATEGORIAS = `${URL_PRODUCTOS}/api/categorias`

export type DatosProducto = Omit<Producto, 'id' | 'categoriaNombre'>
export type DatosCategoria = Pick<Categoria, 'nombre' | 'descripcion' | 'imagen'>

// ---------- Productos (leer es público) ----------

export function listarProductos() {
  return pedir<Producto[]>(PRODUCTOS)
}

export function listarProductosDeCategoria(categoriaId: number) {
  return pedir<Producto[]>(`${PRODUCTOS}?categoriaId=${categoriaId}`)
}

/** Productos con descuento, de mayor a menor descuento */
export async function listarOfertas() {
  const ofertas = await pedir<Producto[]>(`${PRODUCTOS}?ofertas=true`)
  return [...ofertas].sort((a, b) => b.descuento - a.descuento)
}

export function obtenerProducto(id: number) {
  return pedir<Producto>(`${PRODUCTOS}/${id}`)
}

/** Stock igual o menor al stock crítico (administrador y recepcionista) */
export function listarProductosCriticos() {
  return pedir<Producto[]>(`${PRODUCTOS}/criticos`, { conToken: true })
}

// ---------- Productos (escritura: solo administrador) ----------

export function crearProducto(datos: DatosProducto) {
  return pedir<Producto>(PRODUCTOS, { metodo: 'POST', cuerpo: soloDatosProducto(datos), conToken: true })
}

export function actualizarProducto(id: number, datos: DatosProducto) {
  return pedir<Producto>(`${PRODUCTOS}/${id}`, { metodo: 'PUT', cuerpo: soloDatosProducto(datos), conToken: true })
}

/** Reponer stock (administrador y recepcionista) */
export function actualizarStock(id: number, stock: number) {
  return pedir<Producto>(`${PRODUCTOS}/${id}/stock`, { metodo: 'PATCH', cuerpo: { stock }, conToken: true })
}

export function eliminarProducto(id: number) {
  return pedir<void>(`${PRODUCTOS}/${id}`, { metodo: 'DELETE', conToken: true })
}

// ---------- Categorías ----------

export function listarCategorias() {
  return pedir<Categoria[]>(CATEGORIAS)
}

export function obtenerCategoria(id: number) {
  return pedir<Categoria>(`${CATEGORIAS}/${id}`)
}

export function crearCategoria(datos: DatosCategoria) {
  return pedir<Categoria>(CATEGORIAS, { metodo: 'POST', cuerpo: datos, conToken: true })
}

export function actualizarCategoria(id: number, datos: DatosCategoria) {
  return pedir<Categoria>(`${CATEGORIAS}/${id}`, { metodo: 'PUT', cuerpo: datos, conToken: true })
}

export function eliminarCategoria(id: number) {
  return pedir<void>(`${CATEGORIAS}/${id}`, { metodo: 'DELETE', conToken: true })
}

function soloDatosProducto(datos: DatosProducto): DatosProducto {
  const { codigo, nombre, descripcion, precio, descuento, stock, stockCritico, categoriaId, imagen } = datos
  return { codigo, nombre, descripcion, precio, descuento, stock, stockCritico, categoriaId, imagen }
}

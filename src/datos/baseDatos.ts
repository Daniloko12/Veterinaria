// Base de datos simulada con persistencia en localStorage.
// Expone funciones CRUD (Crear, Leer, Actualizar, Eliminar) para cada entidad.

import type {
  Categoria,
  DatosCliente,
  DatosTarjeta,
  DireccionEntrega,
  EstadoOrden,
  ItemCarrito,
  Novedad,
  Orden,
  Producto,
  Sesion,
  Usuario,
} from '../tipos'
import { calcularTotal } from '../utilidades/carrito'
import { detectarMarca, generarCodigoAutorizacion, tarjetaRechazada, ultimosCuatro } from '../utilidades/pago'
import {
  categoriasIniciales,
  novedadesIniciales,
  ordenesIniciales,
  productosIniciales,
  usuariosIniciales,
} from './datosIniciales'

export const CLAVES = {
  productos: 'vsm_productos',
  categorias: 'vsm_categorias',
  usuarios: 'vsm_usuarios',
  novedades: 'vsm_novedades',
  ordenes: 'vsm_ordenes',
  carrito: 'vsm_carrito',
  sesion: 'vsm_sesion',
} as const

// ---------- Funciones base de persistencia ----------

function copiar<T>(valor: T): T {
  return JSON.parse(JSON.stringify(valor)) as T
}

/** Lee una clave de localStorage. Si no existe, guarda y devuelve el valor inicial. */
function leer<T>(clave: string, valorInicial: T): T {
  const texto = localStorage.getItem(clave)
  if (texto === null) {
    localStorage.setItem(clave, JSON.stringify(valorInicial))
    return copiar(valorInicial)
  }
  try {
    return JSON.parse(texto) as T
  } catch {
    localStorage.setItem(clave, JSON.stringify(valorInicial))
    return copiar(valorInicial)
  }
}

function guardar<T>(clave: string, valor: T): void {
  localStorage.setItem(clave, JSON.stringify(valor))
}

function siguienteId(lista: { id: number }[]): number {
  return lista.reduce((maximo, item) => Math.max(maximo, item.id), 0) + 1
}

/** Borra todo lo guardado y vuelve a los datos iniciales */
export function reiniciarDatos(): void {
  Object.values(CLAVES).forEach((clave) => localStorage.removeItem(clave))
}

// ---------- Productos ----------

export function obtenerProductos(): Producto[] {
  return leer(CLAVES.productos, productosIniciales)
}

export function obtenerProductoPorId(id: number): Producto | undefined {
  return obtenerProductos().find((producto) => producto.id === id)
}

export function obtenerProductosPorCategoria(categoriaId: number): Producto[] {
  return obtenerProductos().filter((producto) => producto.categoriaId === categoriaId)
}

export function obtenerProductosEnOferta(): Producto[] {
  return obtenerProductos()
    .filter((producto) => producto.descuento > 0)
    .sort((a, b) => b.descuento - a.descuento)
}

export function obtenerProductosCriticos(): Producto[] {
  return obtenerProductos().filter((producto) => producto.stock <= producto.stockCritico)
}

export function existeCodigoProducto(codigo: string, idExcluir?: number): boolean {
  const buscado = codigo.trim().toUpperCase()
  return obtenerProductos().some(
    (producto) => producto.codigo.toUpperCase() === buscado && producto.id !== idExcluir,
  )
}

export function crearProducto(datos: Omit<Producto, 'id'>): Producto {
  const productos = obtenerProductos()
  const nuevo: Producto = { ...datos, id: siguienteId(productos) }
  guardar(CLAVES.productos, [...productos, nuevo])
  return nuevo
}

export function actualizarProducto(id: number, cambios: Partial<Omit<Producto, 'id'>>): Producto | null {
  const productos = obtenerProductos()
  const indice = productos.findIndex((producto) => producto.id === id)
  if (indice === -1) {
    return null
  }
  const actualizado: Producto = { ...productos[indice], ...cambios, id }
  productos[indice] = actualizado
  guardar(CLAVES.productos, productos)
  return actualizado
}

export function eliminarProducto(id: number): boolean {
  const productos = obtenerProductos()
  const restantes = productos.filter((producto) => producto.id !== id)
  if (restantes.length === productos.length) {
    return false
  }
  guardar(CLAVES.productos, restantes)
  return true
}

// ---------- Categorias ----------

export function obtenerCategorias(): Categoria[] {
  return leer(CLAVES.categorias, categoriasIniciales)
}

export function obtenerCategoriaPorId(id: number): Categoria | undefined {
  return obtenerCategorias().find((categoria) => categoria.id === id)
}

export function crearCategoria(datos: Omit<Categoria, 'id'>): Categoria {
  const categorias = obtenerCategorias()
  const nueva: Categoria = { ...datos, id: siguienteId(categorias) }
  guardar(CLAVES.categorias, [...categorias, nueva])
  return nueva
}

export function actualizarCategoria(id: number, cambios: Partial<Omit<Categoria, 'id'>>): Categoria | null {
  const categorias = obtenerCategorias()
  const indice = categorias.findIndex((categoria) => categoria.id === id)
  if (indice === -1) {
    return null
  }
  const actualizada: Categoria = { ...categorias[indice], ...cambios, id }
  categorias[indice] = actualizada
  guardar(CLAVES.categorias, categorias)
  return actualizada
}

/** No permite eliminar una categoria que todavia tiene productos asociados */
export function eliminarCategoria(id: number): boolean {
  if (obtenerProductosPorCategoria(id).length > 0) {
    return false
  }
  const categorias = obtenerCategorias()
  const restantes = categorias.filter((categoria) => categoria.id !== id)
  if (restantes.length === categorias.length) {
    return false
  }
  guardar(CLAVES.categorias, restantes)
  return true
}

// ---------- Usuarios ----------

export function obtenerUsuarios(): Usuario[] {
  return leer(CLAVES.usuarios, usuariosIniciales)
}

export function obtenerUsuarioPorId(id: number): Usuario | undefined {
  return obtenerUsuarios().find((usuario) => usuario.id === id)
}

export function existeRun(run: string, idExcluir?: number): boolean {
  const buscado = run.trim().toUpperCase()
  return obtenerUsuarios().some((usuario) => usuario.run.toUpperCase() === buscado && usuario.id !== idExcluir)
}

export function existeCorreo(correo: string, idExcluir?: number): boolean {
  const buscado = correo.trim().toLowerCase()
  return obtenerUsuarios().some(
    (usuario) => usuario.correo.toLowerCase() === buscado && usuario.id !== idExcluir,
  )
}

export function crearUsuario(datos: Omit<Usuario, 'id'>): Usuario {
  const usuarios = obtenerUsuarios()
  const nuevo: Usuario = { ...datos, id: siguienteId(usuarios) }
  guardar(CLAVES.usuarios, [...usuarios, nuevo])
  return nuevo
}

export function actualizarUsuario(id: number, cambios: Partial<Omit<Usuario, 'id'>>): Usuario | null {
  const usuarios = obtenerUsuarios()
  const indice = usuarios.findIndex((usuario) => usuario.id === id)
  if (indice === -1) {
    return null
  }
  const actualizado: Usuario = { ...usuarios[indice], ...cambios, id }
  usuarios[indice] = actualizado
  guardar(CLAVES.usuarios, usuarios)
  return actualizado
}

export function eliminarUsuario(id: number): boolean {
  const usuarios = obtenerUsuarios()
  const restantes = usuarios.filter((usuario) => usuario.id !== id)
  if (restantes.length === usuarios.length) {
    return false
  }
  guardar(CLAVES.usuarios, restantes)
  return true
}

/** Devuelve el usuario si el correo y la clave coinciden y la cuenta esta activa */
export function autenticarUsuario(correo: string, clave: string): Usuario | null {
  const buscado = correo.trim().toLowerCase()
  const usuario = obtenerUsuarios().find(
    (item) => item.correo.toLowerCase() === buscado && item.clave === clave && item.activo,
  )
  return usuario ?? null
}

// ---------- Novedades (blog) ----------

export function obtenerNovedades(): Novedad[] {
  return leer(CLAVES.novedades, novedadesIniciales)
}

export function obtenerNovedadPorId(id: number): Novedad | undefined {
  return obtenerNovedades().find((novedad) => novedad.id === id)
}

// ---------- Ordenes / boletas ----------

export function obtenerOrdenes(): Orden[] {
  return leer(CLAVES.ordenes, ordenesIniciales)
}

export function obtenerOrdenPorId(id: number): Orden | undefined {
  return obtenerOrdenes().find((orden) => orden.id === id)
}

/** Historial de compras de un usuario (por id o por correo si compro como invitado) */
export function obtenerOrdenesDeUsuario(usuario: Pick<Usuario, 'id' | 'correo'>): Orden[] {
  const correo = usuario.correo.toLowerCase()
  return obtenerOrdenes().filter(
    (orden) => orden.usuarioId === usuario.id || orden.cliente.correo.toLowerCase() === correo,
  )
}

export function crearOrden(datos: Omit<Orden, 'id' | 'numero'>): Orden {
  const ordenes = obtenerOrdenes()
  const id = siguienteId(ordenes)
  const nueva: Orden = { ...datos, id, numero: `ORD-${String(id).padStart(5, '0')}` }
  guardar(CLAVES.ordenes, [...ordenes, nueva])
  return nueva
}

export interface DatosCompra {
  cliente: DatosCliente
  direccion: DireccionEntrega
  items: ItemCarrito[]
  usuarioId: number | null
  /** Tarjeta con la que se paga (solo se guardan la marca y los últimos 4 dígitos) */
  tarjeta: DatosTarjeta
}

/**
 * Procesa el pago simulado con tarjeta: valida stock, consulta al "banco"
 * (tarjetas de prueba), descuenta inventario si el pago es aprobado y
 * siempre registra la orden (pagada o rechazada).
 */
export function procesarCompra(datos: DatosCompra): Orden {
  const productos = obtenerProductos()

  const sinStock = datos.items.find((item) => {
    const producto = productos.find((p) => p.id === item.productoId)
    return !producto || producto.stock < item.cantidad
  })

  let estado: EstadoOrden = 'pagada'
  let motivoRechazo = ''

  if (datos.items.length === 0) {
    estado = 'rechazada'
    motivoRechazo = 'El carrito está vacío'
  } else if (sinStock) {
    estado = 'rechazada'
    motivoRechazo = `No hay stock suficiente de ${sinStock.nombre}`
  } else if (tarjetaRechazada(datos.tarjeta.numero)) {
    estado = 'rechazada'
    motivoRechazo = 'La tarjeta fue rechazada por el banco emisor'
  }

  if (estado === 'pagada') {
    const actualizados = productos.map((producto) => {
      const item = datos.items.find((i) => i.productoId === producto.id)
      return item ? { ...producto, stock: producto.stock - item.cantidad } : producto
    })
    guardar(CLAVES.productos, actualizados)
  }

  return crearOrden({
    fecha: new Date().toISOString(),
    cliente: datos.cliente,
    direccion: datos.direccion,
    items: datos.items,
    total: calcularTotal(datos.items),
    estado,
    motivoRechazo,
    usuarioId: datos.usuarioId,
    // Por seguridad nunca se guarda el número completo ni el CVV
    pago: {
      marca: detectarMarca(datos.tarjeta.numero),
      ultimos4: ultimosCuatro(datos.tarjeta.numero),
      titular: datos.tarjeta.titular.trim().toUpperCase(),
      codigoAutorizacion: estado === 'pagada' ? generarCodigoAutorizacion() : '',
    },
  })
}

// ---------- Carrito ----------

export function obtenerCarrito(): ItemCarrito[] {
  return leer<ItemCarrito[]>(CLAVES.carrito, [])
}

export function guardarCarrito(items: ItemCarrito[]): void {
  guardar(CLAVES.carrito, items)
}

// ---------- Sesion ----------

export function obtenerSesion(): Sesion | null {
  return leer<Sesion | null>(CLAVES.sesion, null)
}

export function guardarSesion(sesion: Sesion): void {
  guardar(CLAVES.sesion, sesion)
}

export function eliminarSesion(): void {
  localStorage.removeItem(CLAVES.sesion)
}

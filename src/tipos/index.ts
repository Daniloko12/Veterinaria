// Tipos compartidos por toda la aplicacion (modelo de datos)

export type Rol = 'administrador' | 'recepcionista' | 'cliente'

export interface Categoria {
  id: number
  nombre: string
  descripcion: string
  imagen: string
}

export interface Producto {
  id: number
  codigo: string
  nombre: string
  descripcion: string
  precio: number
  /** Porcentaje de descuento (0 = sin oferta) */
  descuento: number
  stock: number
  stockCritico: number
  categoriaId: number
  imagen: string
}

export interface Novedad {
  id: number
  titulo: string
  resumen: string
  contenido: string[]
  imagen: string
  fecha: string
  autor: string
}

export interface Usuario {
  id: number
  run: string
  nombre: string
  apellidos: string
  correo: string
  clave: string
  fechaNacimiento: string
  rol: Rol
  region: string
  comuna: string
  direccion: string
  activo: boolean
}

/** Datos minimos del usuario que se guardan al iniciar sesion */
export interface Sesion {
  id: number
  nombre: string
  apellidos: string
  correo: string
  rol: Rol
}

export interface ItemCarrito {
  productoId: number
  nombre: string
  /** Precio unitario final (ya con descuento) */
  precio: number
  cantidad: number
  imagen: string
}

export interface DatosCliente {
  nombre: string
  apellidos: string
  correo: string
}

export interface DireccionEntrega {
  calle: string
  departamento: string
  region: string
  comuna: string
  indicaciones: string
}

/** Datos que el cliente escribe en el formulario de pago (nunca se guardan completos) */
export interface DatosTarjeta {
  numero: string
  titular: string
  vencimiento: string
  cvv: string
}

/** Datos del pago que sí se guardan en la orden (sin número completo ni CVV) */
export interface PagoTarjeta {
  marca: string
  ultimos4: string
  titular: string
  /** Código entregado por el "banco" cuando el pago se aprueba ('' si fue rechazado) */
  codigoAutorizacion: string
}

export type EstadoOrden = 'pagada' | 'rechazada'

export interface Orden {
  id: number
  numero: string
  fecha: string
  cliente: DatosCliente
  direccion: DireccionEntrega
  items: ItemCarrito[]
  total: number
  estado: EstadoOrden
  motivoRechazo: string
  usuarioId: number | null
  pago: PagoTarjeta | null
}

export interface Region {
  nombre: string
  comunas: string[]
}

/** Mapa de errores de un formulario: un mensaje por campo */
export type Errores<T> = Partial<Record<keyof T, string>>

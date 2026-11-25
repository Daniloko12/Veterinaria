import type { DatosTarjeta, Errores } from '../tipos'
import { soloDigitos } from './pago'

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validarCorreo(correo: string): boolean {
  return REGEX_CORREO.test(correo.trim())
}

/** Valida un RUN chileno sin puntos ni guion (ej: 123456785 o 12345678K) */
export function validarRun(run: string): boolean {
  const limpio = run.trim().toUpperCase()

  if (!/^\d{7,8}[0-9K]$/.test(limpio)) {
    return false
  }

  const cuerpo = limpio.slice(0, -1)
  const dvIngresado = limpio.slice(-1)

  let suma = 0
  let multiplicador = 2

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }

  const resultado = 11 - (suma % 11)
  let dvCalculado = String(resultado)
  if (resultado === 11) dvCalculado = '0'
  if (resultado === 10) dvCalculado = 'K'

  return dvCalculado === dvIngresado
}

export function validarClave(clave: string): boolean {
  return clave.length >= 4 && clave.length <= 10
}

/** Devuelve true si el objeto de errores tiene al menos un mensaje */
export function tieneErrores<T>(errores: Errores<T>): boolean {
  return Object.values(errores).some(Boolean)
}

// ---------- Validaciones reutilizables por campo ----------

/**
 * Valida un texto obligatorio con largo maximo.
 * `terminacion` ajusta la concordancia: "El nombre es obligatorio",
 * "La calle es obligatoria", "Los apellidos son obligatorios".
 */
function errorTextoObligatorio(
  valor: string,
  campo: string,
  maximo: number,
  terminacion: 'o' | 'a' | 'os' = 'o',
): string | undefined {
  const plural = terminacion === 'os'
  if (valor.trim() === '') return `${campo} ${plural ? 'son' : 'es'} obligatori${terminacion}`
  if (valor.trim().length > maximo) return `${campo} no ${plural ? 'pueden' : 'puede'} superar ${maximo} caracteres`
  return undefined
}

function errorCorreo(correo: string): string | undefined {
  if (correo.trim() === '') return 'El correo es obligatorio'
  if (correo.trim().length > 100) return 'El correo no puede superar 100 caracteres'
  if (!validarCorreo(correo)) return 'Ingrese un correo válido'
  return undefined
}

function errorRun(run: string): string | undefined {
  if (run.trim() === '') return 'El RUN es obligatorio'
  if (/[.-]/.test(run)) return 'Ingrese el RUN sin puntos ni guion'
  if (!validarRun(run)) return 'El RUN no es válido'
  return undefined
}

function errorClave(clave: string): string | undefined {
  if (clave === '') return 'La contraseña es obligatoria'
  if (!validarClave(clave)) return 'La contraseña debe tener entre 4 y 10 caracteres'
  return undefined
}

/** Elimina las claves sin mensaje para que el objeto quede limpio */
function limpiar<T>(errores: Record<keyof T, string | undefined>): Errores<T> {
  const resultado: Errores<T> = {}
  for (const clave of Object.keys(errores) as (keyof T)[]) {
    const mensaje = errores[clave]
    if (mensaje) resultado[clave] = mensaje
  }
  return resultado
}

// ---------- Formularios ----------

export interface DatosLogin {
  correo: string
  clave: string
}

export function validarLogin(datos: DatosLogin): Errores<DatosLogin> {
  return limpiar<DatosLogin>({
    correo: errorCorreo(datos.correo),
    clave: errorClave(datos.clave),
  })
}

export interface DatosContacto {
  nombre: string
  correo: string
  comentario: string
}

export function validarContacto(datos: DatosContacto): Errores<DatosContacto> {
  return limpiar<DatosContacto>({
    nombre: errorTextoObligatorio(datos.nombre, 'El nombre', 100),
    correo: errorCorreo(datos.correo),
    comentario: errorTextoObligatorio(datos.comentario, 'El comentario', 500),
  })
}

export interface DatosRegistro {
  run: string
  nombre: string
  apellidos: string
  correo: string
  clave: string
  confirmarClave: string
  fechaNacimiento: string
  region: string
  comuna: string
  direccion: string
}

export function validarRegistro(datos: DatosRegistro): Errores<DatosRegistro> {
  let confirmar: string | undefined
  if (datos.confirmarClave === '') confirmar = 'Confirme la contraseña'
  else if (datos.confirmarClave !== datos.clave) confirmar = 'Las contraseñas no coinciden'

  return limpiar<DatosRegistro>({
    run: errorRun(datos.run),
    nombre: errorTextoObligatorio(datos.nombre, 'El nombre', 50),
    apellidos: errorTextoObligatorio(datos.apellidos, 'Los apellidos', 100, 'os'),
    correo: errorCorreo(datos.correo),
    clave: errorClave(datos.clave),
    confirmarClave: confirmar,
    fechaNacimiento: undefined,
    region: datos.region === '' ? 'Seleccione una región' : undefined,
    comuna: datos.comuna === '' ? 'Seleccione una comuna' : undefined,
    direccion: errorTextoObligatorio(datos.direccion, 'La dirección', 300, 'a'),
  })
}

export interface DatosCheckout {
  nombre: string
  apellidos: string
  correo: string
  calle: string
  departamento: string
  region: string
  comuna: string
  indicaciones: string
}

export function validarCheckout(datos: DatosCheckout): Errores<DatosCheckout> {
  return limpiar<DatosCheckout>({
    nombre: errorTextoObligatorio(datos.nombre, 'El nombre', 50),
    apellidos: errorTextoObligatorio(datos.apellidos, 'Los apellidos', 100, 'os'),
    correo: errorCorreo(datos.correo),
    calle: errorTextoObligatorio(datos.calle, 'La calle', 150, 'a'),
    departamento: datos.departamento.length > 50 ? 'Máximo 50 caracteres' : undefined,
    region: datos.region === '' ? 'Seleccione una región' : undefined,
    comuna: datos.comuna === '' ? 'Seleccione una comuna' : undefined,
    indicaciones: datos.indicaciones.length > 300 ? 'Máximo 300 caracteres' : undefined,
  })
}

/** Valores del formulario de producto (los inputs siempre entregan texto) */
export interface DatosProductoFormulario {
  codigo: string
  nombre: string
  descripcion: string
  precio: string
  descuento: string
  stock: string
  stockCritico: string
  categoriaId: string
  imagen: string
}

function errorEntero(valor: string, campo: string, minimo: number, maximo?: number): string | undefined {
  if (valor.trim() === '') return `${campo} es obligatorio`
  const numero = Number(valor)
  if (!Number.isInteger(numero)) return `${campo} debe ser un número entero`
  if (numero < minimo) return `${campo} debe ser mayor o igual a ${minimo}`
  if (maximo !== undefined && numero > maximo) return `${campo} no puede ser mayor a ${maximo}`
  return undefined
}

export function validarProducto(datos: DatosProductoFormulario): Errores<DatosProductoFormulario> {
  return limpiar<DatosProductoFormulario>({
    codigo: errorTextoObligatorio(datos.codigo, 'El código', 20),
    nombre: errorTextoObligatorio(datos.nombre, 'El nombre', 100),
    descripcion: datos.descripcion.length > 300 ? 'La descripción no puede superar 300 caracteres' : undefined,
    precio: errorEntero(datos.precio, 'El precio', 1),
    descuento: errorEntero(datos.descuento, 'El descuento', 0, 90),
    stock: errorEntero(datos.stock, 'El stock', 0),
    stockCritico: errorEntero(datos.stockCritico, 'El stock crítico', 0),
    categoriaId: datos.categoriaId === '' ? 'Seleccione una categoría' : undefined,
    imagen: datos.imagen === '' ? 'Seleccione una imagen' : undefined,
  })
}

export interface DatosCategoriaFormulario {
  nombre: string
  descripcion: string
  imagen: string
}

export function validarCategoria(datos: DatosCategoriaFormulario): Errores<DatosCategoriaFormulario> {
  return limpiar<DatosCategoriaFormulario>({
    nombre: errorTextoObligatorio(datos.nombre, 'El nombre', 50),
    descripcion: errorTextoObligatorio(datos.descripcion, 'La descripción', 200, 'a'),
    imagen: datos.imagen === '' ? 'Seleccione una imagen' : undefined,
  })
}

export interface DatosUsuarioFormulario {
  run: string
  nombre: string
  apellidos: string
  correo: string
  clave: string
  fechaNacimiento: string
  rol: string
  region: string
  comuna: string
  direccion: string
  activo: string
}

/**
 * Valida el formulario de usuario del administrador.
 * Si `claveOpcional` es true (edicion) la contraseña vacia significa "mantener la actual".
 */
export function validarUsuario(
  datos: DatosUsuarioFormulario,
  claveOpcional = false,
): Errores<DatosUsuarioFormulario> {
  const claveError = claveOpcional && datos.clave === '' ? undefined : errorClave(datos.clave)

  return limpiar<DatosUsuarioFormulario>({
    run: errorRun(datos.run),
    nombre: errorTextoObligatorio(datos.nombre, 'El nombre', 50),
    apellidos: errorTextoObligatorio(datos.apellidos, 'Los apellidos', 100, 'os'),
    correo: errorCorreo(datos.correo),
    clave: claveError,
    fechaNacimiento: undefined,
    rol: datos.rol === '' ? 'Seleccione un rol' : undefined,
    region: datos.region === '' ? 'Seleccione una región' : undefined,
    comuna: datos.comuna === '' ? 'Seleccione una comuna' : undefined,
    direccion: errorTextoObligatorio(datos.direccion, 'La dirección', 300, 'a'),
    activo: undefined,
  })
}

/**
 * Valida la tarjeta del checkout: que ningún campo esté vacío
 * y que cada uno tenga la cantidad de caracteres correcta.
 */
export function validarTarjeta(datos: DatosTarjeta): Errores<DatosTarjeta> {
  const digitos = soloDigitos(datos.numero)

  let numero: string | undefined
  if (digitos === '') numero = 'El número de tarjeta es obligatorio'
  else if (digitos.length !== 16) numero = 'El número de tarjeta debe tener 16 dígitos'

  let vencimiento: string | undefined
  if (datos.vencimiento === '') vencimiento = 'La fecha de vencimiento es obligatoria'
  else if (!/^\d{2}\/\d{2}$/.test(datos.vencimiento)) vencimiento = 'Use el formato MM/AA'

  let cvv: string | undefined
  if (datos.cvv === '') cvv = 'El CVV es obligatorio'
  else if (!/^\d{3}$/.test(datos.cvv)) cvv = 'El CVV debe tener 3 dígitos'

  return limpiar<DatosTarjeta>({
    numero,
    titular: errorTextoObligatorio(datos.titular, 'El nombre del titular', 60),
    vencimiento,
    cvv,
  })
}

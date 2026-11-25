// Los artículos del blog son contenido fijo del sitio (no se administran desde el backend)
import type { Novedad } from '../tipos'
import { novedadesIniciales } from './datosIniciales'

export function obtenerNovedades(): Novedad[] {
  return novedadesIniciales
}

export function obtenerNovedadPorId(id: number): Novedad | undefined {
  return novedadesIniciales.find((novedad) => novedad.id === id)
}

import { useContext } from 'react'
import { CarritoContexto, type ValorCarrito } from '../contexto/CarritoContexto'

export function useCarrito(): ValorCarrito {
  const contexto = useContext(CarritoContexto)
  if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de <CarritoProvider>')
  }
  return contexto
}

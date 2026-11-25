import { useContext } from 'react'
import { SesionContexto, type ValorSesion } from '../contexto/SesionContexto'

export function useSesion(): ValorSesion {
  const contexto = useContext(SesionContexto)
  if (!contexto) {
    throw new Error('useSesion debe usarse dentro de <SesionProvider>')
  }
  return contexto
}

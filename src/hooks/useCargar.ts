import { useCallback, useEffect, useState } from 'react'
import { mensajeDeError } from '../api/cliente'

interface EstadoCarga<T> {
  datos: T | null
  cargando: boolean
  error: string
}

/**
 * Carga datos desde la API cuando se monta el componente.
 * Devuelve los datos, si está cargando, el mensaje de error y una función para recargar.
 */
export function useCargar<T>(cargar: () => Promise<T>) {
  const [estado, setEstado] = useState<EstadoCarga<T>>({ datos: null, cargando: true, error: '' })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let vigente = true
    cargar()
      .then((datos) => {
        if (vigente) setEstado({ datos, cargando: false, error: '' })
      })
      .catch((error: unknown) => {
        if (vigente) setEstado({ datos: null, cargando: false, error: mensajeDeError(error) })
      })
    return () => {
      vigente = false
    }
    // Solo se vuelve a cargar al llamar a recargar(); para otra URL se usa una key en el componente
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version])

  // Si ya hay datos en pantalla se mantienen mientras llegan los nuevos (sin parpadeo)
  const recargar = useCallback(() => {
    setEstado((actual) => (actual.datos ? actual : { ...actual, cargando: true, error: '' }))
    setVersion((actual) => actual + 1)
  }, [])

  return { ...estado, recargar }
}

import AreaTexto from '../atomos/AreaTexto'
import Input from '../atomos/Input'
import MensajeError from '../atomos/MensajeError'

interface CampoFormularioProps {
  id: string
  etiqueta: string
  valor: string // Recibe el valor del campo
  alCambiar: (valor: string) => void // Recibe la función que actualiza el valor
  tipo?: string
  placeholder?: string
  error?: string
  maxLength?: number
  multilinea?: boolean
  requerido?: boolean
  deshabilitado?: boolean
  ayuda?: string
  min?: number
  max?: number
  autoComplete?: string
}

// Molécula: etiqueta + Input (o AreaTexto) + MensajeError
function CampoFormulario({
  id,
  etiqueta,
  valor,
  alCambiar,
  tipo = 'text',
  placeholder,
  error,
  maxLength,
  multilinea = false,
  requerido = false,
  deshabilitado = false,
  ayuda,
  min,
  max,
  autoComplete,
}: CampoFormularioProps) {
  const idError = `${id}-error`
  const invalido = Boolean(error)

  return (
    <div className="mb-3">
      <label htmlFor={id} className={`form-label ${requerido ? 'requerido' : ''}`.trim()}>
        {etiqueta}
      </label>

      {multilinea ? (
        <AreaTexto
          id={id}
          valor={valor}
          alCambiar={alCambiar}
          placeholder={placeholder}
          maxLength={maxLength}
          deshabilitado={deshabilitado}
          invalido={invalido}
          idDescripcion={invalido ? idError : undefined}
        />
      ) : (
        <Input
          id={id}
          tipo={tipo}
          valor={valor}
          alCambiar={alCambiar}
          placeholder={placeholder}
          maxLength={maxLength}
          min={min}
          max={max}
          autoComplete={autoComplete}
          deshabilitado={deshabilitado}
          invalido={invalido}
          idDescripcion={invalido ? idError : undefined}
        />
      )}

      {ayuda && !error && <div className="form-text">{ayuda}</div>}
      <MensajeError id={idError} mensaje={error} />
    </div>
  )
}

export default CampoFormulario

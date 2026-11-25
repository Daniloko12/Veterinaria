import MensajeError from '../atomos/MensajeError'
import Select, { type OpcionSelect } from '../atomos/Select'

interface CampoSelectProps {
  id: string
  etiqueta: string
  valor: string
  alCambiar: (valor: string) => void
  opciones: OpcionSelect[]
  /** Texto de la primera opción vacía. Si no se indica, no se agrega. */
  textoVacio?: string
  error?: string
  requerido?: boolean
  deshabilitado?: boolean
}

// Molécula: etiqueta + Select + MensajeError
function CampoSelect({
  id,
  etiqueta,
  valor,
  alCambiar,
  opciones,
  textoVacio,
  error,
  requerido = false,
  deshabilitado = false,
}: CampoSelectProps) {
  const idError = `${id}-error`
  const invalido = Boolean(error)

  return (
    <div className="mb-3">
      <label htmlFor={id} className={`form-label ${requerido ? 'requerido' : ''}`.trim()}>
        {etiqueta}
      </label>
      <Select
        id={id}
        valor={valor}
        alCambiar={alCambiar}
        opciones={opciones}
        textoVacio={textoVacio}
        deshabilitado={deshabilitado}
        invalido={invalido}
        idDescripcion={invalido ? idError : undefined}
      />
      <MensajeError id={idError} mensaje={error} />
    </div>
  )
}

export default CampoSelect

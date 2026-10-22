interface InputProps {
  id: string
  tipo: string
  nombre?: string
  valor: string // Valor actual del campo
  alCambiar: (valor: string) => void // Función para actualizar el valor
  placeholder?: string
  maxLength?: number
  min?: number
  max?: number
  autoComplete?: string
  deshabilitado?: boolean
  /** Marca el campo en rojo cuando tiene un error */
  invalido?: boolean
  /** id del mensaje de error asociado (accesibilidad) */
  idDescripcion?: string
}

function Input({
  id,
  tipo,
  nombre,
  valor,
  alCambiar,
  placeholder,
  maxLength,
  min,
  max,
  autoComplete,
  deshabilitado = false,
  invalido = false,
  idDescripcion,
}: InputProps) {
  return (
    <input
      id={id}
      type={tipo}
      name={nombre ?? id}
      className={`form-control ${invalido ? 'is-invalid' : ''}`.trim()}
      // Muestra el valor guardado
      value={valor}
      // Detecta cuando el usuario escribe
      onChange={(evento) => alCambiar(evento.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      min={min}
      max={max}
      autoComplete={autoComplete}
      disabled={deshabilitado}
      aria-invalid={invalido}
      aria-describedby={idDescripcion}
    />
  )
}

export default Input

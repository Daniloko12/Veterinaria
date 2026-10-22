interface AreaTextoProps {
  id: string
  nombre?: string
  valor: string
  alCambiar: (valor: string) => void
  placeholder?: string
  maxLength?: number
  filas?: number
  deshabilitado?: boolean
  invalido?: boolean
  idDescripcion?: string
}

// Campo de texto de varias líneas (textarea)
function AreaTexto({
  id,
  nombre,
  valor,
  alCambiar,
  placeholder,
  maxLength,
  filas = 3,
  deshabilitado = false,
  invalido = false,
  idDescripcion,
}: AreaTextoProps) {
  return (
    <textarea
      id={id}
      name={nombre ?? id}
      className={`form-control ${invalido ? 'is-invalid' : ''}`.trim()}
      value={valor}
      onChange={(evento) => alCambiar(evento.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      rows={filas}
      disabled={deshabilitado}
      aria-invalid={invalido}
      aria-describedby={idDescripcion}
    />
  )
}

export default AreaTexto

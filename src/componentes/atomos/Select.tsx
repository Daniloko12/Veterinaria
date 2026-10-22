export interface OpcionSelect {
  valor: string
  texto: string
}

interface SelectProps {
  id: string
  nombre?: string
  valor: string
  alCambiar: (valor: string) => void
  opciones: OpcionSelect[]
  /** Texto de la primera opción vacía. Si no se indica, no se agrega. */
  textoVacio?: string
  deshabilitado?: boolean
  invalido?: boolean
  idDescripcion?: string
}

// Lista desplegable con las opciones recibidas por props
function Select({
  id,
  nombre,
  valor,
  alCambiar,
  opciones,
  textoVacio,
  deshabilitado = false,
  invalido = false,
  idDescripcion,
}: SelectProps) {
  return (
    <select
      id={id}
      name={nombre ?? id}
      className={`form-select ${invalido ? 'is-invalid' : ''}`.trim()}
      value={valor}
      onChange={(evento) => alCambiar(evento.target.value)}
      disabled={deshabilitado}
      aria-invalid={invalido}
      aria-describedby={idDescripcion}
    >
      {textoVacio !== undefined && <option value="">{textoVacio}</option>}
      {opciones.map((opcion) => (
        <option key={opcion.valor} value={opcion.valor}>
          {opcion.texto}
        </option>
      ))}
    </select>
  )
}

export default Select

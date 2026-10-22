interface MensajeErrorProps {
  mensaje?: string
  id?: string
}

// Solo se muestra cuando existe un mensaje de error
function MensajeError({ mensaje, id }: MensajeErrorProps) {
  if (!mensaje) {
    return null
  }

  return (
    <div id={id} className="invalid-feedback d-block" role="alert">
      {mensaje}
    </div>
  )
}

export default MensajeError

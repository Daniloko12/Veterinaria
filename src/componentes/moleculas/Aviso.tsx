interface AvisoProps {
  mensaje?: string | null
  /** success, danger, warning, info */
  tipo?: string
  onCerrar?: () => void
}

// Alerta de Bootstrap que solo aparece cuando hay un mensaje
function Aviso({ mensaje, tipo = 'success', onCerrar }: AvisoProps) {
  if (!mensaje) {
    return null
  }

  return (
    <div className={`alert alert-${tipo} d-flex justify-content-between align-items-center`} role="status">
      <span>{mensaje}</span>
      {onCerrar && <button type="button" className="btn-close" aria-label="Cerrar aviso" onClick={onCerrar} />}
    </div>
  )
}

export default Aviso

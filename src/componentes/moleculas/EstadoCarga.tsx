interface EstadoCargaProps {
  cargando: boolean
  error?: string
  onReintentar?: () => void
}

// Muestra "Cargando…" mientras responde la API, o el error con un botón para reintentar
function EstadoCarga({ cargando, error, onReintentar }: EstadoCargaProps) {
  if (cargando) {
    return (
      <div className="text-center py-5" role="status">
        <div className="spinner-border text-primary" aria-hidden="true" />
        <p className="text-muted mt-2 mb-0">Cargando…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex justify-content-between align-items-center gap-2" role="alert">
        <span>{error}</span>
        {onReintentar && (
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={onReintentar}>
            Reintentar
          </button>
        )}
      </div>
    )
  }

  return null
}

export default EstadoCarga

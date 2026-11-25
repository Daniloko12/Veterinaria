interface TarjetaEstadisticaProps {
  titulo: string
  valor: string | number
  detalle?: string
  /** Color de Bootstrap para el fondo */
  color?: string
}

// Tarjeta de metrica para el dashboard del administrador
function TarjetaEstadistica({ titulo, valor, detalle, color = 'primary' }: TarjetaEstadisticaProps) {
  return (
    <div className={`card text-bg-${color} h-100 shadow-sm`}>
      <div className="card-body">
        <h2 className="h6 card-title mb-1">{titulo}</h2>
        <p className="display-6 fw-semibold mb-1">{valor}</p>
        {detalle && <p className="small mb-0 opacity-75">{detalle}</p>}
      </div>
    </div>
  )
}

export default TarjetaEstadistica

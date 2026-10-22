import { detectarMarca, soloDigitos } from '../../utilidades/pago'

interface TarjetaVisualProps {
  numero: string
  titular: string
  vencimiento: string
}

// Dibujo de la tarjeta que se actualiza mientras el cliente escribe
function TarjetaVisual({ numero, titular, vencimiento }: TarjetaVisualProps) {
  const marca = detectarMarca(numero)
  // Completa con puntos los dígitos que faltan y separa en grupos de 4
  const numeroMostrado = soloDigitos(numero)
    .slice(0, 16)
    .padEnd(16, '•')
    .replace(/(.{4})(?=.)/g, '$1 ')

  return (
    <div className="tarjeta-visual text-white rounded-4 p-3 shadow" aria-hidden="true">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <span className="tarjeta-chip" aria-hidden="true" />
        <span className="fw-bold" data-testid="marca-tarjeta">
          {marca}
        </span>
      </div>
      <p className="fs-5 font-monospace mb-3" data-testid="numero-tarjeta">
        {numeroMostrado}
      </p>
      <div className="d-flex justify-content-between small text-uppercase">
        <span data-testid="titular-tarjeta">{titular.trim() || 'Nombre del titular'}</span>
        <span>{vencimiento || 'MM/AA'}</span>
      </div>
    </div>
  )
}

export default TarjetaVisual

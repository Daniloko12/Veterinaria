import type { DatosTarjeta, Errores } from '../../tipos'
import { formatearNumeroTarjeta, formatearVencimiento, soloDigitos } from '../../utilidades/pago'
import CampoFormulario from '../moleculas/CampoFormulario'
import TarjetaVisual from '../moleculas/TarjetaVisual'

interface CamposTarjetaProps {
  tarjeta: DatosTarjeta
  errores: Errores<DatosTarjeta>
  alCambiar: (campo: keyof DatosTarjeta, valor: string) => void
}

// Sección "Pago con tarjeta" del checkout: campos + vista previa de la tarjeta
function CamposTarjeta({ tarjeta, errores, alCambiar }: CamposTarjetaProps) {
  return (
    <fieldset>
      <legend className="h5">Pago con tarjeta</legend>
      <p className="small text-muted">Pago simulado: no se realiza ningún cobro real.</p>

      <div className="row g-4 align-items-start">
        <div className="col-md-7">
          <CampoFormulario
            id="tarjeta-numero"
            etiqueta="Número de tarjeta"
            valor={tarjeta.numero}
            // Se formatea en grupos de 4 mientras se escribe
            alCambiar={(valor) => alCambiar('numero', formatearNumeroTarjeta(valor))}
            error={errores.numero}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            autoComplete="cc-number"
            requerido
          />
          <CampoFormulario
            id="tarjeta-titular"
            etiqueta="Nombre del titular"
            valor={tarjeta.titular}
            alCambiar={(valor) => alCambiar('titular', valor)}
            error={errores.titular}
            placeholder="Como aparece en la tarjeta"
            maxLength={60}
            autoComplete="cc-name"
            requerido
          />
          <div className="row">
            <div className="col-6">
              <CampoFormulario
                id="tarjeta-vencimiento"
                etiqueta="Vencimiento"
                valor={tarjeta.vencimiento}
                alCambiar={(valor) => alCambiar('vencimiento', formatearVencimiento(valor))}
                error={errores.vencimiento}
                placeholder="MM/AA"
                maxLength={5}
                autoComplete="cc-exp"
                requerido
              />
            </div>
            <div className="col-6">
              <CampoFormulario
                id="tarjeta-cvv"
                etiqueta="CVV"
                tipo="password"
                valor={tarjeta.cvv}
                alCambiar={(valor) => alCambiar('cvv', soloDigitos(valor).slice(0, 3))}
                error={errores.cvv}
                placeholder="123"
                maxLength={3}
                autoComplete="cc-csc"
                requerido
              />
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <TarjetaVisual numero={tarjeta.numero} titular={tarjeta.titular} vencimiento={tarjeta.vencimiento} />
        </div>
      </div>
    </fieldset>
  )
}

export default CamposTarjeta

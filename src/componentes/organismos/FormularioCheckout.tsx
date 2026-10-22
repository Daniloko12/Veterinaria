import { useState, type FormEvent } from 'react'
import type { DatosTarjeta, Errores } from '../../tipos'
import { formatearPrecio } from '../../utilidades/formato'
import { tieneErrores, validarCheckout, validarTarjeta, type DatosCheckout } from '../../utilidades/validaciones'
import Boton from '../atomos/Boton'
import CampoFormulario from '../moleculas/CampoFormulario'
import SelectorRegionComuna from '../moleculas/SelectorRegionComuna'
import CamposTarjeta from './CamposTarjeta'

interface FormularioCheckoutProps {
  valoresIniciales: DatosCheckout
  total: number
  /** true mientras el "banco" procesa el pago */
  procesando?: boolean
  onConfirmar: (datos: DatosCheckout, tarjeta: DatosTarjeta) => void
}

const tarjetaVacia: DatosTarjeta = { numero: '', titular: '', vencimiento: '', cvv: '' }

function FormularioCheckout({ valoresIniciales, total, procesando = false, onConfirmar }: FormularioCheckoutProps) {
  const [datos, setDatos] = useState<DatosCheckout>(valoresIniciales)
  const [errores, setErrores] = useState<Errores<DatosCheckout>>({})
  const [tarjeta, setTarjeta] = useState<DatosTarjeta>(tarjetaVacia)
  const [erroresTarjeta, setErroresTarjeta] = useState<Errores<DatosTarjeta>>({})

  function actualizar(campo: keyof DatosCheckout, valor: string) {
    setDatos((actuales) => ({ ...actuales, [campo]: valor }))
  }

  function actualizarTarjeta(campo: keyof DatosTarjeta, valor: string) {
    setTarjeta((actual) => ({ ...actual, [campo]: valor }))
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const nuevosErrores = validarCheckout(datos)
    const nuevosErroresTarjeta = validarTarjeta(tarjeta)
    setErrores(nuevosErrores)
    setErroresTarjeta(nuevosErroresTarjeta)
    if (!tieneErrores(nuevosErrores) && !tieneErrores(nuevosErroresTarjeta)) {
      onConfirmar(datos, tarjeta)
    }
  }

  return (
    <form onSubmit={enviar} noValidate>
      <h2 className="h5">Información del cliente</h2>
      <p className="small text-muted">Completa la siguiente información</p>
      <div className="row">
        <div className="col-md-6">
          <CampoFormulario
            id="checkout-nombre"
            etiqueta="Nombre"
            valor={datos.nombre}
            alCambiar={(valor) => actualizar('nombre', valor)}
            error={errores.nombre}
            maxLength={50}
            requerido
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="checkout-apellidos"
            etiqueta="Apellidos"
            valor={datos.apellidos}
            alCambiar={(valor) => actualizar('apellidos', valor)}
            error={errores.apellidos}
            maxLength={100}
            requerido
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="checkout-correo"
            etiqueta="Correo"
            tipo="email"
            valor={datos.correo}
            alCambiar={(valor) => actualizar('correo', valor)}
            error={errores.correo}
            maxLength={100}
            requerido
          />
        </div>
      </div>

      <h2 className="h5 mt-2">Dirección de entrega de los productos</h2>
      <p className="small text-muted">Ingrese la dirección de forma detallada</p>
      <div className="row">
        <div className="col-md-6">
          <CampoFormulario
            id="checkout-calle"
            etiqueta="Calle"
            valor={datos.calle}
            alCambiar={(valor) => actualizar('calle', valor)}
            error={errores.calle}
            maxLength={150}
            requerido
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="checkout-departamento"
            etiqueta="Departamento (opcional)"
            valor={datos.departamento}
            alCambiar={(valor) => actualizar('departamento', valor)}
            error={errores.departamento}
            placeholder="Ej: 603"
            maxLength={50}
          />
        </div>
      </div>

      <SelectorRegionComuna
        prefijoId="checkout-"
        region={datos.region}
        comuna={datos.comuna}
        alCambiarRegion={(valor) => actualizar('region', valor)}
        alCambiarComuna={(valor) => actualizar('comuna', valor)}
        errorRegion={errores.region}
        errorComuna={errores.comuna}
      />

      <CampoFormulario
        id="checkout-indicaciones"
        etiqueta="Indicaciones para la entrega (opcional)"
        valor={datos.indicaciones}
        alCambiar={(valor) => actualizar('indicaciones', valor)}
        error={errores.indicaciones}
        placeholder="Ej: Entre calles, color del edificio, no tiene timbre."
        maxLength={300}
        multilinea
      />

      <hr />
      <CamposTarjeta tarjeta={tarjeta} errores={erroresTarjeta} alCambiar={actualizarTarjeta} />

      <div className="text-end mt-3">
        <Boton
          texto={procesando ? 'Procesando pago…' : `Pagar ahora ${formatearPrecio(total)}`}
          tipo="submit"
          variante="success"
          tamano="lg"
          deshabilitado={procesando}
        />
      </div>
    </form>
  )
}

export default FormularioCheckout

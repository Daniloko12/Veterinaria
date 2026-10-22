import { useState, type FormEvent } from 'react'
import type { Errores } from '../../tipos'
import { tieneErrores, validarLogin, type DatosLogin } from '../../utilidades/validaciones'
import Boton from '../atomos/Boton'
import MensajeError from '../atomos/MensajeError'
import CampoFormulario from '../moleculas/CampoFormulario'

interface FormularioLoginProps {
  onIngresar: (datos: DatosLogin) => void
  /** Error general (por ejemplo: credenciales incorrectas) */
  errorGeneral?: string
}

function FormularioLogin({ onIngresar, errorGeneral }: FormularioLoginProps) {
  const [datos, setDatos] = useState<DatosLogin>({ correo: '', clave: '' })
  const [errores, setErrores] = useState<Errores<DatosLogin>>({})

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const nuevosErrores = validarLogin(datos)
    setErrores(nuevosErrores)
    if (!tieneErrores(nuevosErrores)) {
      onIngresar({ correo: datos.correo.trim(), clave: datos.clave })
    }
  }

  return (
    <form className="card card-body shadow-sm" onSubmit={enviar} noValidate>
      <CampoFormulario
        id="login-correo"
        etiqueta="Correo"
        tipo="email"
        valor={datos.correo}
        alCambiar={(valor) => setDatos((actuales) => ({ ...actuales, correo: valor }))}
        error={errores.correo}
        maxLength={100}
        autoComplete="email"
        requerido
      />
      <CampoFormulario
        id="login-clave"
        etiqueta="Contraseña"
        tipo="password"
        valor={datos.clave}
        alCambiar={(valor) => setDatos((actuales) => ({ ...actuales, clave: valor }))}
        error={errores.clave}
        maxLength={10}
        autoComplete="current-password"
        requerido
      />

      <MensajeError mensaje={errorGeneral} />

      <div className="d-grid mt-2">
        <Boton texto="Ingresar" tipo="submit" />
      </div>
    </form>
  )
}

export default FormularioLogin

import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Errores } from '../../tipos'
import { tieneErrores, validarRegistro, type DatosRegistro } from '../../utilidades/validaciones'
import Boton from '../atomos/Boton'
import CampoFormulario from '../moleculas/CampoFormulario'
import SelectorRegionComuna from '../moleculas/SelectorRegionComuna'

interface FormularioRegistroProps {
  /**
   * Guarda el usuario. Devuelve errores adicionales (ej: RUN o correo repetido)
   * o un objeto vacio si el registro fue exitoso.
   */
  onRegistrar: (datos: DatosRegistro) => Errores<DatosRegistro>
}

const datosVacios: DatosRegistro = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  clave: '',
  confirmarClave: '',
  fechaNacimiento: '',
  region: '',
  comuna: '',
  direccion: '',
}

function FormularioRegistro({ onRegistrar }: FormularioRegistroProps) {
  const [datos, setDatos] = useState<DatosRegistro>(datosVacios)
  const [errores, setErrores] = useState<Errores<DatosRegistro>>({})
  const [registrado, setRegistrado] = useState(false)

  function actualizar(campo: keyof DatosRegistro, valor: string) {
    setDatos((actuales) => ({ ...actuales, [campo]: valor }))
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setRegistrado(false)

    const erroresFormulario = validarRegistro(datos)
    if (tieneErrores(erroresFormulario)) {
      setErrores(erroresFormulario)
      return
    }

    const erroresRegistro = onRegistrar(datos)
    setErrores(erroresRegistro)
    if (!tieneErrores(erroresRegistro)) {
      setRegistrado(true)
      setDatos(datosVacios)
    }
  }

  return (
    <form className="card card-body shadow-sm" onSubmit={enviar} noValidate>
      {registrado && (
        <div className="alert alert-success" role="status">
          Usuario registrado correctamente. Ya puedes <Link to="/login">iniciar sesión</Link>.
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          <CampoFormulario
            id="registro-run"
            etiqueta="RUN"
            valor={datos.run}
            alCambiar={(valor) => actualizar('run', valor)}
            error={errores.run}
            maxLength={9}
            placeholder="Sin puntos ni guion. Ej: 123456785"
            requerido
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="registro-fecha"
            etiqueta="Fecha de nacimiento"
            tipo="date"
            valor={datos.fechaNacimiento}
            alCambiar={(valor) => actualizar('fechaNacimiento', valor)}
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="registro-nombre"
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
            id="registro-apellidos"
            etiqueta="Apellidos"
            valor={datos.apellidos}
            alCambiar={(valor) => actualizar('apellidos', valor)}
            error={errores.apellidos}
            maxLength={100}
            requerido
          />
        </div>
      </div>

      <CampoFormulario
        id="registro-correo"
        etiqueta="Correo"
        tipo="email"
        valor={datos.correo}
        alCambiar={(valor) => actualizar('correo', valor)}
        error={errores.correo}
        maxLength={100}
        requerido
      />

      <div className="row">
        <div className="col-md-6">
          <CampoFormulario
            id="registro-clave"
            etiqueta="Contraseña"
            tipo="password"
            valor={datos.clave}
            alCambiar={(valor) => actualizar('clave', valor)}
            error={errores.clave}
            maxLength={10}
            ayuda="Entre 4 y 10 caracteres"
            requerido
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="registro-confirmar"
            etiqueta="Confirmar contraseña"
            tipo="password"
            valor={datos.confirmarClave}
            alCambiar={(valor) => actualizar('confirmarClave', valor)}
            error={errores.confirmarClave}
            maxLength={10}
            requerido
          />
        </div>
      </div>

      <SelectorRegionComuna
        prefijoId="registro-"
        region={datos.region}
        comuna={datos.comuna}
        alCambiarRegion={(valor) => actualizar('region', valor)}
        alCambiarComuna={(valor) => actualizar('comuna', valor)}
        errorRegion={errores.region}
        errorComuna={errores.comuna}
      />

      <CampoFormulario
        id="registro-direccion"
        etiqueta="Dirección"
        valor={datos.direccion}
        alCambiar={(valor) => actualizar('direccion', valor)}
        error={errores.direccion}
        maxLength={300}
        requerido
      />

      <div>
        <Boton texto="Crear cuenta" tipo="submit" />
      </div>
    </form>
  )
}

export default FormularioRegistro

import { useState, type FormEvent } from 'react'
import type { Errores } from '../../tipos'
import { tieneErrores, validarContacto, type DatosContacto } from '../../utilidades/validaciones'
import Boton from '../atomos/Boton'
import Aviso from '../moleculas/Aviso'
import CampoFormulario from '../moleculas/CampoFormulario'

interface FormularioContactoProps {
  /** Se llama con los datos validos al enviar */
  onEnviar?: (datos: DatosContacto) => void
}

const datosVacios: DatosContacto = { nombre: '', correo: '', comentario: '' }

function FormularioContacto({ onEnviar }: FormularioContactoProps) {
  const [datos, setDatos] = useState<DatosContacto>(datosVacios)
  const [errores, setErrores] = useState<Errores<DatosContacto>>({})
  const [enviado, setEnviado] = useState(false)

  function actualizar(campo: keyof DatosContacto, valor: string) {
    setDatos((actuales) => ({ ...actuales, [campo]: valor }))
    setEnviado(false)
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const nuevosErrores = validarContacto(datos)
    setErrores(nuevosErrores)

    if (tieneErrores(nuevosErrores)) {
      setEnviado(false)
      return
    }

    onEnviar?.(datos)
    setEnviado(true)
    setDatos(datosVacios)
  }

  return (
    <form className="card card-body shadow-sm" onSubmit={enviar} noValidate>
      <Aviso mensaje={enviado ? 'Mensaje enviado correctamente. Te responderemos pronto.' : null} />

      <CampoFormulario
        id="contacto-nombre"
        etiqueta="Nombre"
        valor={datos.nombre}
        alCambiar={(valor) => actualizar('nombre', valor)}
        error={errores.nombre}
        maxLength={100}
        placeholder="Ejemplo: Juan Pérez"
        requerido
      />
      <CampoFormulario
        id="contacto-correo"
        etiqueta="Correo"
        tipo="email"
        valor={datos.correo}
        alCambiar={(valor) => actualizar('correo', valor)}
        error={errores.correo}
        maxLength={100}
        placeholder="Ejemplo: usuario@correo.cl"
        requerido
      />
      <CampoFormulario
        id="contacto-comentario"
        etiqueta="Comentario"
        valor={datos.comentario}
        alCambiar={(valor) => actualizar('comentario', valor)}
        error={errores.comentario}
        maxLength={500}
        placeholder="Escribe tu mensaje"
        multilinea
        requerido
      />

      <div>
        <Boton texto="Enviar mensaje" tipo="submit" />
      </div>
    </form>
  )
}

export default FormularioContacto

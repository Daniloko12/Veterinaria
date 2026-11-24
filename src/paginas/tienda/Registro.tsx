import { useState } from 'react'
import { erroresDeFormulario } from '../../api/cliente'
import { guardarTokens } from '../../api/tokens'
import { registrarCliente } from '../../api/usuariosApi'
import Aviso from '../../componentes/moleculas/Aviso'
import FormularioRegistro from '../../componentes/organismos/FormularioRegistro'
import type { Errores } from '../../tipos'
import type { DatosRegistro } from '../../utilidades/validaciones'

const CAMPOS: (keyof DatosRegistro)[] = ['run', 'nombre', 'apellidos', 'correo', 'clave', 'fechaNacimiento', 'region', 'comuna', 'direccion']

function Registro() {
  const [error, setError] = useState('')

  // POST /api/auth/registro (ms-usuarios). El backend valida el RUN y que el RUN y el correo no estén repetidos.
  async function registrar(datos: DatosRegistro): Promise<Errores<DatosRegistro>> {
    setError('')
    try {
      const respuesta = await registrarCliente({
        run: datos.run.trim().toUpperCase(),
        nombre: datos.nombre.trim(),
        apellidos: datos.apellidos.trim(),
        correo: datos.correo.trim(),
        clave: datos.clave,
        fechaNacimiento: datos.fechaNacimiento,
        region: datos.region,
        comuna: datos.comuna,
        direccion: datos.direccion.trim(),
      })
      // El registro deja la sesión iniciada (el backend entrega los tokens)
      guardarTokens(respuesta)
      return {}
    } catch (problema) {
      const { errores, mensaje } = erroresDeFormulario<DatosRegistro>(problema, CAMPOS)
      setError(mensaje)
      return errores
    }
  }

  return (
    <div className="container">
      <div className="mx-auto contenedor-angosto">
        <h1 className="h2">Crear cuenta</h1>
        <p className="text-muted">Regístrate para comprar más rápido y revisar tus pedidos.</p>
        <Aviso mensaje={error} tipo="danger" onCerrar={() => setError('')} />
        <FormularioRegistro onRegistrar={registrar} />
      </div>
    </div>
  )
}

export default Registro

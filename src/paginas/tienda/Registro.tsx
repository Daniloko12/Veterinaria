import FormularioRegistro from '../../componentes/organismos/FormularioRegistro'
import { crearUsuario, existeCorreo, existeRun } from '../../datos/baseDatos'
import type { Errores } from '../../tipos'
import type { DatosRegistro } from '../../utilidades/validaciones'

function Registro() {
  // Guarda el nuevo usuario como cliente. Devuelve errores si el RUN o el correo ya existen.
  function registrar(datos: DatosRegistro): Errores<DatosRegistro> {
    const errores: Errores<DatosRegistro> = {}
    if (existeRun(datos.run)) errores.run = 'El RUN ya está registrado'
    if (existeCorreo(datos.correo)) errores.correo = 'El correo ya está registrado'
    if (errores.run || errores.correo) {
      return errores
    }

    crearUsuario({
      run: datos.run.trim().toUpperCase(),
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.correo.trim(),
      clave: datos.clave,
      fechaNacimiento: datos.fechaNacimiento,
      rol: 'cliente',
      region: datos.region,
      comuna: datos.comuna,
      direccion: datos.direccion.trim(),
      activo: true,
    })
    return {}
  }

  return (
    <div className="container">
      <div className="mx-auto contenedor-angosto">
        <h1 className="h2">Crear cuenta</h1>
        <p className="text-muted">Regístrate para comprar más rápido y revisar tus pedidos.</p>
        <FormularioRegistro onRegistrar={registrar} />
      </div>
    </div>
  )
}

export default Registro

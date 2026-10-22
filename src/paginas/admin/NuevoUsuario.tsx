import { useNavigate } from 'react-router-dom'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import FormularioUsuario from '../../componentes/organismos/FormularioUsuario'
import { crearUsuario, existeCorreo, existeRun } from '../../datos/baseDatos'
import type { Errores, Usuario } from '../../tipos'
import type { DatosUsuarioFormulario } from '../../utilidades/validaciones'

function NuevoUsuario() {
  const navigate = useNavigate()

  function guardar(datos: Omit<Usuario, 'id'>): Errores<DatosUsuarioFormulario> {
    const errores: Errores<DatosUsuarioFormulario> = {}
    if (existeRun(datos.run)) errores.run = 'El RUN ya está registrado'
    if (existeCorreo(datos.correo)) errores.correo = 'El correo ya está registrado'
    if (errores.run || errores.correo) {
      return errores
    }
    const nuevo = crearUsuario(datos)
    navigate('/admin/usuarios', { state: { aviso: `Usuario ${nuevo.nombre} creado correctamente` } })
    return {}
  }

  return (
    <div>
      <EncabezadoPagina titulo="Nuevo usuario" />
      <FormularioUsuario modo="crear" onGuardar={guardar} rutaCancelar="/admin/usuarios" />
    </div>
  )
}

export default NuevoUsuario

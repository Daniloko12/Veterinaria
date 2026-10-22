import { useNavigate, useParams } from 'react-router-dom'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import FormularioUsuario from '../../componentes/organismos/FormularioUsuario'
import { actualizarUsuario, existeCorreo, existeRun, obtenerUsuarioPorId } from '../../datos/baseDatos'
import { useSesion } from '../../hooks/useSesion'
import type { Errores, Usuario } from '../../tipos'
import type { DatosUsuarioFormulario } from '../../utilidades/validaciones'

function EditarUsuario() {
  const { id } = useParams()
  const usuario = obtenerUsuarioPorId(Number(id))
  const { sesion, actualizarSesion } = useSesion()
  const navigate = useNavigate()

  if (!usuario) {
    return (
      <div>
        <p className="alert alert-warning">El usuario no existe.</p>
        <BotonEnlace a="/admin/usuarios" texto="Volver a usuarios" variante="outline-secondary" />
      </div>
    )
  }

  function guardar(datos: Omit<Usuario, 'id'>): Errores<DatosUsuarioFormulario> {
    if (!usuario) return {}
    const errores: Errores<DatosUsuarioFormulario> = {}
    if (existeRun(datos.run, usuario.id)) errores.run = 'El RUN ya está registrado'
    if (existeCorreo(datos.correo, usuario.id)) errores.correo = 'El correo ya está registrado'
    if (errores.run || errores.correo) {
      return errores
    }

    // El administrador no puede quitarse su propio rol ni desactivarse
    const esPropio = usuario.id === sesion?.id
    const actualizado = actualizarUsuario(usuario.id, esPropio ? { ...datos, rol: usuario.rol, activo: true } : datos)

    if (esPropio && actualizado) {
      actualizarSesion({
        id: actualizado.id,
        nombre: actualizado.nombre,
        apellidos: actualizado.apellidos,
        correo: actualizado.correo,
        rol: actualizado.rol,
      })
    }
    navigate(`/admin/usuarios/${usuario.id}`, { state: { aviso: 'Usuario actualizado correctamente' } })
    return {}
  }

  return (
    <div>
      <EncabezadoPagina titulo={`Editar usuario: ${usuario.nombre} ${usuario.apellidos}`} />
      <FormularioUsuario
        modo="editar"
        usuario={usuario}
        onGuardar={guardar}
        rutaCancelar={`/admin/usuarios/${usuario.id}`}
      />
    </div>
  )
}

export default EditarUsuario

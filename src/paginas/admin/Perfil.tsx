import { useState } from 'react'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import FormularioUsuario from '../../componentes/organismos/FormularioUsuario'
import { actualizarUsuario, existeCorreo, existeRun, obtenerUsuarioPorId } from '../../datos/baseDatos'
import { useSesion } from '../../hooks/useSesion'
import type { Errores, Usuario } from '../../tipos'
import type { DatosUsuarioFormulario } from '../../utilidades/validaciones'

function Perfil() {
  const { sesion, actualizarSesion } = useSesion()
  const [aviso, setAviso] = useState<string | null>(null)
  const usuario = sesion ? obtenerUsuarioPorId(sesion.id) : undefined

  if (!usuario) {
    return <p className="alert alert-warning">No se encontró la información del perfil.</p>
  }

  function guardar(datos: Omit<Usuario, 'id'>): Errores<DatosUsuarioFormulario> {
    if (!usuario) return {}
    const errores: Errores<DatosUsuarioFormulario> = {}
    if (existeRun(datos.run, usuario.id)) errores.run = 'El RUN ya está registrado'
    if (existeCorreo(datos.correo, usuario.id)) errores.correo = 'El correo ya está registrado'
    if (errores.run || errores.correo) {
      return errores
    }
    const actualizado = actualizarUsuario(usuario.id, { ...datos, rol: usuario.rol, activo: usuario.activo })
    if (actualizado) {
      actualizarSesion({
        id: actualizado.id,
        nombre: actualizado.nombre,
        apellidos: actualizado.apellidos,
        correo: actualizado.correo,
        rol: actualizado.rol,
      })
    }
    setAviso('Perfil actualizado correctamente')
    return {}
  }

  return (
    <div>
      <EncabezadoPagina titulo="Mi perfil" descripcion="Actualiza tu información personal" />
      <Aviso mensaje={aviso} onCerrar={() => setAviso(null)} />
      <FormularioUsuario modo="perfil" usuario={usuario} onGuardar={guardar} rutaCancelar="/admin" />
    </div>
  )
}

export default Perfil

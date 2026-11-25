import { useState } from 'react'
import { erroresDeFormulario } from '../../api/cliente'
import { actualizarMiPerfil, obtenerMiPerfil } from '../../api/usuariosApi'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import EstadoCarga from '../../componentes/moleculas/EstadoCarga'
import FormularioUsuario from '../../componentes/organismos/FormularioUsuario'
import { useCargar } from '../../hooks/useCargar'
import { useSesion } from '../../hooks/useSesion'
import type { Errores, Usuario } from '../../tipos'
import type { DatosUsuarioFormulario } from '../../utilidades/validaciones'

const CAMPOS: (keyof DatosUsuarioFormulario)[] = ['run', 'nombre', 'apellidos', 'correo', 'clave', 'fechaNacimiento', 'region', 'comuna', 'direccion']

// GET y PUT /api/auth/me: cada usuario edita sus propios datos (el rol no se puede cambiar aquí)
function Perfil() {
  const { actualizarSesion } = useSesion()
  const { datos: usuario, cargando, error, recargar } = useCargar(obtenerMiPerfil)
  const [aviso, setAviso] = useState<{ tipo: string; mensaje: string } | null>(null)

  if (!usuario) {
    return (
      <div>
        <EncabezadoPagina titulo="Mi perfil" descripcion="Actualiza tu información personal" />
        <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
      </div>
    )
  }

  async function guardar(datos: Omit<Usuario, 'id'>): Promise<Errores<DatosUsuarioFormulario>> {
    if (!usuario) return {}
    setAviso(null)
    try {
      const actualizado = await actualizarMiPerfil({ ...datos, rol: usuario.rol, activo: usuario.activo })
      actualizarSesion({
        id: actualizado.id,
        nombre: actualizado.nombre,
        apellidos: actualizado.apellidos,
        correo: actualizado.correo,
        rol: actualizado.rol,
      })
      setAviso({ tipo: 'success', mensaje: 'Perfil actualizado correctamente' })
      return {}
    } catch (problema) {
      const { errores, mensaje } = erroresDeFormulario<DatosUsuarioFormulario>(problema, CAMPOS)
      if (mensaje) setAviso({ tipo: 'danger', mensaje })
      return errores
    }
  }

  return (
    <div>
      <EncabezadoPagina titulo="Mi perfil" descripcion="Actualiza tu información personal" />
      <Aviso mensaje={aviso?.mensaje} tipo={aviso?.tipo} onCerrar={() => setAviso(null)} />
      <FormularioUsuario modo="perfil" usuario={usuario} onGuardar={guardar} rutaCancelar="/admin" />
    </div>
  )
}

export default Perfil

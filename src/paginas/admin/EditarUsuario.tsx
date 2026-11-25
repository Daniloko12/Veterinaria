import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorApi, erroresDeFormulario } from '../../api/cliente'
import { actualizarUsuario, obtenerUsuario } from '../../api/usuariosApi'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import EstadoCarga from '../../componentes/moleculas/EstadoCarga'
import FormularioUsuario from '../../componentes/organismos/FormularioUsuario'
import { useCargar } from '../../hooks/useCargar'
import { useSesion } from '../../hooks/useSesion'
import type { Errores, Usuario } from '../../tipos'
import type { DatosUsuarioFormulario } from '../../utilidades/validaciones'

const CAMPOS: (keyof DatosUsuarioFormulario)[] = ['run', 'nombre', 'apellidos', 'correo', 'clave', 'fechaNacimiento', 'rol', 'region', 'comuna', 'direccion', 'activo']

async function cargarUsuario(id: number) {
  try {
    return await obtenerUsuario(id)
  } catch (error) {
    if (error instanceof ErrorApi && error.estado === 404) return null
    throw error
  }
}

// PUT /api/usuarios/{id} (solo administrador)
function EditarUsuario() {
  const { id } = useParams()
  const { datos: usuario, cargando, error, recargar } = useCargar(() => cargarUsuario(Number(id)))
  const { sesion, actualizarSesion } = useSesion()
  const [errorGeneral, setErrorGeneral] = useState('')
  const navigate = useNavigate()

  if (cargando || error) {
    return <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
  }

  if (!usuario) {
    return (
      <div>
        <p className="alert alert-warning">El usuario no existe.</p>
        <BotonEnlace a="/admin/usuarios" texto="Volver a usuarios" variante="outline-secondary" />
      </div>
    )
  }

  async function guardar(datos: Omit<Usuario, 'id'>): Promise<Errores<DatosUsuarioFormulario>> {
    if (!usuario) return {}
    setErrorGeneral('')
    // El administrador no puede quitarse su propio rol ni desactivarse (el backend también lo revisa)
    const esPropio = usuario.id === sesion?.id
    try {
      const actualizado = await actualizarUsuario(usuario.id, esPropio ? { ...datos, rol: usuario.rol, activo: true } : datos)
      if (esPropio) {
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
    } catch (problema) {
      const { errores, mensaje } = erroresDeFormulario<DatosUsuarioFormulario>(problema, CAMPOS)
      setErrorGeneral(mensaje)
      return errores
    }
  }

  return (
    <div>
      <EncabezadoPagina titulo={`Editar usuario: ${usuario.nombre} ${usuario.apellidos}`} />
      <Aviso mensaje={errorGeneral} tipo="danger" onCerrar={() => setErrorGeneral('')} />
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

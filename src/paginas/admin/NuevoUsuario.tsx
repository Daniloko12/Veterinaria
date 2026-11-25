import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { erroresDeFormulario } from '../../api/cliente'
import { crearUsuario } from '../../api/usuariosApi'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import FormularioUsuario from '../../componentes/organismos/FormularioUsuario'
import type { Errores, Usuario } from '../../tipos'
import type { DatosUsuarioFormulario } from '../../utilidades/validaciones'

const CAMPOS: (keyof DatosUsuarioFormulario)[] = ['run', 'nombre', 'apellidos', 'correo', 'clave', 'fechaNacimiento', 'rol', 'region', 'comuna', 'direccion', 'activo']

// POST /api/usuarios (solo administrador). El backend valida el RUN y que el RUN y el correo no se repitan.
function NuevoUsuario() {
  const navigate = useNavigate()
  const [errorGeneral, setErrorGeneral] = useState('')

  async function guardar(datos: Omit<Usuario, 'id'>): Promise<Errores<DatosUsuarioFormulario>> {
    setErrorGeneral('')
    try {
      const nuevo = await crearUsuario(datos)
      navigate('/admin/usuarios', { state: { aviso: `Usuario ${nuevo.nombre} creado correctamente` } })
      return {}
    } catch (problema) {
      const { errores, mensaje } = erroresDeFormulario<DatosUsuarioFormulario>(problema, CAMPOS)
      setErrorGeneral(mensaje)
      return errores
    }
  }

  return (
    <div>
      <EncabezadoPagina titulo="Nuevo usuario" />
      <Aviso mensaje={errorGeneral} tipo="danger" onCerrar={() => setErrorGeneral('')} />
      <FormularioUsuario modo="crear" onGuardar={guardar} rutaCancelar="/admin/usuarios" />
    </div>
  )
}

export default NuevoUsuario

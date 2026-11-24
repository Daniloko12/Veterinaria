import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { mensajeDeError } from '../../api/cliente'
import { cambiarEstadoUsuario, eliminarUsuario, listarUsuarios } from '../../api/usuariosApi'
import Boton from '../../componentes/atomos/Boton'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Insignia from '../../componentes/atomos/Insignia'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import EstadoCarga from '../../componentes/moleculas/EstadoCarga'
import { useCargar } from '../../hooks/useCargar'
import { useSesion } from '../../hooks/useSesion'
import type { Usuario } from '../../tipos'

// CRUD de usuarios con /api/usuarios (ms-usuarios), solo administrador
function UsuariosAdmin() {
  const location = useLocation()
  const { sesion } = useSesion()
  const { datos, cargando, error, recargar } = useCargar(listarUsuarios)
  const usuarios = datos ?? []
  const [aviso, setAviso] = useState<{ tipo: string; mensaje: string } | null>(() => {
    const mensaje = (location.state as { aviso?: string } | null)?.aviso
    return mensaje ? { tipo: 'success', mensaje } : null
  })

  // PATCH /api/usuarios/{id}/estado
  async function cambiarEstado(usuario: Usuario) {
    try {
      await cambiarEstadoUsuario(usuario.id, !usuario.activo)
      setAviso({ tipo: 'success', mensaje: `Usuario ${usuario.nombre} ${usuario.activo ? 'desactivado' : 'activado'}` })
      recargar()
    } catch (problema) {
      setAviso({ tipo: 'danger', mensaje: mensajeDeError(problema) })
    }
  }

  // DELETE /api/usuarios/{id}
  async function eliminar(usuario: Usuario) {
    if (!window.confirm(`¿Eliminar al usuario ${usuario.nombre} ${usuario.apellidos}?`)) {
      return
    }
    try {
      await eliminarUsuario(usuario.id)
      setAviso({ tipo: 'success', mensaje: `Usuario ${usuario.nombre} eliminado` })
      recargar()
    } catch (problema) {
      setAviso({ tipo: 'danger', mensaje: mensajeDeError(problema) })
    }
  }

  return (
    <div>
      <EncabezadoPagina
        titulo="Usuarios"
        descripcion={`${usuarios.length} usuarios registrados`}
        acciones={<BotonEnlace a="/admin/usuarios/nuevo" texto="Nuevo usuario" />}
      />

      <Aviso mensaje={aviso?.mensaje} tipo={aviso?.tipo} onCerrar={() => setAviso(null)} />
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />

      <div className="table-responsive bg-white rounded shadow-sm">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">RUN</th>
              <th scope="col">Nombre</th>
              <th scope="col">Correo</th>
              <th scope="col">Rol</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => {
              const esPropio = usuario.id === sesion?.id
              return (
                <tr key={usuario.id}>
                  <td>{usuario.run}</td>
                  <td>
                    {usuario.nombre} {usuario.apellidos}
                  </td>
                  <td>{usuario.correo}</td>
                  <td className="text-capitalize">{usuario.rol}</td>
                  <td>
                    <Insignia
                      texto={usuario.activo ? 'Activo' : 'Desactivado'}
                      color={usuario.activo ? 'success' : 'secondary'}
                    />
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      <BotonEnlace a={`/admin/usuarios/${usuario.id}`} texto="Ver" variante="outline-primary" tamano="sm" />
                      <BotonEnlace
                        a={`/admin/usuarios/${usuario.id}/editar`}
                        texto="Editar"
                        variante="outline-secondary"
                        tamano="sm"
                      />
                      <Boton
                        texto={usuario.activo ? 'Desactivar' : 'Activar'}
                        variante="outline-warning"
                        tamano="sm"
                        deshabilitado={esPropio}
                        etiquetaAccesible={`${usuario.activo ? 'Desactivar' : 'Activar'} ${usuario.nombre} ${usuario.apellidos}`}
                        onClick={() => cambiarEstado(usuario)}
                      />
                      <Boton
                        texto="Eliminar"
                        variante="outline-danger"
                        tamano="sm"
                        deshabilitado={esPropio}
                        etiquetaAccesible={`Eliminar ${usuario.nombre} ${usuario.apellidos}`}
                        onClick={() => eliminar(usuario)}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="small text-muted mt-2">No puedes desactivar ni eliminar tu propia cuenta.</p>
    </div>
  )
}

export default UsuariosAdmin

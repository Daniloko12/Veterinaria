import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Boton from '../../componentes/atomos/Boton'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Insignia from '../../componentes/atomos/Insignia'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import { actualizarUsuario, eliminarUsuario, obtenerUsuarios } from '../../datos/baseDatos'
import { useSesion } from '../../hooks/useSesion'
import type { Usuario } from '../../tipos'

function UsuariosAdmin() {
  const location = useLocation()
  const { sesion } = useSesion()
  const [usuarios, setUsuarios] = useState(() => obtenerUsuarios())
  const [aviso, setAviso] = useState<string | null>(
    () => (location.state as { aviso?: string } | null)?.aviso ?? null,
  )

  function cambiarEstado(usuario: Usuario) {
    actualizarUsuario(usuario.id, { activo: !usuario.activo })
    setUsuarios(obtenerUsuarios())
    setAviso(`Usuario ${usuario.nombre} ${usuario.activo ? 'desactivado' : 'activado'}`)
  }

  function eliminar(usuario: Usuario) {
    if (!window.confirm(`¿Eliminar al usuario ${usuario.nombre} ${usuario.apellidos}?`)) {
      return
    }
    eliminarUsuario(usuario.id)
    setUsuarios(obtenerUsuarios())
    setAviso(`Usuario ${usuario.nombre} eliminado`)
  }

  return (
    <div>
      <EncabezadoPagina
        titulo="Usuarios"
        descripcion={`${usuarios.length} usuarios registrados`}
        acciones={<BotonEnlace a="/admin/usuarios/nuevo" texto="Nuevo usuario" />}
      />

      <Aviso mensaje={aviso} onCerrar={() => setAviso(null)} />

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

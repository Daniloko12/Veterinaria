import { useState, type FormEvent } from 'react'
import type { Errores, Rol, Usuario } from '../../tipos'
import { tieneErrores, validarUsuario, type DatosUsuarioFormulario } from '../../utilidades/validaciones'
import Boton from '../atomos/Boton'
import BotonEnlace from '../atomos/BotonEnlace'
import CampoFormulario from '../moleculas/CampoFormulario'
import CampoSelect from '../moleculas/CampoSelect'
import SelectorRegionComuna from '../moleculas/SelectorRegionComuna'

export type ModoFormularioUsuario = 'crear' | 'editar' | 'perfil'

interface FormularioUsuarioProps {
  modo: ModoFormularioUsuario
  usuario?: Usuario
  onGuardar: (datos: Omit<Usuario, 'id'>) => Errores<DatosUsuarioFormulario>
  rutaCancelar: string
}

const roles: { valor: Rol; texto: string }[] = [
  { valor: 'cliente', texto: 'Cliente' },
  { valor: 'recepcionista', texto: 'Recepcionista' },
  { valor: 'administrador', texto: 'Administrador' },
]

function aFormulario(usuario?: Usuario): DatosUsuarioFormulario {
  return {
    run: usuario?.run ?? '',
    nombre: usuario?.nombre ?? '',
    apellidos: usuario?.apellidos ?? '',
    correo: usuario?.correo ?? '',
    clave: '',
    fechaNacimiento: usuario?.fechaNacimiento ?? '',
    rol: usuario?.rol ?? 'cliente',
    region: usuario?.region ?? '',
    comuna: usuario?.comuna ?? '',
    direccion: usuario?.direccion ?? '',
    activo: usuario ? String(usuario.activo) : 'true',
  }
}

function FormularioUsuario({ modo, usuario, onGuardar, rutaCancelar }: FormularioUsuarioProps) {
  const [datos, setDatos] = useState<DatosUsuarioFormulario>(() => aFormulario(usuario))
  const [errores, setErrores] = useState<Errores<DatosUsuarioFormulario>>({})
  const claveOpcional = modo !== 'crear'

  function actualizar(campo: keyof DatosUsuarioFormulario, valor: string) {
    setDatos((actuales) => ({ ...actuales, [campo]: valor }))
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const erroresFormulario = validarUsuario(datos, claveOpcional)
    if (tieneErrores(erroresFormulario)) {
      setErrores(erroresFormulario)
      return
    }

    const resultado = onGuardar({
      run: datos.run.trim().toUpperCase(),
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.correo.trim(),
      // En edicion, la contraseña vacia mantiene la actual
      clave: datos.clave === '' && usuario ? usuario.clave : datos.clave,
      fechaNacimiento: datos.fechaNacimiento,
      rol: datos.rol as Rol,
      region: datos.region,
      comuna: datos.comuna,
      direccion: datos.direccion.trim(),
      activo: datos.activo === 'true',
    })
    setErrores(resultado)
  }

  return (
    <form className="card card-body shadow-sm" onSubmit={enviar} noValidate>
      <div className="row">
        <div className="col-md-6">
          <CampoFormulario
            id="usuario-run"
            etiqueta="RUN"
            valor={datos.run}
            alCambiar={(valor) => actualizar('run', valor)}
            error={errores.run}
            maxLength={9}
            placeholder="Sin puntos ni guion"
            requerido
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="usuario-fecha"
            etiqueta="Fecha de nacimiento"
            tipo="date"
            valor={datos.fechaNacimiento}
            alCambiar={(valor) => actualizar('fechaNacimiento', valor)}
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="usuario-nombre"
            etiqueta="Nombre"
            valor={datos.nombre}
            alCambiar={(valor) => actualizar('nombre', valor)}
            error={errores.nombre}
            maxLength={50}
            requerido
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="usuario-apellidos"
            etiqueta="Apellidos"
            valor={datos.apellidos}
            alCambiar={(valor) => actualizar('apellidos', valor)}
            error={errores.apellidos}
            maxLength={100}
            requerido
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="usuario-correo"
            etiqueta="Correo"
            tipo="email"
            valor={datos.correo}
            alCambiar={(valor) => actualizar('correo', valor)}
            error={errores.correo}
            maxLength={100}
            requerido
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="usuario-clave"
            etiqueta="Contraseña"
            tipo="password"
            valor={datos.clave}
            alCambiar={(valor) => actualizar('clave', valor)}
            error={errores.clave}
            maxLength={10}
            ayuda={claveOpcional ? 'Déjala vacía para mantener la contraseña actual' : 'Entre 4 y 10 caracteres'}
            requerido={!claveOpcional}
          />
        </div>
      </div>

      {modo !== 'perfil' && (
        <div className="row">
          <div className="col-md-6">
            <CampoSelect
              id="usuario-rol"
              etiqueta="Rol"
              valor={datos.rol}
              alCambiar={(valor) => actualizar('rol', valor)}
              opciones={roles}
              error={errores.rol}
              requerido
            />
          </div>
          <div className="col-md-6">
            <CampoSelect
              id="usuario-activo"
              etiqueta="Estado"
              valor={datos.activo}
              alCambiar={(valor) => actualizar('activo', valor)}
              opciones={[
                { valor: 'true', texto: 'Activo' },
                { valor: 'false', texto: 'Desactivado' },
              ]}
            />
          </div>
        </div>
      )}

      <SelectorRegionComuna
        prefijoId="usuario-"
        region={datos.region}
        comuna={datos.comuna}
        alCambiarRegion={(valor) => actualizar('region', valor)}
        alCambiarComuna={(valor) => actualizar('comuna', valor)}
        errorRegion={errores.region}
        errorComuna={errores.comuna}
      />

      <CampoFormulario
        id="usuario-direccion"
        etiqueta="Dirección"
        valor={datos.direccion}
        alCambiar={(valor) => actualizar('direccion', valor)}
        error={errores.direccion}
        maxLength={300}
        requerido
      />

      <div className="d-flex gap-2">
        <Boton texto={modo === 'crear' ? 'Crear usuario' : 'Guardar cambios'} tipo="submit" />
        <BotonEnlace a={rutaCancelar} texto="Cancelar" variante="outline-secondary" />
      </div>
    </form>
  )
}

export default FormularioUsuario

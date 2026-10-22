import { useState, type FormEvent } from 'react'
import { imagenesDisponibles } from '../../datos/datosIniciales'
import type { Categoria, Errores } from '../../tipos'
import { tieneErrores, validarCategoria, type DatosCategoriaFormulario } from '../../utilidades/validaciones'
import Boton from '../atomos/Boton'
import BotonEnlace from '../atomos/BotonEnlace'
import CampoFormulario from '../moleculas/CampoFormulario'
import CampoSelect from '../moleculas/CampoSelect'

interface FormularioCategoriaProps {
  categoria?: Categoria
  onGuardar: (datos: Omit<Categoria, 'id'>) => Errores<DatosCategoriaFormulario>
}

function FormularioCategoria({ categoria, onGuardar }: FormularioCategoriaProps) {
  const [datos, setDatos] = useState<DatosCategoriaFormulario>({
    nombre: categoria?.nombre ?? '',
    descripcion: categoria?.descripcion ?? '',
    imagen: categoria?.imagen ?? imagenesDisponibles[0].ruta,
  })
  const [errores, setErrores] = useState<Errores<DatosCategoriaFormulario>>({})

  function actualizar(campo: keyof DatosCategoriaFormulario, valor: string) {
    setDatos((actuales) => ({ ...actuales, [campo]: valor }))
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const erroresFormulario = validarCategoria(datos)
    if (tieneErrores(erroresFormulario)) {
      setErrores(erroresFormulario)
      return
    }
    setErrores(
      onGuardar({ nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim(), imagen: datos.imagen }),
    )
  }

  return (
    <form className="card card-body shadow-sm" onSubmit={enviar} noValidate>
      <CampoFormulario
        id="categoria-nombre"
        etiqueta="Nombre"
        valor={datos.nombre}
        alCambiar={(valor) => actualizar('nombre', valor)}
        error={errores.nombre}
        maxLength={50}
        requerido
      />
      <CampoFormulario
        id="categoria-descripcion"
        etiqueta="Descripción"
        valor={datos.descripcion}
        alCambiar={(valor) => actualizar('descripcion', valor)}
        error={errores.descripcion}
        maxLength={200}
        multilinea
        requerido
      />
      <CampoSelect
        id="categoria-imagen"
        etiqueta="Imagen"
        valor={datos.imagen}
        alCambiar={(valor) => actualizar('imagen', valor)}
        opciones={imagenesDisponibles.map((imagen) => ({ valor: imagen.ruta, texto: imagen.nombre }))}
        error={errores.imagen}
        requerido
      />
      <div className="mb-3">
        <img src={datos.imagen} alt="Vista previa de la imagen" className="vista-previa border rounded" />
      </div>
      <div className="d-flex gap-2">
        <Boton texto={categoria ? 'Guardar cambios' : 'Crear categoría'} tipo="submit" />
        <BotonEnlace a="/admin/categorias" texto="Cancelar" variante="outline-secondary" />
      </div>
    </form>
  )
}

export default FormularioCategoria

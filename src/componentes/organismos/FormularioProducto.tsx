import { useState, type FormEvent } from 'react'
import { imagenesDisponibles } from '../../datos/datosIniciales'
import type { Categoria, Errores, Producto } from '../../tipos'
import { tieneErrores, validarProducto, type DatosProductoFormulario } from '../../utilidades/validaciones'
import Boton from '../atomos/Boton'
import BotonEnlace from '../atomos/BotonEnlace'
import CampoFormulario from '../moleculas/CampoFormulario'
import CampoSelect from '../moleculas/CampoSelect'

interface FormularioProductoProps {
  categorias: Categoria[]
  /** Producto a editar. Si no se entrega, el formulario crea uno nuevo. */
  producto?: Producto
  /** Devuelve errores adicionales (ej: codigo repetido) o {} si se guardo */
  onGuardar: (datos: Omit<Producto, 'id'>) => Errores<DatosProductoFormulario>
  rutaCancelar: string
}

function aFormulario(producto?: Producto): DatosProductoFormulario {
  return {
    codigo: producto?.codigo ?? '',
    nombre: producto?.nombre ?? '',
    descripcion: producto?.descripcion ?? '',
    precio: producto ? String(producto.precio) : '',
    descuento: producto ? String(producto.descuento) : '0',
    stock: producto ? String(producto.stock) : '',
    stockCritico: producto ? String(producto.stockCritico) : '5',
    categoriaId: producto ? String(producto.categoriaId) : '',
    imagen: producto?.imagen ?? imagenesDisponibles[0].ruta,
  }
}

function FormularioProducto({ categorias, producto, onGuardar, rutaCancelar }: FormularioProductoProps) {
  const [datos, setDatos] = useState<DatosProductoFormulario>(() => aFormulario(producto))
  const [errores, setErrores] = useState<Errores<DatosProductoFormulario>>({})

  function actualizar(campo: keyof DatosProductoFormulario, valor: string) {
    setDatos((actuales) => ({ ...actuales, [campo]: valor }))
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const erroresFormulario = validarProducto(datos)
    if (tieneErrores(erroresFormulario)) {
      setErrores(erroresFormulario)
      return
    }

    const resultado = onGuardar({
      codigo: datos.codigo.trim().toUpperCase(),
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
      precio: Number(datos.precio),
      descuento: Number(datos.descuento),
      stock: Number(datos.stock),
      stockCritico: Number(datos.stockCritico),
      categoriaId: Number(datos.categoriaId),
      imagen: datos.imagen,
    })
    setErrores(resultado)
  }

  return (
    <form className="card card-body shadow-sm" onSubmit={enviar} noValidate>
      <div className="row">
        <div className="col-md-4">
          <CampoFormulario
            id="producto-codigo"
            etiqueta="Código"
            valor={datos.codigo}
            alCambiar={(valor) => actualizar('codigo', valor)}
            error={errores.codigo}
            maxLength={20}
            placeholder="Ej: ALI-004"
            requerido
          />
        </div>
        <div className="col-md-8">
          <CampoFormulario
            id="producto-nombre"
            etiqueta="Nombre"
            valor={datos.nombre}
            alCambiar={(valor) => actualizar('nombre', valor)}
            error={errores.nombre}
            maxLength={100}
            requerido
          />
        </div>
      </div>

      <CampoFormulario
        id="producto-descripcion"
        etiqueta="Descripción"
        valor={datos.descripcion}
        alCambiar={(valor) => actualizar('descripcion', valor)}
        error={errores.descripcion}
        maxLength={300}
        multilinea
      />

      <div className="row">
        <div className="col-6 col-md-3">
          <CampoFormulario
            id="producto-precio"
            etiqueta="Precio"
            tipo="number"
            valor={datos.precio}
            alCambiar={(valor) => actualizar('precio', valor)}
            error={errores.precio}
            min={1}
            requerido
          />
        </div>
        <div className="col-6 col-md-3">
          <CampoFormulario
            id="producto-descuento"
            etiqueta="Descuento (%)"
            tipo="number"
            valor={datos.descuento}
            alCambiar={(valor) => actualizar('descuento', valor)}
            error={errores.descuento}
            min={0}
            max={90}
          />
        </div>
        <div className="col-6 col-md-3">
          <CampoFormulario
            id="producto-stock"
            etiqueta="Stock"
            tipo="number"
            valor={datos.stock}
            alCambiar={(valor) => actualizar('stock', valor)}
            error={errores.stock}
            min={0}
            requerido
          />
        </div>
        <div className="col-6 col-md-3">
          <CampoFormulario
            id="producto-stock-critico"
            etiqueta="Stock crítico"
            tipo="number"
            valor={datos.stockCritico}
            alCambiar={(valor) => actualizar('stockCritico', valor)}
            error={errores.stockCritico}
            min={0}
            requerido
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <CampoSelect
            id="producto-categoria"
            etiqueta="Categoría"
            valor={datos.categoriaId}
            alCambiar={(valor) => actualizar('categoriaId', valor)}
            opciones={categorias.map((categoria) => ({ valor: String(categoria.id), texto: categoria.nombre }))}
            textoVacio="Seleccione una categoría"
            error={errores.categoriaId}
            requerido
          />
        </div>
        <div className="col-md-6">
          <CampoSelect
            id="producto-imagen"
            etiqueta="Imagen"
            valor={datos.imagen}
            alCambiar={(valor) => actualizar('imagen', valor)}
            opciones={imagenesDisponibles.map((imagen) => ({ valor: imagen.ruta, texto: imagen.nombre }))}
            error={errores.imagen}
            requerido
          />
        </div>
      </div>

      <div className="mb-3">
        <img src={datos.imagen} alt="Vista previa de la imagen" className="vista-previa border rounded" />
      </div>

      <div className="d-flex gap-2">
        <Boton texto={producto ? 'Guardar cambios' : 'Crear producto'} tipo="submit" />
        <BotonEnlace a={rutaCancelar} texto="Cancelar" variante="outline-secondary" />
      </div>
    </form>
  )
}

export default FormularioProducto

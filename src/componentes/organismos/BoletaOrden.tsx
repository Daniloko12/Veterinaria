import type { Orden } from '../../tipos'
import { formatearFechaHora, formatearPrecio } from '../../utilidades/formato'
import { calcularIva } from '../../utilidades/pago'
import TablaItemsOrden from './TablaItemsOrden'

interface BoletaOrdenProps {
  orden: Orden
  /** Título del documento: "Boleta electrónica" o "Detalle del pedido" si no se pagó */
  titulo?: string
}

interface DatoProps {
  etiqueta: string
  valor: string
}

function Dato({ etiqueta, valor }: DatoProps) {
  return (
    <div className="col-sm-6 col-lg-4">
      <dt className="small text-muted fw-normal">{etiqueta}</dt>
      <dd className="bg-light border rounded px-2 py-1">{valor || '—'}</dd>
    </div>
  )
}

// Boleta de la compra: datos de la tienda, cliente, productos, IVA, total y medio de pago.
// La clase "boleta-imprimible" hace que al imprimir solo salga este bloque.
function BoletaOrden({ orden, titulo = 'Boleta electrónica' }: BoletaOrdenProps) {
  const { neto, iva } = calcularIva(orden.total)
  const pagada = orden.estado === 'pagada'

  return (
    <article className="boleta-imprimible border rounded p-3 p-md-4 bg-white" aria-label={titulo}>
      <header className="d-flex flex-wrap justify-content-between gap-2 border-bottom pb-3 mb-3">
        <div>
          <p className="h5 mb-0">Veterinaria San Marcos</p>
          <p className="small text-muted mb-0">Rancagua, Región de O'Higgins</p>
        </div>
        <div className="text-sm-end">
          <p className="fw-bold text-uppercase mb-0">{titulo}</p>
          <p className="mb-0">N° {orden.numero}</p>
          <p className="small text-muted mb-0">{formatearFechaHora(orden.fecha)}</p>
        </div>
      </header>

      <h2 className="h6">Datos del cliente</h2>
      <dl className="row g-2 mb-2">
        <Dato etiqueta="Nombre" valor={orden.cliente.nombre} />
        <Dato etiqueta="Apellidos" valor={orden.cliente.apellidos} />
        <Dato etiqueta="Correo" valor={orden.cliente.correo} />
      </dl>

      <h2 className="h6">Dirección de entrega</h2>
      <dl className="row g-2 mb-3">
        <Dato etiqueta="Calle" valor={orden.direccion.calle} />
        <Dato etiqueta="Departamento" valor={orden.direccion.departamento} />
        <Dato etiqueta="Región" valor={orden.direccion.region} />
        <Dato etiqueta="Comuna" valor={orden.direccion.comuna} />
        <Dato etiqueta="Indicaciones" valor={orden.direccion.indicaciones} />
      </dl>

      <TablaItemsOrden items={orden.items} />

      <dl className="row mt-3 mb-0 ms-auto totales-boleta">
        <dt className="col-7 fw-normal">Monto neto</dt>
        <dd className="col-5 text-end mb-1">{formatearPrecio(neto)}</dd>
        <dt className="col-7 fw-normal">IVA (19%)</dt>
        <dd className="col-5 text-end mb-1">{formatearPrecio(iva)}</dd>
        <dt className="col-7 border-top pt-1">{pagada ? 'Total pagado' : 'Total'}</dt>
        <dd className="col-5 text-end border-top pt-1 fw-bold" data-testid="total-boleta">
          {formatearPrecio(orden.total)}
        </dd>
      </dl>

      {orden.pago && (
        <section className="border-top mt-3 pt-3">
          <h2 className="h6">Medio de pago</h2>
          <p className="mb-1">
            Tarjeta {orden.pago.marca} terminada en {orden.pago.ultimos4} · Titular: {orden.pago.titular}
          </p>
          <p className="mb-0 small">
            {pagada ? `Código de autorización: ${orden.pago.codigoAutorizacion}` : 'Pago rechazado: no se realizó ningún cobro'}
          </p>
        </section>
      )}

      <p className="small text-muted text-center mt-3 mb-0">
        Gracias por comprar en Veterinaria San Marcos · Documento generado por la tienda (proyecto académico)
      </p>
    </article>
  )
}

export default BoletaOrden

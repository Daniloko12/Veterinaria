import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mensajeDeError } from '../../api/cliente'
import { crearOrden } from '../../api/ordenesApi'
import { obtenerMiPerfil } from '../../api/usuariosApi'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Aviso from '../../componentes/moleculas/Aviso'
import FormularioCheckout from '../../componentes/organismos/FormularioCheckout'
import TablaItemsOrden from '../../componentes/organismos/TablaItemsOrden'
import { guardarUltimaOrden } from '../../datos/almacenamiento'
import { useCarrito } from '../../hooks/useCarrito'
import { useSesion } from '../../hooks/useSesion'
import { formatearPrecio } from '../../utilidades/formato'
import type { DatosTarjeta, Usuario } from '../../tipos'
import type { DatosCheckout } from '../../utilidades/validaciones'

interface CheckoutProps {
  /** Milisegundos que "demora el banco" en responder (0 = inmediato, se usa en las pruebas) */
  demoraPago?: number
}

function Checkout({ demoraPago = 1500 }: CheckoutProps) {
  const { items, total, vaciarCarrito } = useCarrito()
  const { sesion } = useSesion()
  const navigate = useNavigate()
  const [procesando, setProcesando] = useState(false)
  const [errorPago, setErrorPago] = useState('')
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Si el usuario inició sesión, sus datos se completan automáticamente (GET /api/auth/me)
  useEffect(() => {
    if (!sesion) return
    let vigente = true
    obtenerMiPerfil()
      .then((perfil) => {
        if (vigente) setUsuario(perfil)
      })
      .catch(() => {})
    return () => {
      vigente = false
    }
  }, [sesion])

  // Si se sale de la página mientras se procesa el pago, se cancela el temporizador
  useEffect(() => {
    return () => {
      if (temporizador.current) clearTimeout(temporizador.current)
    }
  }, [])

  if (items.length === 0) {
    return (
      <div className="container text-center py-5">
        <h1 className="h3">Tu carrito está vacío</h1>
        <p className="text-muted">Agrega productos antes de continuar con el pago.</p>
        <BotonEnlace a="/productos" texto="Ir a productos" />
      </div>
    )
  }

  const valoresIniciales: DatosCheckout = {
    nombre: usuario?.nombre ?? '',
    apellidos: usuario?.apellidos ?? '',
    correo: usuario?.correo ?? '',
    calle: usuario?.direccion ?? '',
    departamento: '',
    region: usuario?.region ?? '',
    comuna: usuario?.comuna ?? '',
    indicaciones: '',
  }

  // Simula que el banco tarda un momento en aprobar o rechazar el pago
  function confirmar(datos: DatosCheckout, tarjeta: DatosTarjeta) {
    setProcesando(true)
    setErrorPago('')
    if (demoraPago > 0) {
      temporizador.current = setTimeout(() => pagar(datos, tarjeta), demoraPago)
    } else {
      pagar(datos, tarjeta)
    }
  }

  // POST /api/ordenes (ms-ordenes): el backend valida el stock, procesa el pago y descuenta el stock
  async function pagar(datos: DatosCheckout, tarjeta: DatosTarjeta) {
    let orden
    try {
      orden = await crearOrden({
        cliente: { nombre: datos.nombre.trim(), apellidos: datos.apellidos.trim(), correo: datos.correo.trim() },
        direccion: {
          calle: datos.calle.trim(),
          departamento: datos.departamento.trim(),
          region: datos.region,
          comuna: datos.comuna,
          indicaciones: datos.indicaciones.trim(),
        },
        items: items.map((item) => ({ productoId: item.productoId, cantidad: item.cantidad })),
        tarjeta,
      })
    } catch (error) {
      setProcesando(false)
      setErrorPago(mensajeDeError(error))
      return
    }
    setProcesando(false)
    guardarUltimaOrden(orden)

    if (orden.estado === 'pagada') {
      vaciarCarrito()
      navigate(`/compra/exitosa/${orden.id}`)
    } else {
      navigate(`/compra/fallida/${orden.id}`)
    }
  }

  return (
    <div className="container">
      <div className="card shadow-sm mx-auto contenedor-angosto">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h1 className="h4 mb-0">Carrito de compra</h1>
              <p className="small text-muted mb-0">Revisa tus productos y completa tus datos</p>
            </div>
            <span className="badge text-bg-primary fs-6 p-2">Total a pagar: {formatearPrecio(total)}</span>
          </div>

          <TablaItemsOrden items={items} />

          <hr />

          {!sesion && (
            <p className="small alert alert-light border">
              ¿Tienes cuenta? Inicia sesión y tus datos se completarán automáticamente.
            </p>
          )}

          <Aviso mensaje={errorPago} tipo="danger" onCerrar={() => setErrorPago('')} />

          {/* La key vuelve a crear el formulario cuando llegan los datos del usuario */}
          <FormularioCheckout
            key={usuario ? `usuario-${usuario.id}` : 'invitado'}
            valoresIniciales={valoresIniciales}
            total={total}
            procesando={procesando}
            onConfirmar={confirmar}
          />
        </div>
      </div>
    </div>
  )
}

export default Checkout

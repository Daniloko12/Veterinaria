import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { mensajeDeError } from '../../api/cliente'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Aviso from '../../componentes/moleculas/Aviso'
import FormularioLogin from '../../componentes/organismos/FormularioLogin'
import { useSesion } from '../../hooks/useSesion'
import type { DatosLogin } from '../../utilidades/validaciones'

function Login() {
  const { sesion, iniciarSesion } = useSesion()
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const aviso = (location.state as { aviso?: string } | null)?.aviso

  // POST /api/auth/login (ms-usuarios): si los datos son correctos se reciben los tokens JWT
  async function ingresar(datos: DatosLogin) {
    setProcesando(true)
    try {
      const nueva = await iniciarSesion(datos.correo, datos.clave)
      setError('')
      // El personal va al panel; el cliente vuelve a la tienda
      navigate(nueva.rol === 'cliente' ? '/' : '/admin')
    } catch (problema) {
      setError(mensajeDeError(problema))
    } finally {
      setProcesando(false)
    }
  }

  if (sesion) {
    return (
      <div className="container text-center py-5">
        <h1 className="h3">Ya iniciaste sesión como {sesion.nombre}</h1>
        <div className="d-flex justify-content-center gap-2 mt-3">
          <BotonEnlace a="/" texto="Ir a la tienda" variante="outline-primary" />
          {sesion.rol === 'cliente' ? (
            <BotonEnlace a="/mis-compras" texto="Ver mis compras" />
          ) : (
            <BotonEnlace a="/admin" texto="Ir al panel" />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="mx-auto contenedor-login">
        <div className="text-center mb-3">
          <img src="/img/logo.jpg" alt="Logo de Veterinaria San Marcos" className="rounded-circle logo-login" />
          <h1 className="h3 mt-2">Iniciar sesión</h1>
        </div>

        <Aviso mensaje={aviso} tipo="warning" />
        <FormularioLogin onIngresar={ingresar} errorGeneral={error} procesando={procesando} />

        <p className="text-center mt-3">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
        <div className="small text-muted border rounded p-2 bg-white">
          <p className="mb-1">Administrador: admin@veterinaria.cl / admin123</p>
          <p className="mb-1">Recepcionista: recepcion@veterinaria.cl / recep123</p>
          <p className="mb-0">Cliente: cliente@correo.cl / 1234</p>
        </div>
      </div>
    </div>
  )
}

export default Login

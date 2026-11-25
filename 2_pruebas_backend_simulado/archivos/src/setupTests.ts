// Configuracion global de las pruebas (se ejecuta antes de cada archivo de prueba)
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { simularApi } from './tests/apiSimulada'

beforeEach(() => {
  // Cada prueba parte sin carrito ni sesión, y con el backend simulado en su estado inicial
  localStorage.clear()
  sessionStorage.clear()
  simularApi()
})

afterEach(() => {
  // Desmonta los componentes renderizados en la prueba anterior
  cleanup()
  vi.unstubAllGlobals()
})

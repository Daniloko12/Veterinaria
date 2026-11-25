// Configuracion global de las pruebas (se ejecuta antes de cada archivo de prueba)
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'

beforeEach(() => {
  // Cada prueba parte con la "base de datos" en su estado inicial
  localStorage.clear()
})

afterEach(() => {
  // Desmonta los componentes renderizados en la prueba anterior
  cleanup()
})

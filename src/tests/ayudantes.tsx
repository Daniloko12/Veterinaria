// Funciones de ayuda compartidas por las pruebas (este archivo no es una prueba)
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CarritoProvider from "../contexto/CarritoProvider";
import SesionProvider from "../contexto/SesionProvider";
import { CLAVES } from "../datos/baseDatos";
import type { ItemCarrito } from "../tipos";

interface RutaExtra {
  path: string;
  element: ReactNode;
}

interface OpcionesRender {
  ruta?: string; // URL inicial
  patron?: string; // Patrón de la ruta del componente, ej: "/producto/:id"
  rutasExtra?: RutaExtra[]; // Otras rutas para comprobar redirecciones
}

// Renderiza un componente con React Router, sesión y carrito, igual que en la aplicación real
export function renderConProveedores(
  ui: ReactElement,
  { ruta = "/", patron = "*", rutasExtra = [] }: OpcionesRender = {},
) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <SesionProvider>
        <CarritoProvider>
          <Routes>
            <Route path={patron} element={ui} />
            {rutasExtra.map((extra) => (
              <Route key={extra.path} path={extra.path} element={extra.element} />
            ))}
          </Routes>
        </CarritoProvider>
      </SesionProvider>
    </MemoryRouter>,
  );
}

// Deja productos guardados en el carrito antes de renderizar
export function prepararCarrito(items: ItemCarrito[]) {
  localStorage.setItem(CLAVES.carrito, JSON.stringify(items));
}

// Simula que el usuario escribe (o elige una opción) en el campo con esa etiqueta
export function escribir(etiqueta: string, valor: string) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}

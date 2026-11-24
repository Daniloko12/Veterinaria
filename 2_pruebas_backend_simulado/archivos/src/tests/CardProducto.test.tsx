// @vitest-environment jsdom
import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import CardProducto from "../componentes/moleculas/CardProducto";
import type { Producto } from "../tipos";

const producto: Producto = {
  id: 2,
  codigo: "JUG-001",
  nombre: "Juguete para gatos",
  descripcion: "Juguete simple",
  precio: 2990,
  descuento: 20,
  stock: 15,
  stockCritico: 5,
  categoriaId: 2,
  imagen: "/img/juguete-gato.webp",
};

// Prueba 5 (props y eventos): la tarjeta muestra los datos y envía el producto al carrito
test("muestra los datos del producto y al hacer clic en Añadir lo envía", () => {
  // Creamos una función simulada para el botón Añadir
  const alAgregar = vi.fn();

  // Mostramos la tarjeta dentro de un router (usa Link)
  render(
    <MemoryRouter>
      <CardProducto producto={producto} onAgregar={alAgregar} />
    </MemoryRouter>,
  );

  // Comprobamos los datos recibidos por props (precio con 20% de descuento)
  expect(screen.getByRole("heading", { name: "Juguete para gatos" })).toBeInTheDocument();
  expect(screen.getByText("$2.392")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Ver detalle" })).toHaveAttribute("href", "/producto/2");

  // Simulamos el clic en Añadir al carrito
  fireEvent.click(screen.getByRole("button", { name: "Añadir al carrito" }));

  // Comprobamos que se envió el producto
  expect(alAgregar).toHaveBeenCalledWith(producto);
});

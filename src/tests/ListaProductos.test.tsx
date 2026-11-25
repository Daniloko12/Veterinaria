// @vitest-environment jsdom
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ListaProductos from "../componentes/organismos/ListaProductos";
import { categoriasIniciales, productosIniciales } from "../datos/datosIniciales";

// Prueba 4 (renderizado de listas): se muestra un elemento por cada producto
test("renderiza una tarjeta por cada producto del arreglo", () => {
  // Mostramos la lista con los 10 productos iniciales
  render(
    <MemoryRouter>
      <ListaProductos productos={productosIniciales} categorias={categoriasIniciales} />
    </MemoryRouter>,
  );

  // Cada tarjeta tiene un título (h3) con el nombre del producto
  const titulos = screen.getAllByRole("heading", { level: 3 });
  expect(titulos).toHaveLength(productosIniciales.length);

  // Comprobamos que aparece cada producto
  productosIniciales.forEach((producto) => {
    expect(screen.getByRole("heading", { name: producto.nombre })).toBeInTheDocument();
  });
});

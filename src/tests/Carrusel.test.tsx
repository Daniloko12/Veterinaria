// @vitest-environment jsdom
import { test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import Carrusel, { type Diapositiva } from "../componentes/organismos/Carrusel";

const diapositivas: Diapositiva[] = [
  { imagen: "/img/1.jpg", titulo: "Primera", descripcion: "Uno" },
  { imagen: "/img/2.jpg", titulo: "Segunda", descripcion: "Dos" },
  { imagen: "/img/3.jpg", titulo: "Tercera", descripcion: "Tres" },
];

// Devuelve el contenedor de la diapositiva que tiene ese título
function diapositiva(titulo: string) {
  return screen.getByText(titulo).closest(".carousel-item");
}

// Prueba 8 (estado y eventos): un clic cambia el estado del carrusel
test("el botón Siguiente cambia a la próxima diapositiva", () => {
  // intervalo 0 = sin cambio automático durante la prueba
  render(<Carrusel diapositivas={diapositivas} intervalo={0} />);

  // Al comienzo está activa la primera
  expect(diapositiva("Primera")).toHaveClass("active");

  // Simulamos el clic en Siguiente
  fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));

  // Comprobamos que ahora la activa es la segunda
  expect(diapositiva("Segunda")).toHaveClass("active");
  expect(diapositiva("Primera")).not.toHaveClass("active");
});

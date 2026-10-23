// @vitest-environment jsdom
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import MensajeError from "../componentes/atomos/MensajeError";

// Prueba 3 (renderizado condicional): el error solo aparece cuando existe
test("el mensaje de error solo se muestra cuando hay un error", () => {
  // Mostramos el componente sin mensaje
  const { rerender } = render(<MensajeError />);

  // Comprobamos que no aparece nada
  expect(screen.queryByRole("alert")).toBeNull();

  // Volvemos a mostrarlo, ahora con un mensaje de error
  rerender(<MensajeError mensaje="El correo es obligatorio" />);

  // Comprobamos que aparece el mensaje
  expect(screen.getByRole("alert").textContent).toBe("El correo es obligatorio");
});

// @vitest-environment jsdom
import { test, expect } from "vitest";
import { screen } from "@testing-library/react";

import RutaProtegida from "../componentes/plantillas/RutaProtegida";
import { renderConProveedores } from "./ayudantes";

// Prueba 10 (renderizado condicional por rol): el panel solo es para administradores
test("sin sesión de administrador redirige al login", () => {
  // Intentamos entrar a /admin sin haber iniciado sesión
  renderConProveedores(
    <RutaProtegida>
      <h1>Contenido del panel</h1>
    </RutaProtegida>,
    {
      ruta: "/admin",
      patron: "/admin",
      rutasExtra: [{ path: "/login", element: <h1>Pantalla de login</h1> }],
    },
  );

  // Comprobamos que nos mandó al login y que el panel no se muestra
  expect(screen.getByRole("heading", { name: "Pantalla de login" })).toBeInTheDocument();
  expect(screen.queryByText("Contenido del panel")).toBeNull();
});

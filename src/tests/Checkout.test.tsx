// @vitest-environment jsdom
import { test, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";

import { CLAVES } from "../datos/baseDatos";
import Checkout from "../paginas/tienda/Checkout";
import CompraExitosa from "../paginas/tienda/CompraExitosa";
import CompraFallida from "../paginas/tienda/CompraFallida";
import { escribir, prepararCarrito, renderConProveedores } from "./ayudantes";

// Muestra el checkout. demoraPago = 0 para que el "banco" responda al instante
function mostrarCheckout() {
  renderConProveedores(<Checkout demoraPago={0} />, {
    ruta: "/checkout",
    patron: "/checkout",
    rutasExtra: [
      { path: "/compra/exitosa/:id", element: <CompraExitosa /> },
      { path: "/compra/fallida/:id", element: <CompraFallida /> },
    ],
  });
}

// Completa los datos del cliente y la dirección
function completarDatos() {
  escribir("Nombre", "Pedro");
  escribir("Apellidos", "Soto");
  escribir("Correo", "pedro@correo.cl");
  escribir("Calle", "Los Crisantemos 123");
  escribir("Región", "O'Higgins");
  escribir("Comuna", "Rancagua");
}

// Completa los datos de la tarjeta
function completarTarjeta(numero: string, cvv = "123") {
  escribir("Número de tarjeta", numero);
  escribir("Nombre del titular", "Pedro Soto");
  escribir("Vencimiento", "12/30");
  escribir("CVV", cvv);
}

function pagar() {
  fireEvent.click(screen.getByRole("button", { name: "Pagar ahora $31.980" }));
}

// 2 sacos de alimento para perros = $31.980
const alimento = { productoId: 1, nombre: "Alimento para perros", precio: 15990, cantidad: 2, imagen: "/img/alimento-perro.webp" };

// Prueba 11 (validación): la tarjeta no puede estar vacía y debe tener los caracteres correctos
test("valida los datos de la tarjeta antes de pagar", () => {
  prepararCarrito([alimento]);
  mostrarCheckout();

  // 1) Simulamos el clic en Pagar sin completar nada
  pagar();
  expect(screen.getByText("El número de tarjeta es obligatorio")).toBeInTheDocument();
  expect(screen.getByText("El CVV es obligatorio")).toBeInTheDocument();

  // 2) Número incompleto (8 dígitos) y CVV de 2 dígitos
  completarDatos();
  completarTarjeta("4242 4242", "12");
  pagar();
  expect(screen.getByText("El número de tarjeta debe tener 16 dígitos")).toBeInTheDocument();
  expect(screen.getByText("El CVV debe tener 3 dígitos")).toBeInTheDocument();

  // Comprobamos que no se pagó: seguimos en el checkout
  expect(screen.getByRole("button", { name: "Pagar ahora $31.980" })).toBeInTheDocument();
});

// Prueba 12 (flujo de pago): con una tarjeta aprobada se paga y se genera la boleta
test("con una tarjeta aprobada se paga y se muestra la boleta", () => {
  prepararCarrito([alimento]);
  mostrarCheckout();

  // Completamos los datos y una tarjeta de prueba aprobada
  completarDatos();
  completarTarjeta("4242 4242 4242 4242");

  // Simulamos el clic en Pagar
  pagar();

  // Comprobamos que aparece la boleta con su número, total y medio de pago
  expect(screen.getByText("Boleta electrónica")).toBeInTheDocument();
  expect(screen.getByText("N° ORD-00004")).toBeInTheDocument();
  expect(screen.getByTestId("total-boleta").textContent).toBe("$31.980");
  expect(screen.getByText("Tarjeta Visa terminada en 4242 · Titular: PEDRO SOTO")).toBeInTheDocument();

  // Y que el carrito quedó vacío
  expect(JSON.parse(localStorage.getItem(CLAVES.carrito) ?? "[]")).toEqual([]);
});

// Prueba 13 (pago simulado con error): la tarjeta de prueba rechazada no paga
test("con la tarjeta rechazada muestra el error y mantiene el carrito", () => {
  prepararCarrito([alimento]);
  mostrarCheckout();

  // Usamos la tarjeta que el "banco" simulado siempre rechaza
  completarDatos();
  completarTarjeta("4000 0000 0000 0002");
  pagar();

  // Comprobamos el mensaje de pago rechazado
  expect(screen.getByRole("heading", { name: /No se pudo realizar el pago/ })).toBeInTheDocument();
  expect(screen.getByText("Motivo: La tarjeta fue rechazada por el banco emisor")).toBeInTheDocument();

  // Los productos siguen en el carrito para intentarlo de nuevo
  expect(JSON.parse(localStorage.getItem(CLAVES.carrito) ?? "[]")).toHaveLength(1);
});

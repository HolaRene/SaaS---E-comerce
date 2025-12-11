/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as archivos from "../archivos.js";
import type * as carrito from "../carrito.js";
import type * as clientes from "../clientes.js";
import type * as compras from "../compras.js";
import type * as creditos from "../creditos.js";
import type * as crons from "../crons.js";
import type * as dashboard from "../dashboard.js";
import type * as etiquetas from "../etiquetas.js";
import type * as favoritos from "../favoritos.js";
import type * as finanzas from "../finanzas.js";
import type * as herramientas from "../herramientas.js";
import type * as historial from "../historial.js";
import type * as http from "../http.js";
import type * as movimientos from "../movimientos.js";
import type * as notificaciones from "../notificaciones.js";
import type * as productoEtiquetas from "../productoEtiquetas.js";
import type * as productos from "../productos.js";
import type * as recordatorios from "../recordatorios.js";
import type * as resenas from "../resenas.js";
import type * as tiendas from "../tiendas.js";
import type * as users from "../users.js";
import type * as ventas from "../ventas.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  archivos: typeof archivos;
  carrito: typeof carrito;
  clientes: typeof clientes;
  compras: typeof compras;
  creditos: typeof creditos;
  crons: typeof crons;
  dashboard: typeof dashboard;
  etiquetas: typeof etiquetas;
  favoritos: typeof favoritos;
  finanzas: typeof finanzas;
  herramientas: typeof herramientas;
  historial: typeof historial;
  http: typeof http;
  movimientos: typeof movimientos;
  notificaciones: typeof notificaciones;
  productoEtiquetas: typeof productoEtiquetas;
  productos: typeof productos;
  recordatorios: typeof recordatorios;
  resenas: typeof resenas;
  tiendas: typeof tiendas;
  users: typeof users;
  ventas: typeof ventas;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

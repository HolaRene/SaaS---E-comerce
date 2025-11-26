/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as clientes from "../clientes.js";
import type * as creditos from "../creditos.js";
import type * as etiquetas from "../etiquetas.js";
import type * as historial from "../historial.js";
import type * as http from "../http.js";
import type * as movimientos from "../movimientos.js";
import type * as productoEtiquetas from "../productoEtiquetas.js";
import type * as productos from "../productos.js";
import type * as productosMutations from "../productosMutations.js";
import type * as recordatorios from "../recordatorios.js";
import type * as tienda from "../tienda.js";
import type * as users from "../users.js";
import type * as ventas from "../ventas.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  clientes: typeof clientes;
  creditos: typeof creditos;
  etiquetas: typeof etiquetas;
  historial: typeof historial;
  http: typeof http;
  movimientos: typeof movimientos;
  productoEtiquetas: typeof productoEtiquetas;
  productos: typeof productos;
  productosMutations: typeof productosMutations;
  recordatorios: typeof recordatorios;
  tienda: typeof tienda;
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

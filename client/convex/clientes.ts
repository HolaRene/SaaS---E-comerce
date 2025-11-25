import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Crear cliente
export const crearCliente = mutation({
  args: {
    tiendaId: v.id("tiendas"),
    nombre: v.string(),
    email: v.optional(v.string()),
    telefono: v.optional(v.string()),
    direccion: v.optional(v.string()),
    notas: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    return await ctx.db.insert("clientes", {
      tiendaId: args.tiendaId,
      nombre: args.nombre,
      email: args.email,
      telefono: args.telefono,
      direccion: args.direccion,
      notas: args.notas,
      fechaRegistro: new Date().toISOString(),
      totalCompras: 0,
      cantidadCompras: 0,
    });
  },
});

// Obtener clientes por tienda
export const getClientesByTienda = query({
  args: { tiendaId: v.id("tiendas") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("clientes")
      .withIndex("by_tienda", (q) => q.eq("tiendaId", args.tiendaId))
      .collect();
  },
});

// Buscar cliente por teléfono
export const buscarPorTelefono = query({
  args: { 
    tiendaId: v.id("tiendas"),
    telefono: v.string() 
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("clientes")
      .withIndex("by_telefono", (q) => 
        q.eq("tiendaId", args.tiendaId).eq("telefono", args.telefono)
      )
      .first();
  },
});

// Actualizar estadísticas de cliente
export const actualizarEstadisticas = mutation({
  args: {
    clienteId: v.id("clientes"),
    montoCompra: v.number(),
  },
  handler: async (ctx, args) => {
    const cliente = await ctx.db.get(args.clienteId);
    if (!cliente) throw new Error("Cliente no encontrado");

    await ctx.db.patch(args.clienteId, {
      totalCompras: cliente.totalCompras + args.montoCompra,
      cantidadCompras: cliente.cantidadCompras + 1,
      ultimaCompra: new Date().toISOString(),
    });
  },
});

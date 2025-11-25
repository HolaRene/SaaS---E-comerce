import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
// Registrar cambio en historial
export const registrarCambio = mutation({
  args: {
    productoId: v.id("productos"),
    tiendaId: v.id("tiendas"),
    tipoEvento: v.union(
      v.literal("CREADO"),
      v.literal("ACTUALIZADO"),
      v.literal("ELIMINADO"),
      v.literal("PRECIO_CAMBIADO"),
      v.literal("STOCK_AJUSTADO")
    ),
    camposModificados: v.array(v.string()),
    valoresAnteriores: v.optional(v.any()),
    valoresNuevos: v.optional(v.any()),
    descripcion: v.string(),
  },
  
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");
    
    const user = await ctx.db
      .query('usuarios')
      .filter((q) => q.eq(q.field('correo'), identity.email))
      .first();
    
    if (!user) throw new Error('Usuario no encontrado');
    
    const now = new Date().toISOString();
    
    return await ctx.db.insert("historialProductos", {
      productoId: args.productoId,
      tiendaId: args.tiendaId,
      usuarioId: user._id,
      tipoEvento: args.tipoEvento,
      camposModificados: args.camposModificados,
      valoresAnteriores: args.valoresAnteriores,
      valoresNuevos: args.valoresNuevos,
      descripcion: args.descripcion,
      fecha: now,
    });
  },
});
// Obtener historial por tienda
export const getHistorialByTienda = query({
  args: { tiendaId: v.id("tiendas"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    const historial = await ctx.db
      .query("historialProductos")
      .withIndex("by_tienda", (q) => q.eq("tiendaId", args.tiendaId))
      .order("desc") // Más recientes primero
      .take(limit);
    
    // Enriquecer con datos del producto y usuario
    return await Promise.all(
      historial.map(async (h) => {
        const producto = await ctx.db.get(h.productoId);
        const usuario = await ctx.db.get(h.usuarioId);
        
        return {
          ...h,
          productoNombre: producto?.nombre || "Producto eliminado",
          usuarioNombre: usuario?.nombre || "Usuario desconocido",
        };
      })
    );
  },
});
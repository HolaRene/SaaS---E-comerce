import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// crear etiqueta
export const crearEtiqueta = mutation({
  args: {
    nombre: v.string(),
    tiendaId: v.id("tiendas"),
    color: v.optional(v.string()),
    icono: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verificar que no exista
    const existente = await ctx.db
      .query("etiquetas")
      .withIndex("by_nombre", (q) => 
        q.eq("tiendaId", args.tiendaId).eq("nombre", args.nombre)
      )
      .first();
    
    if (existente) {
      throw new Error("Esta etiqueta ya existe");
    }
    
    return await ctx.db.insert("etiquetas", {
      nombre: args.nombre,
      tiendaId: args.tiendaId,
      color: args.color || "#6B7280",
      icono: args.icono,
      activa: true,
    });
  },
});
// obtener estadisticas de etiquetas
export const getEstadisticasEtiquetas = query({
  args: { tiendaId: v.id("tiendas") },
  handler: async (ctx, args) => {
    const etiquetas = await ctx.db
      .query("etiquetas")
      .withIndex("by_tienda", (q) => q.eq("tiendaId", args.tiendaId))
      .collect();
    
    return await Promise.all(
      etiquetas.map(async (etiqueta) => {
        const count = await ctx.db
          .query("productoEtiquetas")
          .withIndex("by_etiqueta", (q) => q.eq("etiquetaId", etiqueta._id))
          .collect();
        
        return {
          ...etiqueta,
          cantidadProductos: count.length,
        };
      })
    );
  },
});
// obtener etiquetas por tienda
export const getByTienda = query({
  args: { tiendaId: v.id("tiendas") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("etiquetas")
      .withIndex("by_tienda", (q) => q.eq("tiendaId", args.tiendaId))
      .filter((q) => q.eq(q.field("activa"), true))
      .collect();
  },
});
// obtener estadisticas de etiquetas
export const getEstadisticas = query({
  args: { tiendaId: v.id("tiendas") },
  handler: async (ctx, args) => {
    const etiquetas = await ctx.db
      .query("etiquetas")
      .withIndex("by_tienda", (q) => q.eq("tiendaId", args.tiendaId))
      .collect();
    
    return await Promise.all(
      etiquetas.map(async (etiqueta) => {
        const count = await ctx.db
          .query("productoEtiquetas")
          .withIndex("by_etiqueta", (q) => q.eq("etiquetaId", etiqueta._id))
          .collect();
        
        return {
          ...etiqueta,
          cantidadProductos: count.length,
        };
      })
    );
  },
});
// eliminar etiqueta
export const eliminarEtiqueta = mutation({
  args: { etiquetaId: v.id("etiquetas") },
  handler: async (ctx, args) => {
    // Eliminar todas las relaciones primero
    const relaciones = await ctx.db
      .query("productoEtiquetas")
      .withIndex("by_etiqueta", (q) => q.eq("etiquetaId", args.etiquetaId))
      .collect();
    
    for (const rel of relaciones) {
      await ctx.db.delete(rel._id);
    }
    
    // Eliminar la etiqueta
    await ctx.db.delete(args.etiquetaId);
  },
});
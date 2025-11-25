import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// asignar etiqueta
export const asignarEtiqueta = mutation({
  args: {
    productoId: v.id("productos"),
    etiquetaId: v.id("etiquetas"),
    tiendaId: v.id("tiendas"),
  },
  handler: async (ctx, args) => {
    // Verificar que no esté ya asignada
    const existente = await ctx.db
      .query("productoEtiquetas")
      .withIndex("by_producto_etiqueta", (q) =>
        q.eq("productoId", args.productoId).eq("etiquetaId", args.etiquetaId)
      )
      .first();
    
    if (existente) {
      throw new Error("Esta etiqueta ya está asignada");
    }
    
    return await ctx.db.insert("productoEtiquetas", {
      productoId: args.productoId,
      etiquetaId: args.etiquetaId,
      tiendaId: args.tiendaId,
      fechaAsignacion: new Date().toISOString(),
    });
  },
});
// obtener etiquetas de producto
export const getEtiquetasDeProducto = query({
  args: { productoId: v.id("productos") },
  handler: async (ctx, args) => {
    const relaciones = await ctx.db
      .query("productoEtiquetas")
      .withIndex("by_producto", (q) => q.eq("productoId", args.productoId))
      .collect();
    
    const etiquetas = await Promise.all(
      relaciones.map(async (rel) => {
        return await ctx.db.get(rel.etiquetaId);
      })
    );
    
    return etiquetas.filter(e => e !== null);
  },
});
// remover etiqueta
export const removerEtiqueta = mutation({
  args: {
    productoId: v.id("productos"),
    etiquetaId: v.id("etiquetas"),
  },
  handler: async (ctx, args) => {
    const relacion = await ctx.db
      .query("productoEtiquetas")
      .withIndex("by_producto_etiqueta", (q) =>
        q.eq("productoId", args.productoId).eq("etiquetaId", args.etiquetaId)
      )
      .first();
    
    if (relacion) {
      await ctx.db.delete(relacion._id);
    }
  },
});
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
// Registrar movimiento de inventario
export const registrarMovimiento = mutation({
  args: {
    productoId: v.id("productos"),
    tiendaId: v.id("tiendas"),
    tipo: v.union(
      v.literal("ENTRADA"),
      v.literal("SALIDA"),
      v.literal("AJUSTE"),
      v.literal("TRANSFERENCIA")
    ),
    cantidad: v.number(),
    razon: v.string(),
    notas: v.optional(v.string()),
  },
  
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");
    
    const user = await ctx.db
      .query('usuarios')
      .filter((q) => q.eq(q.field('correo'), identity.email))
      .first();
    
    if (!user) throw new Error('Usuario no encontrado');
    
    // Obtener producto actual
    const producto = await ctx.db.get(args.productoId);
    if (!producto) throw new Error("Producto no encontrado");
    
    const stockAnterior = producto.cantidad;
    const stockNuevo = stockAnterior + args.cantidad;
    
    if (stockNuevo < 0) {
      throw new Error("Stock no puede ser negativo");
    }
    
    const now = new Date().toISOString();
    
    // Registrar movimiento
    const movimientoId = await ctx.db.insert("movimientosInventario", {
      productoId: args.productoId,
      tiendaId: args.tiendaId,
      usuarioId: user._id,
      tipo: args.tipo,
      cantidad: args.cantidad,
      stockAnterior,
      stockNuevo,
      razon: args.razon,
      notas: args.notas,
      fecha: now,
    });
    
    // Actualizar stock del producto
    await ctx.db.patch(args.productoId, {
      cantidad: stockNuevo,
      ultimaActualizacion: now,
    });
    
    return movimientoId;
  },
});
// Obtener movimientos por tienda
export const getMovimientosByTienda = query({
  args: { tiendaId: v.id("tiendas"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    const movimientos = await ctx.db
      .query("movimientosInventario")
      .withIndex("by_tienda", (q) => q.eq("tiendaId", args.tiendaId))
      .order("desc")
      .take(limit);
    
    return await Promise.all(
      movimientos.map(async (m) => {
        const producto = await ctx.db.get(m.productoId);
        const usuario = await ctx.db.get(m.usuarioId);
        
        return {
          ...m,
          productoNombre: producto?.nombre || "Producto eliminado",
          usuarioNombre: usuario?.nombre || "Usuario desconocido",
        };
      })
    );
  },
});
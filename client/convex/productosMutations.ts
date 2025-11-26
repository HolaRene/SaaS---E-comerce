import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Mutation helper adicional (si se necesita en el futuro)
export const eliminarProducto = mutation({
  args: { productoId: v.id("productos") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("No autenticado");

    // Obtener usuario
    const usuario = await ctx.db
      .query("usuarios")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!usuario) throw new ConvexError("Usuario no encontrado");

    const producto = await ctx.db.get(args.productoId);
    if (!producto) throw new ConvexError("Producto no encontrado");

    const tienda = producto.tiendaId ? await ctx.db.get(producto.tiendaId) : null;
    if (!tienda) throw new ConvexError("Tienda no encontrada");

    if (String(tienda.propietario) !== String(usuario._id)) {
      throw new ConvexError("No tienes permiso para eliminar este producto");
    }

    await ctx.db.delete(args.productoId);
    return { success: true };
  },
});

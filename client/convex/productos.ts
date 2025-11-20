import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

// crear producto
export const crearProducto = mutation({
  args: {
    tiendaId: v.id("tiendas"),
    autorId: v.id("usuarios"),
    nombre: v.string(),
    descripcion: v.string(),
    precio: v.number(),
    categoria: v.string(),
    imagenes: v.array(v.string()),
    cantidad: v.number(), 
    estado: v.union(
      v.literal("activo"),
      v.literal("inactivo"),
      v.literal("agotado")
    ),


    // atributos dinámicos
    attributes: v.optional(
      v.record(
        v.string(),
        v.union(v.string(), v.number(), v.array(v.string()))
      )
    ),

    codigoBarras: v.optional(v.string()),
    sku: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new ConvexError("No autenticado este diablo falla");

    // Buscar usuario en la DB Convex
    const user = await ctx.db.query('usuarios').filter((q) => q.eq(q.field('correo'), identity.email)).collect()
        if(user.length === 0) throw new ConvexError('Usuario no encontrado')

    const newProduct = await ctx.db.insert("productos", {
      nombre:args.nombre,
      autorId:user[0]._id,
      cantidad:args.cantidad,
      categoria:args.categoria,
      descripcion:args.descripcion,
      precio:args.precio,
      tiendaId:args.
      sku:args.sku,
      attributes:{
        contenido: args.attributes?.contenido || '-',
        fechaExpiracion: args.attributes?.fechaExpiracion || '-',
        unidadMedida: args.attributes?.unidadMedida || '-',
        marca: args.attributes?.marca || '-',
        },
      puntuacionPromedio: 0,
      ventasTotales: 0,
      vistasTotales: 0,
      ultimaActualizacion: now,
      imagenes:['https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg'],
      estado:"activo",
    });

    return newProduct;
  },
});

// Obtener un productos por tienda
export const getProductosByTienda = query({
  args: { tiendaId: v.id("tiendas") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("productos")
      .withIndex("by_tienda", q => q.eq("tiendaId", args.tiendaId))
      .collect();
  },
});


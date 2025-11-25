import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

// crear producto
export const crearProducto = mutation({
  args: {
    tiendaId: v.id("tiendas"),// Opcional - se obtiene del usuario autenticado
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
      autorId:[user[0]._id],
      cantidad:args.cantidad,
      categoria:args.categoria,
      descripcion:args.descripcion,
      precio:args.precio,
      tiendaId:args.tiendaId,
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
// actualizar productos
export const actualizarProductos= mutation({
  args: {
    tiendaId: v.id("tiendas"),// Opcional - se obtiene del usuario autenticado
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
      autorId:[user[0]._id],
      cantidad:args.cantidad,
      categoria:args.categoria,
      descripcion:args.descripcion,
      precio:args.precio,
      tiendaId:args.tiendaId,
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
})
// Obtener productos con sus etiquetas
export const getProductosConEtiquetas = query({
  args: { tiendaId: v.id("tiendas") },
  handler: async (ctx, args) => {
    const productos = await ctx.db
      .query("productos")
      .withIndex("by_tienda", (q) => q.eq("tiendaId", args.tiendaId))
      .collect();
    
    // Para cada producto, obtener sus etiquetas
    return await Promise.all(
      productos.map(async (producto) => {
        // Obtener relaciones producto-etiqueta
        const relaciones = await ctx.db
          .query("productoEtiquetas")
          .withIndex("by_producto", (q) => q.eq("productoId", producto._id))
          .collect();
        
        // Obtener datos completos de cada etiqueta
        const etiquetas = await Promise.all(
          relaciones.map(async (rel) => {
            return await ctx.db.get(rel.etiquetaId);
          })
        );
        
        return {
          ...producto,
          etiquetas: etiquetas.filter(e => e !== null), // Filtrar nulls
        };
      })
    );
  },
});
// Obtener producto por etiqueta
export const getProductosPorEtiqueta = query({
  args: { 
    etiquetaId: v.id("etiquetas"),
    tiendaId: v.id("tiendas") 
  },
  handler: async (ctx, args) => {
    // Obtener todas las relaciones de esta etiqueta
    const relaciones = await ctx.db
      .query("productoEtiquetas")
      .withIndex("by_etiqueta", (q) => q.eq("etiquetaId", args.etiquetaId))
      .collect();
    
    // Obtener los productos
    const productos = await Promise.all(
      relaciones.map(async (rel) => {
        return await ctx.db.get(rel.productoId);
      })
    );
    
    return productos.filter(p => p !== null && p.tiendaId === args.tiendaId);
  },
});

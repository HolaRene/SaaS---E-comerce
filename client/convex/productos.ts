import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

// crear producto
export const crearProducto = mutation({
  args: {
    tiendaId: v.id("tiendas"),// Opcional - se obtiene del usuario autenticado
    nombre: v.string(),
    descripcion: v.string(),
    precio: v.number(),
    costo: v.optional(v.number()),
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
      costo: args.costo ?? 0,
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
      creadoEn: now,
    });

    return newProduct;
  },
});

// Rotación de inventario: entradas y salidas por producto en la tienda
export const getRotacionInventarioByTienda = query({
  args: { tiendaId: v.id("tiendas"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const productos = await ctx.db
      .query("productos")
      .withIndex("by_tienda", (q) => q.eq("tiendaId", args.tiendaId))
      .collect();

    const ahora = new Date();

    const resultados = await Promise.all(
      productos.map(async (p) => {
        // Movimientos del producto en esta tienda
        const movimientos = await ctx.db
          .query("movimientosInventario")
          .withIndex("by_producto", (q) => q.eq("productoId", p._id))
          .collect();

        // Filtrar por tienda
        const movsTienda = movimientos.filter((m) => String(m.tiendaId) === String(args.tiendaId));

        const entradas = movsTienda.filter((m) => m.tipo === "ENTRADA").reduce((s, m) => s + (m.cantidad || 0), 0);
        const salidas = movsTienda.filter((m) => m.tipo === "SALIDA").reduce((s, m) => s + (m.cantidad || 0), 0);

        // Última venta (buscar detallesVenta más reciente para este producto)
        const detalles = await ctx.db
          .query("detallesVenta")
          .withIndex("by_producto", (q) => q.eq("productoId", p._id))
          .collect();

        let ultimaFechaVenta: string | null = null;
        for (const d of detalles) {
          try {
            const venta = await ctx.db.get(d.ventaId);
            if (venta && venta.fecha) {
              if (!ultimaFechaVenta || new Date(venta.fecha) > new Date(ultimaFechaVenta)) {
                ultimaFechaVenta = venta.fecha;
              }
            }
          } catch (e) {
            // ignore
          }
        }

        const dias = ultimaFechaVenta ? Math.floor((ahora.getTime() - new Date(ultimaFechaVenta).getTime()) / (1000 * 60 * 60 * 24)) : null;

        // calcular dias desde creacion si existe creadoEn o ultimaActualizacion
        let diasDesdeCreacion: number | null = null;
        try {
          const creado = p.creadoEn || p.ultimaActualizacion || null;
          if (creado) {
            diasDesdeCreacion = Math.floor((ahora.getTime() - new Date(creado).getTime()) / (1000 * 60 * 60 * 24));
          }
        } catch (e) {
          diasDesdeCreacion = null;
        }

        return {
          producto: p.nombre,
          entradas,
          salidas,
          stock: p.cantidad || 0,
          diasEnInventario: dias,
          diasDesdeCreacion,
        };
      })
    );

    return resultados.sort((a, b) => (b.salidas || 0) - (a.salidas || 0)).slice(0, args.limit || 50);
  },
});

// Productos sin movimiento reciente (stock estancado)
export const getStockEstancadoByTienda = query({
  args: { tiendaId: v.id("tiendas"), dias: v.optional(v.number()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const threshold = args.dias ?? 14;
    const productos = await ctx.db
      .query("productos")
      .withIndex("by_tienda", (q) => q.eq("tiendaId", args.tiendaId))
      .collect();

    const ahora = new Date();

    const resultados: Array<{ producto: string; unidades: number; diasSinVenta: number | null; diasDesdeCreacion: number | null }> = [];
    for (const p of productos) {
      if (!p.cantidad || p.cantidad <= 0) continue;

      const detalles = await ctx.db
        .query("detallesVenta")
        .withIndex("by_producto", (q) => q.eq("productoId", p._id))
        .collect();

      let ultimaFechaVenta: string | null = null;
      for (const d of detalles) {
        try {
          const venta = await ctx.db.get(d.ventaId);
          if (venta && venta.fecha) {
            if (!ultimaFechaVenta || new Date(venta.fecha) > new Date(ultimaFechaVenta)) {
              ultimaFechaVenta = venta.fecha;
            }
          }
        } catch (e) {
          // ignore
        }
      }

      const diasSinVenta = ultimaFechaVenta ? Math.floor((ahora.getTime() - new Date(ultimaFechaVenta).getTime()) / (1000 * 60 * 60 * 24)) : null;

      // Calcular días desde la creación del producto si existe creadoEn, si no usar ultimaActualizacion
      let diasDesdeCreacion: number | null = null;
      try {
        const creado = p.creadoEn || p.ultimaActualizacion || null;
        if (creado) {
          diasDesdeCreacion = Math.floor((ahora.getTime() - new Date(creado).getTime()) / (1000 * 60 * 60 * 24));
        }
      } catch (e) {
        diasDesdeCreacion = null;
      }

      if ((diasSinVenta === null && threshold <= 0) || (diasSinVenta !== null && diasSinVenta >= threshold)) {
        resultados.push({ producto: p.nombre, unidades: p.cantidad, diasSinVenta, diasDesdeCreacion });
      }
    }

    return resultados.sort((a, b) => (b.diasSinVenta || 0) - (a.diasSinVenta || 0)).slice(0, args.limit || 50);
  },
});

// Comparación de precios: compara el precio del producto con el promedio por categoría
export const getComparacionPreciosByTienda = query({
  args: { tiendaId: v.id("tiendas"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const productos = await ctx.db
      .query("productos")
      .withIndex("by_tienda", (q) => q.eq("tiendaId", args.tiendaId))
      .collect();

    // Calcular promedio por categoría (en todas las tiendas)
    const allProducts = await ctx.db.query("productos").collect();
    const avgByCategoria: Record<string, { total: number; count: number }> = {};
    for (const p of allProducts) {
      const cat = p.categoria || "Sin categoría";
      if (!avgByCategoria[cat]) avgByCategoria[cat] = { total: 0, count: 0 };
      avgByCategoria[cat].total += p.precio || 0;
      avgByCategoria[cat].count += 1;
    }

    const salida = productos.map((p) => {
      const cat = p.categoria || "Sin categoría";
      const avg = avgByCategoria[cat] ? avgByCategoria[cat].total / Math.max(1, avgByCategoria[cat].count) : 0;
      return {
        producto: p.nombre,
        miPrecio: p.precio || 0,
        promedioMercado: avg,
        diferencia: (p.precio || 0) - avg,
      };
    });

    return salida.slice(0, args.limit || 50);
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
// Actualizar producto (parche parcial)
export const actualizarProducto = mutation({
  args: {
    productoId: v.id("productos"),
    datos: v.object({
      nombre: v.optional(v.string()),
      descripcion: v.optional(v.string()),
      precio: v.optional(v.number()),
      costo: v.optional(v.number()),
      categoria: v.optional(v.string()),
      imagenes: v.optional(v.array(v.string())),
      cantidad: v.optional(v.number()),
      estado: v.optional(v.union(v.literal("activo"), v.literal("inactivo"), v.literal("agotado"))),
      attributes: v.optional(v.record(v.string(), v.union(v.string(), v.number(), v.array(v.string())))),
      codigoBarras: v.optional(v.string()),
      sku: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("No autenticado");

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
      throw new ConvexError("No tienes permiso para editar este producto");
    }

    // Filtrar campos undefined
    const updateData: Record<string, any> = {};
    for (const [k, v_] of Object.entries(args.datos)) {
      if (v_ !== undefined) updateData[k] = v_;
    }

    if (Object.keys(updateData).length === 0) return { success: true };

    updateData.ultimaActualizacion = new Date().toISOString();

    await ctx.db.patch(args.productoId, updateData);
    return { success: true };
  },
});
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

// Eliminar producto (solo propietario de la tienda)
export const eliminarProducto = mutation({
  args: { productoId: v.id("productos") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const usuario = await ctx.db
      .query("usuarios")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!usuario) throw new Error("Usuario no encontrado");

    const producto = await ctx.db.get(args.productoId);
    if (!producto) throw new Error("Producto no encontrado");

    const tienda = producto.tiendaId ? await ctx.db.get(producto.tiendaId) : null;
    if (!tienda) throw new Error("Tienda no encontrada");

    if (String(tienda.propietario) !== String(usuario._id)) {
      throw new Error("No tienes permiso para eliminar este producto");
    }

    await ctx.db.delete(args.productoId);
    return { success: true };
  },
});

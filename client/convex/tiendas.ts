import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const getTiendaById = query({
  args: { id: v.id('tiendas') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const updateTienda = mutation({
  args: {
    id: v.id('tiendas'),
    nombre: v.optional(v.string()),
    descripcion: v.optional(v.string()),
    direccion: v.optional(v.string()),
    telefono: v.optional(v.string()),
    departamento: v.optional(v.string()),
    // Add other fields as needed
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args
    await ctx.db.patch(id, {
      ...fields,
      ultimaActualizacion: new Date().toISOString(),
    })
  },
})

export const deleteTienda = mutation({
  args: { id: v.id('tiendas') },
  handler: async (ctx, args) => {
    const tiendaId = args.id

    // 1. Obtener y eliminar VENTAS y sus dependencias
    const ventas = await ctx.db
      .query('ventas')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()

    for (const venta of ventas) {
      // Eliminar detalles de venta
      const detalles = await ctx.db
        .query('detallesVenta')
        .withIndex('by_venta', q => q.eq('ventaId', venta._id))
        .collect()
      for (const detalle of detalles) await ctx.db.delete(detalle._id)

      // Eliminar recordatorios de cobro
      const recordatorios = await ctx.db
        .query('recordatoriosCobro')
        .withIndex('by_venta', q => q.eq('ventaId', venta._id))
        .collect()
      for (const rec of recordatorios) await ctx.db.delete(rec._id)

      // Eliminar la venta
      await ctx.db.delete(venta._id)
    }

    // 2. Obtener y eliminar PRODUCTOS y sus dependencias
    const productos = await ctx.db
      .query('productos')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()

    for (const producto of productos) {
      // Eliminar reseñas de productos
      const resenas = await ctx.db
        .query('resenasProductos')
        .withIndex('by_producto', q => q.eq('productoId', producto._id))
        .collect()
      for (const resena of resenas) await ctx.db.delete(resena._id)

      // Eliminar el producto
      await ctx.db.delete(producto._id)
    }

    // 3. Eliminar tablas directas por tiendaId
    const tablesToDelete = [
      'clientes',
      'creditos',
      'pagosCredito',
      'movimientosInventario',
      'resenasTienda',
      'historialProductos',
      'etiquetas',
      'productoEtiquetas',
      'recordatorios',
      'clientesFrecuentes',
      // "documentos", // Excluido por solicitud
      // "hojasCalculo" // Excluido por solicitud
    ]

    // Helper para borrar por tiendaId (si la tabla tiene índice by_tienda)
    // Nota: TypeScript no inferirá dinámicamente los nombres de tabla aquí fácilmente,
    // así que lo hacemos explícito o uno por uno para seguridad de tipos.

    // Clientes
    const clientes = await ctx.db
      .query('clientes')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const c of clientes) await ctx.db.delete(c._id)

    // Creditos
    const creditos = await ctx.db
      .query('creditos')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const c of creditos) await ctx.db.delete(c._id)

    // PagosCredito
    const pagos = await ctx.db
      .query('pagosCredito')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const p of pagos) await ctx.db.delete(p._id)

    // MovimientosInventario
    const movimientos = await ctx.db
      .query('movimientosInventario')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const m of movimientos) await ctx.db.delete(m._id)

    // ResenasTienda
    const resenasT = await ctx.db
      .query('resenasTienda')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const r of resenasT) await ctx.db.delete(r._id)

    // HistorialProductos
    const historial = await ctx.db
      .query('historialProductos')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const h of historial) await ctx.db.delete(h._id)

    // Etiquetas
    const etiquetas = await ctx.db
      .query('etiquetas')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const e of etiquetas) await ctx.db.delete(e._id)

    // ProductoEtiquetas
    const prodEtiquetas = await ctx.db
      .query('productoEtiquetas')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const pe of prodEtiquetas) await ctx.db.delete(pe._id)

    // Recordatorios
    const recordatorios = await ctx.db
      .query('recordatorios')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const r of recordatorios) await ctx.db.delete(r._id)

    // ClientesFrecuentes
    const clientesF = await ctx.db
      .query('clientesFrecuentes')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const cf of clientesF) await ctx.db.delete(cf._id)

    // 4. Eliminar la tienda
    await ctx.db.delete(tiendaId)
  },
})

// ==========================================
// QUERIES PARA MARKETPLACE PÚBLICO
// ==========================================

/**
 * Obtiene todas las tiendas públicas activas o pendientes
 * Para mostrar en el marketplace de usuarios
 */
export const getTiendasPublicas = query({
  args: {},
  handler: async ctx => {
    const tiendas = await ctx.db
      .query('tiendas')
      .withIndex('by_publica', q => q.eq('publica', true))
      .filter(q =>
        q.or(
          q.eq(q.field('estado'), 'activo'),
          q.eq(q.field('estado'), 'pendiente')
        )
      )
      .collect()

    return tiendas
  },
})
// Obtener tienda por busqueda
// export const getPodcastBySearch = query({
//   args: {
//     search: v.string(),
//   },
//   handler: async (ctx, args) => {
//     if (args.search === "") {
//       return await ctx.db.query("podcasts").order("desc").collect();
//     }

//     // Intentar búsqueda por autor primero
//     const authorSearch = await ctx.db
//       .query("podcasts")
//       .withSearchIndex("search_author", (q) => q.search("author", args.search))
//       .take(10);

//     if (authorSearch.length > 0) {
//       return authorSearch;
//     }

//     // Intentar búsqueda por título
//     const titleSearch = await ctx.db
//       .query("podcasts")
//       .withSearchIndex("search_title", (q) => q.search("podcastTitle", args.search))
//       .take(10);

//     if (titleSearch.length > 0) {
//       return titleSearch;
//     }

//     // Finalmente, búsqueda por descripción
//     return await ctx.db
//       .query("podcasts")
//       .withSearchIndex("search_body", (q) => q.search("podcastDescription", args.search))
//       .take(10);
//   },
// });

/**
 * Obtiene una tienda pública por ID
 * Retorna si es pública y está activa o pendiente
 */
export const getTiendaPublicaById = query({
  args: { id: v.id('tiendas') },
  handler: async (ctx, args) => {
    const tienda = await ctx.db.get(args.id)

    // Solo retornar si es pública y activa/pendiente
    if (
      !tienda ||
      !tienda.publica ||
      (tienda.estado !== 'activo' && tienda.estado !== 'pendiente')
    ) {
      return null
    }

    return tienda
  },
})

/**
 * Obtiene productos públicos de una tienda
 * Solo productos activos y públicos
 */
export const getProductosPublicosByTienda = query({
  args: { tiendaId: v.id('tiendas') },
  handler: async (ctx, args) => {
    const productos = await ctx.db
      .query('productos')
      .withIndex('by_tienda_publica', q =>
        q.eq('tiendaId', args.tiendaId).eq('publica', true)
      )
      .filter(q => q.eq(q.field('estado'), 'activo'))
      .collect()

    return productos
  },
})

/**
 * Obtiene reseñas activas de una tienda
 */
export const getResenasPublicasByTienda = query({
  args: { tiendaId: v.id('tiendas') },
  handler: async (ctx, args) => {
    const resenas = await ctx.db
      .query('resenasTienda')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .filter(q => q.eq(q.field('estado'), 'activa'))
      .collect()

    // Obtener información de los clientes para cada reseña
    const resenasConCliente = await Promise.all(
      resenas.map(async resena => {
        const cliente = await ctx.db.get(resena.clienteId)
        return {
          ...resena,
          clienteNombre: cliente?.nombre || 'Usuario',
          clienteImagen: cliente?.imgUrl || '/placeholder.svg',
        }
      })
    )

    return resenasConCliente
  },
})

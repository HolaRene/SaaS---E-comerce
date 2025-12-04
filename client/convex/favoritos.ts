import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { Id } from './_generated/dataModel'

// ==================== QUERIES - TIENDAS ====================

/**
 * Obtener tiendas favoritas de un usuario
 */
export const getFavoritosTiendasByUsuario = query({
  args: { usuarioId: v.id('usuarios') },
  handler: async (ctx, args) => {
    const favoritos = await ctx.db
      .query('favoritosTiendas')
      .withIndex('by_usuario', q => q.eq('usuarioId', args.usuarioId))
      .collect()

    // Enriquecer con información de la tienda
    const tiendasFavoritas = await Promise.all(
      favoritos.map(async fav => {
        const tienda = await ctx.db.get(fav.tiendaId)
        if (!tienda) return null

        return {
          ...tienda,
          fechaAgregado: fav.fechaAgregado,
          favoritoId: fav._id,
        }
      })
    )

    // Filtrar tiendas que ya no existen
    return tiendasFavoritas.filter(t => t !== null)
  },
})

/**
 * Verificar si una tienda es favorita
 */
export const isTiendaFavorita = query({
  args: {
    usuarioId: v.id('usuarios'),
    tiendaId: v.id('tiendas'),
  },
  handler: async (ctx, args) => {
    const favorito = await ctx.db
      .query('favoritosTiendas')
      .withIndex('by_usuario_tienda', q =>
        q.eq('usuarioId', args.usuarioId).eq('tiendaId', args.tiendaId)
      )
      .first()

    return favorito !== null
  },
})

// ==================== QUERIES - PRODUCTOS ====================

/**
 * Obtener productos favoritos de un usuario
 */
export const getFavoritosProductosByUsuario = query({
  args: { usuarioId: v.id('usuarios') },
  handler: async (ctx, args) => {
    const favoritos = await ctx.db
      .query('favoritosProductos')
      .withIndex('by_usuario', q => q.eq('usuarioId', args.usuarioId))
      .collect()

    // Enriquecer con información del producto y tienda
    const productosFavoritos = await Promise.all(
      favoritos.map(async fav => {
        const producto = await ctx.db.get(fav.productoId)
        if (!producto) return null

        const tienda = await ctx.db.get(fav.tiendaId)

        return {
          ...producto,
          nombreTienda: tienda?.nombre || 'Tienda desconocida',
          fechaAgregado: fav.fechaAgregado,
          favoritoId: fav._id,
        }
      })
    )

    // Filtrar productos que ya no existen
    return productosFavoritos.filter(p => p !== null)
  },
})

/**
 * Verificar si un producto es favorito
 */
export const isProductoFavorito = query({
  args: {
    usuarioId: v.id('usuarios'),
    productoId: v.id('productos'),
  },
  handler: async (ctx, args) => {
    const favorito = await ctx.db
      .query('favoritosProductos')
      .withIndex('by_usuario_producto', q =>
        q.eq('usuarioId', args.usuarioId).eq('productoId', args.productoId)
      )
      .first()

    return favorito !== null
  },
})

// ==================== MUTATIONS - TIENDAS ====================

/**
 * Agregar tienda a favoritos
 */
export const agregarTiendaFavorita = mutation({
  args: {
    usuarioId: v.id('usuarios'),
    tiendaId: v.id('tiendas'),
  },
  handler: async (ctx, args) => {
    // Verificar si ya existe
    const existente = await ctx.db
      .query('favoritosTiendas')
      .withIndex('by_usuario_tienda', q =>
        q.eq('usuarioId', args.usuarioId).eq('tiendaId', args.tiendaId)
      )
      .first()

    if (existente) {
      throw new Error('Esta tienda ya está en tus favoritos')
    }

    // Verificar que la tienda existe
    const tienda = await ctx.db.get(args.tiendaId)
    if (!tienda) {
      throw new Error('Tienda no encontrada')
    }

    const favoritoId = await ctx.db.insert('favoritosTiendas', {
      usuarioId: args.usuarioId,
      tiendaId: args.tiendaId,
      fechaAgregado: new Date().toISOString(),
    })

    return favoritoId
  },
})

/**
 * Eliminar tienda de favoritos
 */
export const eliminarTiendaFavorita = mutation({
  args: {
    usuarioId: v.id('usuarios'),
    tiendaId: v.id('tiendas'),
  },
  handler: async (ctx, args) => {
    const favorito = await ctx.db
      .query('favoritosTiendas')
      .withIndex('by_usuario_tienda', q =>
        q.eq('usuarioId', args.usuarioId).eq('tiendaId', args.tiendaId)
      )
      .first()

    if (!favorito) {
      throw new Error('Esta tienda no está en tus favoritos')
    }

    await ctx.db.delete(favorito._id)
    return favorito._id
  },
})

// ==================== MUTATIONS - PRODUCTOS ====================

/**
 * Agregar producto a favoritos
 */
export const agregarProductoFavorito = mutation({
  args: {
    usuarioId: v.id('usuarios'),
    productoId: v.id('productos'),
  },
  handler: async (ctx, args) => {
    // Verificar si ya existe
    const existente = await ctx.db
      .query('favoritosProductos')
      .withIndex('by_usuario_producto', q =>
        q.eq('usuarioId', args.usuarioId).eq('productoId', args.productoId)
      )
      .first()

    if (existente) {
      throw new Error('Este producto ya está en tus favoritos')
    }

    // Verificar que el producto existe y obtener su tienda
    const producto = await ctx.db.get(args.productoId)
    if (!producto) {
      throw new Error('Producto no encontrado')
    }

    const favoritoId = await ctx.db.insert('favoritosProductos', {
      usuarioId: args.usuarioId,
      productoId: args.productoId,
      tiendaId: producto.tiendaId,
      fechaAgregado: new Date().toISOString(),
    })

    return favoritoId
  },
})

/**
 * Eliminar producto de favoritos
 */
export const eliminarProductoFavorito = mutation({
  args: {
    usuarioId: v.id('usuarios'),
    productoId: v.id('productos'),
  },
  handler: async (ctx, args) => {
    const favorito = await ctx.db
      .query('favoritosProductos')
      .withIndex('by_usuario_producto', q =>
        q.eq('usuarioId', args.usuarioId).eq('productoId', args.productoId)
      )
      .first()

    if (!favorito) {
      throw new Error('Este producto no está en tus favoritos')
    }

    await ctx.db.delete(favorito._id)
    return favorito._id
  },
})

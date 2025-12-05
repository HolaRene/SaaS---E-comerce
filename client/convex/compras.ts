import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { Id } from './_generated/dataModel'

// ==================== QUERIES ====================

/**
 * Obtener todas las compras de un usuario
 */
export const getComprasByUsuario = query({
  args: { usuarioId: v.id('usuarios') },
  handler: async (ctx, args) => {
    const compras = await ctx.db
      .query('compras')
      .withIndex('by_usuario', q => q.eq('usuarioId', args.usuarioId))
      .order('desc')
      .collect()

    // Enriquecer con información de la tienda
    const comprasConTienda = await Promise.all(
      compras.map(async compra => {
        const tienda = await ctx.db.get(compra.tiendaId)
        return {
          ...compra,
          nombreTienda: tienda?.nombre || 'Tienda desconocida',
        }
      })
    )

    return comprasConTienda
  },
})

/**
 * Obtener detalles de una compra específica
 */
export const getCompraById = query({
  args: { compraId: v.id('compras') },
  handler: async (ctx, args) => {
    const compra = await ctx.db.get(args.compraId)
    if (!compra) return null

    const tienda = await ctx.db.get(compra.tiendaId)

    return {
      ...compra,
      nombreTienda: tienda?.nombre || 'Tienda desconocida',
    }
  },
})

/**
 * Obtener items/detalles de una compra
 */
export const getDetallesCompra = query({
  args: { compraId: v.id('compras') },
  handler: async (ctx, args) => {
    const detalles = await ctx.db
      .query('detallesCompra')
      .withIndex('by_compra', q => q.eq('compraId', args.compraId))
      .collect()

    return detalles
  },
})

/**
 * Obtener estadísticas de compras del usuario
 */
export const getEstadisticasCompras = query({
  args: { usuarioId: v.id('usuarios') },
  handler: async (ctx, args) => {
    const compras = await ctx.db
      .query('compras')
      .withIndex('by_usuario', q => q.eq('usuarioId', args.usuarioId))
      .collect()

    const totalCompras = compras.length
    const totalGastado = compras.reduce((sum, c) => sum + c.total, 0)

    const comprasPendientes = compras.filter(
      c => c.estado === 'pendiente' || c.estado === 'en_preparacion'
    ).length

    const comprasEntregadas = compras.filter(
      c => c.estado === 'entregado'
    ).length

    return {
      totalCompras,
      totalGastado,
      comprasPendientes,
      comprasEntregadas,
      promedioGasto: totalCompras > 0 ? totalGastado / totalCompras : 0,
    }
  },
})

// ==================== MUTATIONS ====================

/**
 * Crear una nueva compra con sus detalles
 */
export const crearCompra = mutation({
  args: {
    usuarioId: v.id('usuarios'),
    tiendaId: v.id('tiendas'),
    numeroOrden: v.string(),
    subtotal: v.number(),
    costoEnvio: v.number(),
    total: v.number(),
    metodoPago: v.union(
      v.literal('efectivo'),
      v.literal('tarjeta'),
      v.literal('transferencia'),
      v.literal('fiado')
    ),
    direccionEntrega: v.string(),
    notas: v.optional(v.string()),
    items: v.array(
      v.object({
        productoId: v.id('productos'),
        nombreProducto: v.string(),
        cantidad: v.number(),
        precioUnitario: v.number(),
        subtotal: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { items, ...compraData } = args

    // Crear la compra
    const compraId = await ctx.db.insert('compras', {
      ...compraData,
      fecha: new Date().toISOString(),
      estado: 'pendiente',
    })

    // Crear los detalles de la compra
    for (const item of items) {
      await ctx.db.insert('detallesCompra', {
        compraId,
        productoId: item.productoId,
        nombreProducto: item.nombreProducto,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal: item.subtotal,
      })
    }

    return compraId
  },
})

/**
 * Actualizar el estado de una compra
 */
export const actualizarEstadoCompra = mutation({
  args: {
    compraId: v.id('compras'),
    estado: v.union(
      v.literal('pendiente'),
      v.literal('en_preparacion'),
      v.literal('enviado'),
      v.literal('entregado'),
      v.literal('cancelado')
    ),
    fechaEntrega: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { compraId, estado, fechaEntrega } = args

    await ctx.db.patch(compraId, {
      estado,
      ...(fechaEntrega && { fechaEntrega }),
    })

    return compraId
  },
})

/**
 * Cancelar una compra
 */
export const cancelarCompra = mutation({
  args: {
    compraId: v.id('compras'),
  },
  handler: async (ctx, args) => {
    const compra = await ctx.db.get(args.compraId)

    if (!compra) {
      throw new Error('Compra no encontrada')
    }

    // Solo se pueden cancelar compras pendientes o en preparación
    if (compra.estado !== 'pendiente' && compra.estado !== 'en_preparacion') {
      throw new Error(
        'Solo se pueden cancelar compras pendientes o en preparación'
      )
    }

    await ctx.db.patch(args.compraId, {
      estado: 'cancelado',
    })

    return args.compraId
  },
})

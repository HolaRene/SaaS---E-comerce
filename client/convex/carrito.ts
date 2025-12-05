import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// ==================== QUERIES ====================

/**
 * Obtener todos los items del carrito del usuario con datos del producto y tienda
 */
export const getCarritoByUsuario = query({
  args: { usuarioId: v.id('usuarios') },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query('carrito')
      .withIndex('by_usuario', q => q.eq('usuarioId', args.usuarioId))
      .collect()

    // Enriquecer con datos del producto y tienda
    const enrichedItems = await Promise.all(
      items.map(async item => {
        const producto = await ctx.db.get(item.productoId)
        const tienda = await ctx.db.get(item.tiendaId)

        return {
          ...item,
          producto: producto
            ? {
                _id: producto._id,
                nombre: producto.nombre,
                imagen: producto.imagenes?.[0] || null,
                precio: producto.precio,
                cantidad: producto.cantidad, // Stock disponible
                estado: producto.estado,
              }
            : null,
          tienda: tienda
            ? {
                _id: tienda._id,
                nombre: tienda.nombre,
                avatar: tienda.avatar,
              }
            : null,
        }
      })
    )

    return enrichedItems.filter(item => item.producto !== null)
  },
})

/**
 * Contar cuántos items tiene el usuario en su carrito
 */
export const countCarritoItems = query({
  args: { usuarioId: v.id('usuarios') },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query('carrito')
      .withIndex('by_usuario', q => q.eq('usuarioId', args.usuarioId))
      .collect()

    // Contar la suma de cantidades
    return items.reduce((total, item) => total + item.cantidad, 0)
  },
})

/**
 * Verificar si un producto ya está en el carrito
 */
export const isProductoEnCarrito = query({
  args: {
    usuarioId: v.id('usuarios'),
    productoId: v.id('productos'),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db
      .query('carrito')
      .withIndex('by_usuario_producto', q =>
        q.eq('usuarioId', args.usuarioId).eq('productoId', args.productoId)
      )
      .first()

    return item !== null
  },
})

// ==================== MUTATIONS ====================

/**
 * Agregar producto al carrito (si ya existe, incrementa cantidad)
 */
export const agregarAlCarrito = mutation({
  args: {
    usuarioId: v.id('usuarios'),
    productoId: v.id('productos'),
    cantidad: v.number(),
  },
  handler: async (ctx, args) => {
    // Validar que el producto existe y está activo
    const producto = await ctx.db.get(args.productoId)
    if (!producto) {
      throw new Error('Producto no encontrado')
    }
    if (producto.estado !== 'activo') {
      throw new Error('Este producto no está disponible')
    }
    if (producto.cantidad < args.cantidad) {
      throw new Error(
        `Solo hay ${producto.cantidad} unidades disponibles de este producto`
      )
    }

    // Verificar si ya está en el carrito
    const existingItem = await ctx.db
      .query('carrito')
      .withIndex('by_usuario_producto', q =>
        q.eq('usuarioId', args.usuarioId).eq('productoId', args.productoId)
      )
      .first()

    if (existingItem) {
      // Validar stock para la cantidad total
      const nuevaCantidad = existingItem.cantidad + args.cantidad
      if (producto.cantidad < nuevaCantidad) {
        throw new Error(
          `Solo hay ${producto.cantidad} unidades disponibles. Ya tienes ${existingItem.cantidad} en tu carrito.`
        )
      }

      // Actualizar cantidad existente
      await ctx.db.patch(existingItem._id, {
        cantidad: nuevaCantidad,
        precioUnitario: producto.precio, // Actualizar al precio actual
      })

      return { action: 'updated', itemId: existingItem._id }
    }

    // Crear nuevo item en el carrito
    const itemId = await ctx.db.insert('carrito', {
      usuarioId: args.usuarioId,
      productoId: args.productoId,
      tiendaId: producto.tiendaId,
      cantidad: args.cantidad,
      precioUnitario: producto.precio,
      fechaAgregado: new Date().toISOString(),
    })

    return { action: 'created', itemId }
  },
})

/**
 * Actualizar cantidad de un item en el carrito
 */
export const actualizarCantidad = mutation({
  args: {
    itemId: v.id('carrito'),
    cantidad: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.cantidad < 1) {
      throw new Error('La cantidad debe ser al menos 1')
    }

    const item = await ctx.db.get(args.itemId)
    if (!item) {
      throw new Error('Item no encontrado en el carrito')
    }

    // Validar stock
    const producto = await ctx.db.get(item.productoId)
    if (!producto) {
      throw new Error('Producto no encontrado')
    }
    if (producto.cantidad < args.cantidad) {
      throw new Error(`Solo hay ${producto.cantidad} unidades disponibles`)
    }

    await ctx.db.patch(args.itemId, {
      cantidad: args.cantidad,
      precioUnitario: producto.precio, // Actualizar precio al actual
    })

    return { success: true }
  },
})

/**
 * Eliminar un item del carrito
 */
export const eliminarDelCarrito = mutation({
  args: { itemId: v.id('carrito') },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId)
    if (!item) {
      throw new Error('Item no encontrado en el carrito')
    }

    await ctx.db.delete(args.itemId)
    return { success: true }
  },
})

/**
 * Vaciar todo el carrito del usuario
 */
export const vaciarCarrito = mutation({
  args: { usuarioId: v.id('usuarios') },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query('carrito')
      .withIndex('by_usuario', q => q.eq('usuarioId', args.usuarioId))
      .collect()

    await Promise.all(items.map(item => ctx.db.delete(item._id)))

    return { deletedCount: items.length }
  },
})

/**
 * Vaciar carrito de una tienda específica
 */
export const vaciarCarritoPorTienda = mutation({
  args: {
    usuarioId: v.id('usuarios'),
    tiendaId: v.id('tiendas'),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query('carrito')
      .withIndex('by_usuario_tienda', q =>
        q.eq('usuarioId', args.usuarioId).eq('tiendaId', args.tiendaId)
      )
      .collect()

    await Promise.all(items.map(item => ctx.db.delete(item._id)))

    return { deletedCount: items.length }
  },
})

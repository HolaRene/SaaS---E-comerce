// convex/notificaciones.ts
import { v, ConvexError } from 'convex/values'
import { internalMutation, mutation, query } from './_generated/server'
import { Id } from './_generated/dataModel'

export const crearNotificacionesParaFavoritos = internalMutation({
  args: {
    tipo: v.union(
      v.literal('nuevo_producto'),
      v.literal('precio_bajado'),
      v.literal('precio_subido'),
      v.literal('producto_actualizado'),
      v.literal('producto_eliminado'),
      v.literal('tienda_nombre_cambiado'),
      v.literal('tienda_datos_actualizados'),
      v.literal('sistema')
    ),
    tiendaId: v.optional(v.id('tiendas')),
    productoId: v.optional(v.id('productos')),
    datos: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const prioridades = {
      precio_bajado: 'alta',
      precio_subido: 'media',
      nuevo_producto: 'media',
      producto_eliminado: 'alta',
      tienda_nombre_cambiado: 'baja',
      tienda_datos_actualizados: 'baja',
      sistema: 'baja',
    } as const

    const usuariosIds = new Set<Id<'usuarios'>>()

    // Obtener usuarios que siguen la TIENDA
    if (args.tiendaId) {
      const favTiendas = await ctx.db
        .query('favoritosTiendas')
        .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
        .collect()
      favTiendas.forEach(f => usuariosIds.add(f.usuarioId))
    }

    // Obtener usuarios que siguen el PRODUCTO específico
    if (args.productoId) {
      const favProductos = await ctx.db
        .query('favoritosProductos')
        .withIndex('by_producto', q => q.eq('productoId', args.productoId))
        .collect()
      favProductos.forEach(f => usuariosIds.add(f.usuarioId))
    }

    if (usuariosIds.size === 0) return

    // Crear notificaciones
    for (const usuarioId of usuariosIds) {
      let titulo = ''
      let mensaje = ''
      let url = undefined as string | undefined

      switch (args.tipo) {
        case 'nuevo_producto':
          titulo = `Nuevo producto en ${args.datos?.nombreTienda}`
          mensaje = `${args.datos?.nombreProducto} - $${args.datos?.precio}`
          url = `/tienda/${args.tiendaId}/producto/${args.productoId}`
          break
        case 'precio_bajado':
          titulo = `¡Precio bajado! ${args.datos?.nombreProducto}`
          mensaje = `Ahora $${args.datos?.precioNuevo} (antes $${args.datos?.precioAntiguo})`
          url = `/tienda/${args.tiendaId}/producto/${args.productoId}`
          break
        case 'precio_subido':
          titulo = `Precio aumentado ${args.datos?.nombreProducto}`
          mensaje = `De $${args.datos?.precioAntiguo} a $${args.datos?.precioNuevo}`
          url = `/tienda/${args.tiendaId}/producto/${args.productoId}`
          break
        case 'producto_eliminado':
          titulo = `Producto ya no disponible`
          mensaje = `${args.datos?.nombreProducto} fue eliminado`
          url = `/tienda/${args.tiendaId}`
          break
        case 'tienda_nombre_cambiado':
          titulo = `Tienda actualizó su nombre`
          mensaje = `${args.datos?.nombreAntiguo} → ${args.datos?.nombreNuevo}`
          url = `/tienda/${args.tiendaId}`
          break
        case 'tienda_datos_actualizados':
          titulo = `Tienda actualizada`
          mensaje = `${args.datos?.nombreTienda} modificó sus datos`
          url = `/tienda/${args.tiendaId}`
          break
      }

      await ctx.db.insert('notificaciones', {
        usuarioId,
        tipo: args.tipo,
        titulo,
        mensaje,
        url,
        prioridad: prioridades[args.tipo],
        tiendaId: args.tiendaId,
        productoId: args.productoId,
        leido: false,
        datos: args.datos,
      })
      // No cleanup here to avoid performance bottleneck
    }
  },
})

export const limpiarNotificacionesAntiguas = internalMutation({
  args: {},
  handler: async ctx => {
    // Delete notifications older than 30 days
    const now = Date.now()
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000

    // Get the oldest 100 notifications (default order is by creation time ascending)
    const candidates = await ctx.db.query('notificaciones').take(100)

    if (candidates.length === 0) return

    // Filter those that are actually old
    const toDelete = candidates.filter(n => n._creationTime < thirtyDaysAgo)

    for (const notif of toDelete) {
      await ctx.db.delete(notif._id)
    }

    if (toDelete.length > 0) {
      console.log(`Deleted ${toDelete.length} old notifications`)
    }
  },
})

// ==================== QUERIES PARA FRONTEND ====================

// Obtener mis notificaciones
export const getMisNotificaciones = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []

    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .first()

    if (!usuario) return []

    const notificaciones = await ctx.db
      .query('notificaciones')
      .withIndex('by_usuario', q => q.eq('usuarioId', usuario._id))
      .order('desc')
      .take(50) // Límite de 50 para la vista

    return notificaciones
  },
})

// Contar no leídas
export const getUnreadCount = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return 0

    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .first()

    if (!usuario) return 0

    const unread = await ctx.db
      .query('notificaciones')
      .withIndex('by_usuario_leido', q =>
        q.eq('usuarioId', usuario._id).eq('leido', false)
      )
      .collect()

    return unread.length
  },
})

// Marcar como leída
export const marcarLeido = mutation({
  args: { id: v.id('notificaciones') },
  handler: async (ctx, args) => {
    // Validar usuario (opcional pero recomendado)
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('No autenticado')

    await ctx.db.patch(args.id, { leido: true })
  },
})

// Marcar como NO leída (Toggle)
export const marcarNoLeido = mutation({
  args: { id: v.id('notificaciones') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('No autenticado')

    await ctx.db.patch(args.id, { leido: false })
  },
})

// Marcar todas como leídas
export const marcarTodasLeidas = mutation({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('No autenticado')

    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .first()

    if (!usuario) return

    const unread = await ctx.db
      .query('notificaciones')
      .withIndex('by_usuario_leido', q =>
        q.eq('usuarioId', usuario._id).eq('leido', false)
      )
      .collect()

    for (const notif of unread) {
      await ctx.db.patch(notif._id, { leido: true })
    }
  },
})

// Eliminar notificación
export const eliminarNotificacion = mutation({
  args: { id: v.id('notificaciones') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('No autenticado')
    await ctx.db.delete(args.id)
  },
})

// convex/notificaciones.ts
import { v } from 'convex/values'
import { internalMutation } from './_generated/server'
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

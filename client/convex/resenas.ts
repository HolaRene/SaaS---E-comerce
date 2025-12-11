import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { ConvexError } from 'convex/values'

// ==================== PRODUCTOS ====================

export const getResenasProducto = query({
  args: {
    productoId: v.id('productos'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20
    const resenas = await ctx.db
      .query('resenasProductos')
      .withIndex('by_producto', q => q.eq('productoId', args.productoId))
      .order('desc')
      .take(limit)

    const resenasConUsuario = await Promise.all(
      resenas.map(async r => {
        const usuario = await ctx.db.get(r.clienteId)
        return {
          ...r,
          usuario: {
            nombre: usuario?.nombre || 'Usuario',
            apellido: usuario?.apellido || '',
            avatar: usuario?.imgUrl || '/placeholder.svg',
          },
        }
      })
    )

    return resenasConUsuario
  },
})

export const crearResenaProducto = mutation({
  args: {
    productoId: v.id('productos'),
    calificacion: v.number(),
    comentario: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Debes iniciar sesión para comentar')

    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .first()

    if (!usuario) throw new ConvexError('Usuario no encontrado')

    const existente = await ctx.db
      .query('resenasProductos')
      .withIndex('by_cliente_producto', q =>
        q.eq('clienteId', usuario._id).eq('productoId', args.productoId)
      )
      .first()

    if (existente) {
      throw new ConvexError('Ya has publicado una reseña para este producto')
    }

    await ctx.db.insert('resenasProductos', {
      clienteId: usuario._id,
      productoId: args.productoId,
      calificacion: args.calificacion,
      comentario: args.comentario,
      fecha: new Date().toISOString(),
      estado: 'activa',
    })

    const todasResenas = await ctx.db
      .query('resenasProductos')
      .withIndex('by_producto', q => q.eq('productoId', args.productoId))
      .collect()

    const suma = todasResenas.reduce((acc, curr) => acc + curr.calificacion, 0)
    const promedio = suma / (todasResenas.length || 1)

    await ctx.db.patch(args.productoId, {
      puntuacionPromedio: parseFloat(promedio.toFixed(1)),
    })
  },
})

export const getEstadisticasResenasProducto = query({
  args: { productoId: v.id('productos') },
  handler: async (ctx, args) => {
    const resenas = await ctx.db
      .query('resenasProductos')
      .withIndex('by_producto', q => q.eq('productoId', args.productoId))
      .collect()

    const total = resenas.length
    const distribucion = [0, 0, 0, 0, 0]

    resenas.forEach(r => {
      const i = Math.min(Math.max(Math.floor(r.calificacion), 1), 5) - 1
      distribucion[i]++
    })

    return {
      total,
      distribucion,
      promedio:
        total > 0 ? resenas.reduce((a, b) => a + b.calificacion, 0) / total : 0,
    }
  },
})

export const getResenaUsuarioProducto = query({
  args: { productoId: v.id('productos') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .first()

    if (!usuario) return null

    return await ctx.db
      .query('resenasProductos')
      .withIndex('by_cliente_producto', q =>
        q.eq('clienteId', usuario._id).eq('productoId', args.productoId)
      )
      .first()
  },
})

export const editarResenaProducto = mutation({
  args: {
    resenaId: v.id('resenasProductos'),
    calificacion: v.number(),
    comentario: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Debes iniciar sesión')

    const resena = await ctx.db.get(args.resenaId)
    if (!resena) throw new ConvexError('Reseña no encontrada')

    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .first()

    if (!usuario || resena.clienteId !== usuario._id) {
      throw new ConvexError('No tienes permiso para editar esta reseña')
    }

    await ctx.db.patch(args.resenaId, {
      calificacion: args.calificacion,
      comentario: args.comentario,
      fecha: new Date().toISOString(),
    })

    const todasResenas = await ctx.db
      .query('resenasProductos')
      .withIndex('by_producto', q => q.eq('productoId', resena.productoId))
      .collect()

    const suma = todasResenas.reduce((acc, curr) => acc + curr.calificacion, 0)
    const promedio = suma / (todasResenas.length || 1)

    await ctx.db.patch(resena.productoId, {
      puntuacionPromedio: parseFloat(promedio.toFixed(1)),
    })
  },
})

// ==================== TIENDAS ====================

export const crearResenaTienda = mutation({
  args: {
    tiendaId: v.id('tiendas'),
    calificacion: v.number(),
    comentario: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Debes iniciar sesión')

    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .first()

    if (!usuario) throw new ConvexError('Usuario no encontrado')

    const existente = await ctx.db
      .query('resenasTienda')
      .withIndex('by_cliente_tienda', q =>
        q.eq('clienteId', usuario._id).eq('tiendaId', args.tiendaId)
      )
      .first()

    if (existente) throw new ConvexError('Ya has calificado esta tienda')

    await ctx.db.insert('resenasTienda', {
      clienteId: usuario._id,
      tiendaId: args.tiendaId,
      calificacion: args.calificacion,
      comentario: args.comentario,
      fecha: new Date().toISOString(),
      estado: 'activa',
    })

    const resenas = await ctx.db
      .query('resenasTienda')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .collect()

    const suma = resenas.reduce((acc, r) => acc + r.calificacion, 0)
    const promedio = suma / resenas.length

    await ctx.db.patch(args.tiendaId, {
      puntuacion: parseFloat(promedio.toFixed(1)),
    })
  },
})

export const getResenaUsuarioTienda = query({
  args: { tiendaId: v.id('tiendas') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .first()

    if (!usuario) return null

    return await ctx.db
      .query('resenasTienda')
      .withIndex('by_cliente_tienda', q =>
        q.eq('clienteId', usuario._id).eq('tiendaId', args.tiendaId)
      )
      .first()
  },
})

export const editarResenaTienda = mutation({
  args: {
    resenaId: v.id('resenasTienda'),
    calificacion: v.number(),
    comentario: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Debes iniciar sesión')

    const resena = await ctx.db.get(args.resenaId)
    if (!resena) throw new ConvexError('Reseña no encontrada')

    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .first()

    if (!usuario || resena.clienteId !== usuario._id) {
      throw new ConvexError('No tienes permiso para editar esta reseña')
    }

    await ctx.db.patch(args.resenaId, {
      calificacion: args.calificacion,
      comentario: args.comentario,
      fecha: new Date().toISOString(),
    })

    const resenas = await ctx.db
      .query('resenasTienda')
      .withIndex('by_tienda', q => q.eq('tiendaId', resena.tiendaId))
      .collect()

    const suma = resenas.reduce((acc, r) => acc + r.calificacion, 0)
    const promedio = suma / resenas.length

    await ctx.db.patch(resena.tiendaId, {
      puntuacion: parseFloat(promedio.toFixed(1)),
    })
  },
})

export const getResenasTienda = query({
  args: {
    tiendaId: v.id('tiendas'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20
    const resenas = await ctx.db
      .query('resenasTienda')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .order('desc')
      .take(limit)

    const resenasConUsuario = await Promise.all(
      resenas.map(async r => {
        const usuario = await ctx.db.get(r.clienteId)
        return {
          ...r,
          usuario: {
            nombre: usuario?.nombre || 'Usuario',
            apellido: usuario?.apellido || '',
            avatar: usuario?.imgUrl || '/placeholder.svg',
          },
        }
      })
    )

    return resenasConUsuario
  },
})

export const getEstadisticasResenasTienda = query({
  args: { tiendaId: v.id('tiendas') },
  handler: async (ctx, args) => {
    const resenas = await ctx.db
      .query('resenasTienda')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .collect()

    const total = resenas.length
    const distribucion = [0, 0, 0, 0, 0]

    resenas.forEach(r => {
      const i = Math.min(Math.max(Math.floor(r.calificacion), 1), 5) - 1
      distribucion[i]++
    })

    return {
      total,
      distribucion,
      promedio:
        total > 0 ? resenas.reduce((a, b) => a + b.calificacion, 0) / total : 0,
    }
  },
})

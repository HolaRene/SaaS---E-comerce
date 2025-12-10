import { v } from 'convex/values'
import { query } from './_generated/server'
import { Id } from './_generated/dataModel'

// 1. Obtener Órdenes Activas
export const getOrdenesActivas = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []

    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .first()

    if (!usuario) return []

    const compras = await ctx.db
      .query('compras')
      .withIndex('by_usuario', q => q.eq('usuarioId', usuario._id))
      .order('desc')
      .take(20) // Tomamos recientes para filtrar en memoria si es necesario

    // Filtrar activas (no entregadas ni canceladas)
    // Asumimos que 'pendiente', 'en_proceso', 'enviada' son activas
    const activas = compras.filter(
      c =>
        c.estado === 'pendiente' ||
        c.estado === 'en_proceso' ||
        c.estado === 'enviada'
    )

    // Enriquecer con nombre de tienda
    const resultados = await Promise.all(
      activas.map(async c => {
        const tienda = await ctx.db.get(c.tiendaId)
        return {
          ...c,
          nombreTienda: tienda?.nombre || 'Tienda desconocida',
        }
      })
    )

    return resultados
  },
})

// 2. Obtener Actividad Reciente (Todas las compras + Favoritos)
export const getActividadReciente = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []

    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .first()

    if (!usuario) return []

    // Compras recientes (cualquier estado)
    const compras = await ctx.db
      .query('compras')
      .withIndex('by_usuario', q => q.eq('usuarioId', usuario._id))
      .order('desc')
      .take(10)

    // Favoritos Tiendas recientes
    const favTiendas = await ctx.db
      .query('favoritosTiendas')
      .withIndex('by_usuario', q => q.eq('usuarioId', usuario._id))
      .order('desc')
      .take(5)

    // Favoritos Productos recientes
    const favProductos = await ctx.db
      .query('favoritosProductos')
      .withIndex('by_usuario', q => q.eq('usuarioId', usuario._id))
      .order('desc')
      .take(5)

    // Normalizar y unir
    const actividad = [
      ...compras.map(c => ({
        tipo: 'compra' as const,
        fecha: c._creationTime,
        id: c._id,
        detalle: `Compra en tienda`, // Se puede enriquecer más
        monto: c.total,
        estado: c.estado,
        tiendaId: c.tiendaId,
      })),
      ...favTiendas.map(f => ({
        tipo: 'favorito_tienda' as const,
        fecha: f._creationTime,
        id: f._id,
        detalle: 'Seguiste una nueva tienda',
        tiendaId: f.tiendaId,
      })),
      ...favProductos.map(f => ({
        tipo: 'favorito_producto' as const,
        fecha: f._creationTime,
        id: f._id,
        detalle: 'Te gustó un producto',
        tiendaId: undefined, // Podríamos buscarlo si fuera crítico
        productoId: f.productoId,
      })),
    ]

    // Ordenar por fecha descendente
    actividad.sort((a, b) => b.fecha - a.fecha)

    // Enriquecer datos (nombres de tiendas/productos)
    // Para optimizar, podríamos hacerlo solo para los top 10 finales
    const topActividad = actividad.slice(0, 10)

    const enrichPromises = topActividad.map(async item => {
      let nombreTienda = ''
      let nombreProducto = ''

      if (item.tiendaId) {
        const t = await ctx.db.get(item.tiendaId as Id<'tiendas'>)
        nombreTienda = t?.nombre || ''
      }

      if (item.tipo === 'favorito_producto' && item.productoId) {
        const p = await ctx.db.get(item.productoId)
        nombreProducto = p?.nombre || ''
        // Intentar obtener tienda del producto si no la tenemos
        if (!nombreTienda && p?.tiendaId) {
          const t = await ctx.db.get(p.tiendaId)
          nombreTienda = t?.nombre || ''
        }
      }

      return {
        ...item,
        nombreTienda,
        nombreProducto,
      }
    })

    return await Promise.all(enrichPromises)
  },
})

// 3. Obtener Novedades (Wrapper de notificaciones)
export const getNovedades = query({
  args: {},
  handler: async ctx => {
    // Reutilizamos lógica de notificaciones pero filtramos solo novedades
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []

    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .first()

    if (!usuario) return []

    // Obtenemos notificaciones recientes
    const notifs = await ctx.db
      .query('notificaciones')
      .withIndex('by_usuario', q => q.eq('usuarioId', usuario._id))
      .order('desc')
      .take(20)

    // Filtramos tipos de "novedad"
    return notifs.filter(
      n =>
        n.tipo === 'nuevo_producto' ||
        n.tipo === 'nueva_tienda' ||
        n.tipo === 'precio_bajado' ||
        n.tipo === 'tienda_datos_actualizados'
    )
  },
})

// 4. Obtener Recomendaciones (Tiendas en mismo departamento)
export const getRecomendaciones = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []

    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .first()

    if (!usuario) return []

    // Prioridad: Mismo departamento
    const departamento = usuario.configuracion?.departamento
    if (!departamento) return [] // O devolver random

    // Obtener tiendas del departamento
    // Nota: Esto requiere un índice idealmente, o filtrar en memoria si son pocas.
    // Asumiremos que podemos filtrar en memoria las tiendas (si no son miles)
    // O mejor, si ya agregamos indice, usarlo. Si no, full scan bounded.
    const tiendas = await ctx.db
      .query('tiendas')
      .filter(q => q.eq(q.field('publica'), true))
      .collect()

    // Filtrar por departamento
    let tiendasCandidatas = tiendas.filter(t => t.departamento === departamento)

    // Si no hay suficientes, rellenar con otras (opcional)
    if (tiendasCandidatas.length < 5) {
      const otras = tiendas.filter(t => t.departamento !== departamento)
      tiendasCandidatas = [...tiendasCandidatas, ...otras]
    }

    // Excluir las que ya sigo
    const misFavoritos = await ctx.db
      .query('favoritosTiendas')
      .withIndex('by_usuario', q => q.eq('usuarioId', usuario._id))
      .collect()

    const idsSeguidos = new Set(misFavoritos.map(f => f.tiendaId))

    const recomendaciones = tiendasCandidatas.filter(
      t => !idsSeguidos.has(t._id)
    )

    // Tomar 5 (puedes hacer shuffle si quieres variedad)
    return recomendaciones.slice(0, 5)
  },
})

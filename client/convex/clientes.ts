import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// ============================================
// QUERIES
// ============================================

/**
 * Obtener todos los clientes de una tienda con filtros opcionales
 */
export const getClientesByTienda = query({
  args: {
    tiendaId: v.id('tiendas'),
    searchTerm: v.optional(v.string()),
    segmento: v.optional(
      v.union(
        v.literal('frecuente'),
        v.literal('ocasional'),
        v.literal('mayorista')
      )
    ),
    estado: v.optional(v.string()), // "activo", "fiado", "todos"
  },
  handler: async (ctx, args) => {
    let clientes = await ctx.db
      .query('clientes')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .collect()

    // Filtrar por término de búsqueda
    if (args.searchTerm) {
      const term = args.searchTerm.toLowerCase()
      clientes = clientes.filter(
        c =>
          c.nombre.toLowerCase().includes(term) ||
          (c.telefono && c.telefono.includes(term)) ||
          (c.email && c.email.toLowerCase().includes(term))
      )
    }

    // Filtrar por segmento
    if (args.segmento) {
      clientes = clientes.filter(c => c.segmento === args.segmento)
    }

    // Filtrar por estado (si tiene crédito activo)
    if (args.estado && args.estado !== 'todos') {
      if (args.estado === 'fiado') {
        // Obtener clientes con créditos activos
        const creditosActivos = await ctx.db
          .query('creditos')
          .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
          .filter(q => q.neq(q.field('estado'), 'pagado'))
          .collect()

        const clientesConCredito = new Set(
          creditosActivos.map(c => c.clienteId)
        )
        clientes = clientes.filter(c => clientesConCredito.has(c._id))
      }
    }

    return clientes
  },
})

/**
 * Obtener clientes que tienen deudas activas
 */
export const getClientesConDeuda = query({
  args: {
    tiendaId: v.id('tiendas'),
  },
  handler: async (ctx, args) => {
    // 1. Obtener créditos activos
    const creditosActivos = await ctx.db
      .query('creditos')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .filter(q => q.eq(q.field('estado'), 'activo'))
      .collect()

    if (creditosActivos.length === 0) return []

    // 2. Obtener IDs únicos de clientes
    const clienteIds = [...new Set(creditosActivos.map(c => c.clienteId))]

    // 3. Obtener detalles de los clientes
    const clientes = await Promise.all(
      clienteIds.map(async id => {
        const cliente = await ctx.db.get(id)
        const credito = creditosActivos.find(c => c.clienteId === id)
        return cliente
          ? {
              ...cliente,
              creditoId: credito?._id,
              saldoActual: credito?.saldoActual,
            }
          : null
      })
    )

    return clientes.filter(c => c !== null)
  },
})

/**
 * Obtener detalle completo de un cliente con historial de compras
 */
export const getClienteDetalle = query({
  args: {
    clienteId: v.id('clientes'),
  },
  handler: async (ctx, args) => {
    const cliente = await ctx.db.get(args.clienteId)
    if (!cliente) return null

    // Obtener historial de ventas
    const ventas = await ctx.db
      .query('ventas')
      .withIndex('by_cliente', q => q.eq('clienteId', args.clienteId))
      .order('desc')
      .take(10) // Últimas 10 compras

    // Obtener créditos activos
    const creditos = await ctx.db
      .query('creditos')
      .withIndex('by_cliente', q => q.eq('clienteId', args.clienteId))
      .collect()

    return {
      ...cliente,
      historialCompras: ventas.map(v => ({
        fecha: v.fecha,
        total: v.total,
        metodoPago: v.metodoPago,
      })),
      creditosActivos: creditos.filter(c => c.estado === 'activo'),
    }
  },
})

/**
 * Buscar clientes por nombre o teléfono
 */
export const searchClientes = query({
  args: {
    tiendaId: v.id('tiendas'),
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const clientes = await ctx.db
      .query('clientes')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .collect()

    const term = args.searchTerm.toLowerCase()
    return clientes.filter(
      c =>
        c.nombre.toLowerCase().includes(term) ||
        (c.telefono && c.telefono.includes(term))
    )
  },
})

/**
 * Obtener clientes activos del mes actual
 * Un cliente es considerado activo si ha comprado al menos minProductos en el mes
 */
export const getClientesActivosMes = query({
  args: {
    tiendaId: v.id('tiendas'),
    minProductos: v.optional(v.number()), // Umbral mínimo de productos (default: 1)
  },
  handler: async (ctx, args) => {
    // Obtener inicio y fin del mes actual
    const ahora = new Date()
    const inicioMes = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      1
    ).toISOString()
    const finMes = new Date(
      ahora.getFullYear(),
      ahora.getMonth() + 1,
      0,
      23,
      59,
      59
    ).toISOString()

    // Obtener ventas del mes
    const ventas = await ctx.db
      .query('ventas')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .filter(q => q.gte(q.field('fecha'), inicioMes))
      .filter(q => q.lte(q.field('fecha'), finMes))
      .collect()

    // Contar productos por cliente
    const clientesMap = new Map<string, number>()

    for (const venta of ventas) {
      if (!venta.clienteId) continue

      const detalles = await ctx.db
        .query('detallesVenta')
        .withIndex('by_venta', q => q.eq('ventaId', venta._id))
        .collect()

      const totalProductos = detalles.reduce((sum, d) => sum + d.cantidad, 0)
      const clienteId = String(venta.clienteId)
      clientesMap.set(
        clienteId,
        (clientesMap.get(clienteId) || 0) + totalProductos
      )
    }

    // Filtrar por umbral si se especifica
    const umbral = args.minProductos || 1
    const clientesActivos = Array.from(clientesMap.entries()).filter(
      ([_, productos]) => productos >= umbral
    )

    return {
      total: clientesActivos.length,
      detalles: clientesActivos.map(([clienteId, productos]) => ({
        clienteId,
        productos,
      })),
    }
  },
})

/**
 * Obtener valor promedio por cliente (total de compras / número de clientes)
 */
export const getValorPromedioCliente = query({
  args: {
    tiendaId: v.id('tiendas'),
  },
  handler: async (ctx, args) => {
    const clientes = await ctx.db
      .query('clientes')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .collect()

    if (clientes.length === 0) {
      return {
        promedio: 0,
        totalClientes: 0,
        totalCompras: 0,
      }
    }

    const totalCompras = clientes.reduce(
      (sum, c) => sum + (c.totalCompras || 0),
      0
    )
    const promedio = totalCompras / clientes.length

    return {
      promedio,
      totalClientes: clientes.length,
      totalCompras,
    }
  },
})

/**
 * Buscar cliente por teléfono (legacy - mantener compatibilidad)
 */
export const buscarPorTelefono = query({
  args: {
    tiendaId: v.id('tiendas'),
    telefono: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('clientes')
      .withIndex('by_telefono', q =>
        q.eq('tiendaId', args.tiendaId).eq('telefono', args.telefono)
      )
      .first()
  },
})

// ============================================
// MUTATIONS
// ============================================

/**
 * Crear un nuevo cliente
 */
export const createCliente = mutation({
  args: {
    tiendaId: v.id('tiendas'),
    nombre: v.string(),
    telefono: v.optional(v.string()),
    email: v.optional(v.string()),
    direccion: v.optional(v.string()),
    notas: v.optional(v.string()),
    segmento: v.optional(
      v.union(
        v.literal('frecuente'),
        v.literal('ocasional'),
        v.literal('mayorista')
      )
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('No autenticado')

    const clienteId = await ctx.db.insert('clientes', {
      tiendaId: args.tiendaId,
      nombre: args.nombre,
      telefono: args.telefono,
      email: args.email,
      direccion: args.direccion,
      notas: args.notas,
      segmento: args.segmento || 'ocasional',
      fechaRegistro: new Date().toISOString(),
      totalCompras: 0,
      cantidadCompras: 0,
    })

    return clienteId
  },
})

/**
 * Crear cliente (legacy - mantener compatibilidad)
 */
export const crearCliente = mutation({
  args: {
    tiendaId: v.id('tiendas'),
    nombre: v.string(),
    email: v.optional(v.string()),
    telefono: v.optional(v.string()),
    direccion: v.optional(v.string()),
    notas: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('No autenticado')

    return await ctx.db.insert('clientes', {
      tiendaId: args.tiendaId,
      nombre: args.nombre,
      email: args.email,
      telefono: args.telefono,
      direccion: args.direccion,
      notas: args.notas,
      fechaRegistro: new Date().toISOString(),
      totalCompras: 0,
      cantidadCompras: 0,
    })
  },
})

/**
 * Actualizar información de un cliente
 */
export const updateCliente = mutation({
  args: {
    clienteId: v.id('clientes'),
    nombre: v.optional(v.string()),
    telefono: v.optional(v.string()),
    email: v.optional(v.string()),
    direccion: v.optional(v.string()),
    notas: v.optional(v.string()),
    segmento: v.optional(
      v.union(
        v.literal('frecuente'),
        v.literal('ocasional'),
        v.literal('mayorista')
      )
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('No autenticado')

    const { clienteId, ...updates } = args

    // Filtrar campos undefined
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    )

    await ctx.db.patch(clienteId, filteredUpdates)
    return clienteId
  },
})

/**
 * Actualizar segmento de un cliente
 */
export const updateSegmento = mutation({
  args: {
    clienteId: v.id('clientes'),
    segmento: v.union(
      v.literal('frecuente'),
      v.literal('ocasional'),
      v.literal('mayorista')
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('No autenticado')

    await ctx.db.patch(args.clienteId, {
      segmento: args.segmento,
    })
    return args.clienteId
  },
})

/**
 * Actualizar estadísticas de cliente (legacy - mantener compatibilidad)
 */
export const actualizarEstadisticas = mutation({
  args: {
    clienteId: v.id('clientes'),
    montoCompra: v.number(),
  },
  handler: async (ctx, args) => {
    const cliente = await ctx.db.get(args.clienteId)
    if (!cliente) throw new Error('Cliente no encontrado')

    await ctx.db.patch(args.clienteId, {
      totalCompras: cliente.totalCompras + args.montoCompra,
      cantidadCompras: cliente.cantidadCompras + 1,
      ultimaCompra: new Date().toISOString(),
    })
  },
})

/**
 * Eliminar un cliente (soft delete)
 */
export const deleteCliente = mutation({
  args: {
    clienteId: v.id('clientes'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('No autenticado')

    // Verificar que no tenga créditos activos
    const creditosActivos = await ctx.db
      .query('creditos')
      .withIndex('by_cliente', q => q.eq('clienteId', args.clienteId))
      .filter(q => q.eq(q.field('estado'), 'activo'))
      .collect()

    if (creditosActivos.length > 0) {
      throw new Error('No se puede eliminar un cliente con créditos activos')
    }

    await ctx.db.delete(args.clienteId)
    return args.clienteId
  },
})

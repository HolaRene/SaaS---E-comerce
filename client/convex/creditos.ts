import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { internal } from './_generated/api'

// ============================================
// QUERIES
// ============================================

/**
 * Obtener todos los créditos de una tienda
 */
export const getCreditosByTienda = query({
  args: {
    tiendaId: v.id('tiendas'),
    estado: v.optional(
      v.union(
        v.literal('activo'),
        v.literal('pagado'),
        v.literal('vencido'),
        v.literal('cancelado')
      )
    ),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query('creditos')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))

    let creditos = await query.collect()

    // Filtrar por estado si se especifica
    if (args.estado) {
      creditos = creditos.filter(c => c.estado === args.estado)
    }

    // Enriquecer con información del cliente
    const creditosConCliente = await Promise.all(
      creditos.map(async credito => {
        const cliente = await ctx.db.get(credito.clienteId)
        return {
          ...credito,
          clienteNombre: cliente?.nombre || 'Cliente desconocido',
          clienteTelefono: cliente?.telefono,
        }
      })
    )

    return creditosConCliente
  },
})

/**
 * Obtener detalle de un crédito con historial de pagos
 */
export const getCreditoDetalle = query({
  args: {
    creditoId: v.id('creditos'),
  },
  handler: async (ctx, args) => {
    const credito = await ctx.db.get(args.creditoId)
    if (!credito) return null

    // Obtener cliente
    const cliente = await ctx.db.get(credito.clienteId)

    // Obtener historial de pagos
    const pagos = await ctx.db
      .query('pagosCredito')
      .withIndex('by_credito', q => q.eq('creditoId', args.creditoId))
      .order('desc')
      .collect()

    // Enriquecer pagos con información del usuario que registró
    const pagosConUsuario = await Promise.all(
      pagos.map(async pago => {
        const usuario = await ctx.db.get(pago.registradoPor)
        return {
          ...pago,
          registradoPorNombre: usuario?.nombre || 'Usuario desconocido',
        }
      })
    )

    return {
      ...credito,
      cliente,
      historialPagos: pagosConUsuario,
    }
  },
})

/**
 * Obtener estadísticas de créditos de una tienda
 */
export const getEstadisticasCreditos = query({
  args: {
    tiendaId: v.id('tiendas'),
  },
  handler: async (ctx, args) => {
    const creditos = await ctx.db
      .query('creditos')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .collect()

    const creditosActivos = creditos.filter(c => c.estado === 'activo')
    const totalAdeudado = creditosActivos.reduce(
      (sum, c) => sum + c.saldoActual,
      0
    )
    const promedioCliente =
      creditosActivos.length > 0 ? totalAdeudado / creditosActivos.length : 0

    // Calcular créditos vencidos
    const hoy = new Date().toISOString()
    const creditosVencidos = creditosActivos.filter(
      c => c.fechaVencimiento && c.fechaVencimiento < hoy
    )

    return {
      totalCreditosActivos: creditosActivos.length,
      totalAdeudado,
      promedioCliente,
      creditosVencidos: creditosVencidos.length,
      totalVencido: creditosVencidos.reduce((sum, c) => sum + c.saldoActual, 0),
    }
  },
})

/**
 * Obtener pagos de un crédito
 */
export const getPagosCredito = query({
  args: {
    creditoId: v.id('creditos'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('pagosCredito')
      .withIndex('by_credito', q => q.eq('creditoId', args.creditoId))
      .order('desc')
      .collect()
  },
})

/**
 * Obtener créditos de un cliente específico
 */
export const getCreditosByCliente = query({
  args: {
    clienteId: v.id('clientes'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('creditos')
      .withIndex('by_cliente', q => q.eq('clienteId', args.clienteId))
      .collect()
  },
})

// ============================================
// MUTATIONS
// ============================================

/**
 * Crear un nuevo crédito para un cliente
 */
export const createCredito = mutation({
  args: {
    tiendaId: v.id('tiendas'),
    clienteId: v.id('clientes'),
    limiteCredito: v.number(),
    saldoInicial: v.number(),
    fechaVencimiento: v.optional(v.string()),
    notas: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('No autenticado')

    // Verificar que el cliente existe
    const cliente = await ctx.db.get(args.clienteId)
    if (!cliente) throw new Error('Cliente no encontrado')

    // Verificar que no tenga un crédito activo
    const creditoActivo = await ctx.db
      .query('creditos')
      .withIndex('by_cliente', q => q.eq('clienteId', args.clienteId))
      .filter(q => q.eq(q.field('estado'), 'activo'))
      .first()

    if (creditoActivo) {
      throw new Error('El cliente ya tiene un crédito activo')
    }

    const creditoId = await ctx.db.insert('creditos', {
      tiendaId: args.tiendaId,
      clienteId: args.clienteId,
      limiteCredito: args.limiteCredito,
      saldoActual: args.saldoInicial,
      fechaInicio: new Date().toISOString(),
      fechaVencimiento: args.fechaVencimiento,
      estado: 'activo',
      notas: args.notas,
    })

    // Notificar al usuario App si existe
    if (cliente.email) {
      const user = await ctx.db
        .query('usuarios')
        .withIndex('by_correo', q => q.eq('correo', cliente.email!))
        .first()

      if (user) {
        await ctx.scheduler.runAfter(
          0,
          internal.notificaciones.crearNotificacionUsuario,
          {
            usuarioId: user._id,
            tipo: 'credito_movimiento',
            titulo: 'Crédito Abierto',
            mensaje: `Se ha abierto una línea de crédito por $${args.limiteCredito}`,
            tiendaId: args.tiendaId,
          }
        )
      }
    }

    return creditoId
  },
})

/**
 * Registrar un pago/abono a un crédito
 */
export const registrarPago = mutation({
  args: {
    creditoId: v.id('creditos'),
    monto: v.number(),
    metodoPago: v.union(
      v.literal('efectivo'),
      v.literal('tarjeta'),
      v.literal('transferencia')
    ),
    notas: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('No autenticado')

    // Obtener el crédito
    const credito = await ctx.db.get(args.creditoId)
    if (!credito) throw new Error('Crédito no encontrado')

    // Validar que el monto no sea mayor al saldo
    if (args.monto > credito.saldoActual) {
      throw new Error('El monto del pago no puede ser mayor al saldo actual')
    }

    // Obtener el usuario actual
    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .first()

    if (!usuario) throw new Error('Usuario no encontrado')

    // Registrar el pago
    const pagoId = await ctx.db.insert('pagosCredito', {
      creditoId: args.creditoId,
      clienteId: credito.clienteId,
      tiendaId: credito.tiendaId,
      monto: args.monto,
      fecha: new Date().toISOString(),
      metodoPago: args.metodoPago,
      notas: args.notas,
      registradoPor: usuario._id,
    })

    // Actualizar el saldo del crédito
    const nuevoSaldo = credito.saldoActual - args.monto
    const nuevoEstado = nuevoSaldo === 0 ? 'pagado' : credito.estado

    await ctx.db.patch(args.creditoId, {
      saldoActual: nuevoSaldo,
      estado: nuevoEstado,
    })

    // Notificar al cliente (usuario App)
    const cliente = await ctx.db.get(credito.clienteId)
    if (cliente && cliente.email) {
      const user = await ctx.db
        .query('usuarios')
        .withIndex('by_correo', q => q.eq('correo', cliente.email!))
        .first()

      if (user) {
        await ctx.scheduler.runAfter(
          0,
          internal.notificaciones.crearNotificacionUsuario,
          {
            usuarioId: user._id,
            tipo: 'credito_movimiento',
            titulo: 'Pago Recibido',
            mensaje: `Abono de $${args.monto} registrado exitosamente. Saldo: $${nuevoSaldo}`,
            tiendaId: credito.tiendaId,
          }
        )
      }
    }

    return pagoId
  },
})

/**
 * Actualizar el estado de un crédito
 */
export const updateEstadoCredito = mutation({
  args: {
    creditoId: v.id('creditos'),
    estado: v.union(
      v.literal('activo'),
      v.literal('pagado'),
      v.literal('vencido'),
      v.literal('cancelado')
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('No autenticado')

    await ctx.db.patch(args.creditoId, {
      estado: args.estado,
    })

    return args.creditoId
  },
})

/**
 * Cancelar un crédito
 */
export const cancelarCredito = mutation({
  args: {
    creditoId: v.id('creditos'),
    razon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('No autenticado')

    const credito = await ctx.db.get(args.creditoId)
    if (!credito) throw new Error('Crédito no encontrado')

    await ctx.db.patch(args.creditoId, {
      estado: 'cancelado',
      notas: args.razon
        ? `${credito.notas || ''}\nCancelado: ${args.razon}`
        : credito.notas,
    })

    return args.creditoId
  },
})

/**
 * Actualizar límite de crédito
 */
export const updateLimiteCredito = mutation({
  args: {
    creditoId: v.id('creditos'),
    nuevoLimite: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('No autenticado')

    const credito = await ctx.db.get(args.creditoId)
    if (!credito) throw new Error('Crédito no encontrado')

    // Validar que el nuevo límite sea mayor o igual al saldo actual
    if (args.nuevoLimite < credito.saldoActual) {
      throw new Error('El nuevo límite no puede ser menor al saldo actual')
    }

    await ctx.db.patch(args.creditoId, {
      limiteCredito: args.nuevoLimite,
    })

    // Notificar
    const cliente = await ctx.db.get(credito.clienteId)
    if (cliente && cliente.email) {
      const user = await ctx.db
        .query('usuarios')
        .withIndex('by_correo', q => q.eq('correo', cliente.email!))
        .first()

      if (user) {
        await ctx.scheduler.runAfter(
          0,
          internal.notificaciones.crearNotificacionUsuario,
          {
            usuarioId: user._id,
            tipo: 'credito_movimiento',
            titulo: 'Límite Actualizado',
            mensaje: `Tu nuevo límite de crédito es $${args.nuevoLimite}`,
            tiendaId: credito.tiendaId,
          }
        )
      }
    }

    return args.creditoId
  },
})

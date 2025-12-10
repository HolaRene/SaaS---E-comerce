import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { Id } from './_generated/dataModel'
import { internal } from './_generated/api'

// Crear venta completa
export const crearVenta = mutation({
  args: {
    tiendaId: v.id('tiendas'),
    clienteId: v.optional(v.id('clientes')),
    productos: v.array(
      v.object({
        productoId: v.id('productos'),
        cantidad: v.number(),
        precioUnitario: v.number(),
        nombreProducto: v.string(),
      })
    ),
    metodoPago: v.union(
      v.literal('efectivo'),
      v.literal('tarjeta'),
      v.literal('transferencia'),
      v.literal('fiado')
    ),
    subtotal: v.number(),
    impuesto: v.number(),
    total: v.number(),
    notas: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('No autenticado')

    // Obtener usuario
    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique()

    if (!usuario) throw new Error('Usuario no encontrado')

    // 1. Crear la venta
    const ventaId = await ctx.db.insert('ventas', {
      tiendaId: args.tiendaId,
      clienteId: args.clienteId,
      usuarioId: usuario._id,
      fecha: new Date().toISOString(),
      subtotal: args.subtotal,
      impuesto: args.impuesto,
      total: args.total,
      metodoPago: args.metodoPago,
      estado: 'completada',
      notas: args.notas,
    })

    // 2. Crear detalles de venta y actualizar stock
    for (const item of args.productos) {
      await ctx.db.insert('detallesVenta', {
        ventaId,
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal: item.cantidad * item.precioUnitario,
        nombreProducto: item.nombreProducto,
      })

      // 3. Actualizar stock del producto
      const producto = await ctx.db.get(item.productoId)
      if (producto) {
        await ctx.db.patch(item.productoId, {
          cantidad: producto.cantidad - item.cantidad,
        })

        // 4. Registrar movimiento de inventario
        await ctx.db.insert('movimientosInventario', {
          productoId: item.productoId,
          tiendaId: args.tiendaId,
          usuarioId: usuario._id,
          tipo: 'SALIDA',
          cantidad: item.cantidad,
          stockAnterior: producto.cantidad,
          stockNuevo: producto.cantidad - item.cantidad,
          razon: 'Venta',
          fecha: new Date().toISOString(),
          ventaId,
        })
      }
    }

    // 5. Si es fiado, crear o actualizar crédito
    if (args.metodoPago === 'fiado' && args.clienteId) {
      // Buscar si ya existe un crédito activo para este cliente
      const creditoExistente = await ctx.db
        .query('creditos')
        .withIndex('by_cliente', q => q.eq('clienteId', args.clienteId!))
        .filter(q => q.eq(q.field('estado'), 'activo'))
        .first()

      if (creditoExistente) {
        // Actualizar crédito existente
        await ctx.db.patch(creditoExistente._id, {
          saldoActual: creditoExistente.saldoActual + args.total,
        })
      } else {
        // Crear nuevo crédito
        await ctx.db.insert('creditos', {
          tiendaId: args.tiendaId,
          clienteId: args.clienteId,
          limiteCredito: 5000, // Límite por defecto, puedes ajustarlo
          saldoActual: args.total,
          fechaInicio: new Date().toISOString(),
          estado: 'activo',
          notas: `Crédito iniciado con venta`,
        })
      }
    }

    // 6. Actualizar estadísticas del cliente (si existe) y Notificar si es Fiado (POS)
    if (args.clienteId) {
      const cliente = await ctx.db.get(args.clienteId)
      if (cliente) {
        await ctx.db.patch(args.clienteId, {
          totalCompras: cliente.totalCompras + args.total,
          cantidadCompras: cliente.cantidadCompras + 1,
          ultimaCompra: new Date().toISOString(),
        })

        // Si es fiado, intentar notificar al usuario App si existe por email
        if (args.metodoPago === 'fiado' && cliente.email) {
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
                titulo: 'Nuevo Cargo (Fiado)',
                mensaje: `Compra en tienda por $${args.total}`,
                tiendaId: args.tiendaId,
              }
            )
          }
        }
      }
    }

    return ventaId
  },
})

// Obtener ventas por tienda
export const getVentasByTienda = query({
  args: {
    tiendaId: v.id('tiendas'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const ventas = await ctx.db
      .query('ventas')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .order('desc')
      .take(args.limit || 50)

    // Enriquecer con datos de cliente y cajero
    return await Promise.all(
      ventas.map(async venta => {
        const cliente = venta.clienteId
          ? await ctx.db.get(venta.clienteId)
          : null

        const usuario = await ctx.db.get(venta.usuarioId)

        let cajeroNombre = usuario?.nombre || 'Desconocido'
        if (venta.canal === 'online') {
          cajeroNombre = 'Tienda' // Nombre genérico para ventas online
        }

        return {
          ...venta,
          clienteNombre: cliente?.nombre || 'Cliente General',
          cajeroNombre,
        }
      })
    )
  },
})

export const getDetalleVenta = query({
  args: { ventaId: v.id('ventas') },
  handler: async (ctx, args) => {
    const venta = await ctx.db.get(args.ventaId)
    if (!venta) return null

    const detalles = await ctx.db
      .query('detallesVenta')
      .withIndex('by_venta', q => q.eq('ventaId', args.ventaId))
      .collect()

    // ✅ OBTENER CLIENTE
    let cliente = null
    if (venta.clienteId) {
      cliente = await ctx.db.get(venta.clienteId)
    }

    // ✅ OBTENER DATOS DE COMPRA ONLINE
    let datosCompraOnline = null
    if (venta.canal === 'online') {
      // Buscar la compra asociada por tiendaId y usando el clienteId
      // (más robusto que buscar por número de orden)
      datosCompraOnline = await ctx.db
        .query('compras')
        .withIndex('by_tienda', q => q.eq('tiendaId', venta.tiendaId))
        .filter(q => q.eq(q.field('clienteId'), venta.clienteId))
        .filter(q => q.eq(q.field('canal'), 'online'))
        .order('desc')
        .first()
    }

    // ✅ DETERMINAR CAJERO CORRECTO
    let cajero = 'Cajero Desconocido'
    if (venta.canal === 'online' && venta.compraOnlineId) {
      datosCompraOnline = await ctx.db.get(venta.compraOnlineId)
    } else {
      const usuarioVenta = await ctx.db.get(venta.usuarioId)
      cajero = usuarioVenta?.nombre || 'Cajero Desconocido'
    }

    return {
      ...venta,
      detalles,
      cliente,
      cajero,
      esOnline: venta.canal === 'online',
      // ✅ INCLUIR DATOS DEL FORMULARIO DE COMPRA
      datosEnvio: datosCompraOnline
        ? {
            direccionEntrega: datosCompraOnline.direccionEntrega,
            notasEntrega: datosCompraOnline.notas,
            nombreComprador: cliente?.nombre,
            telefonoComprador: cliente?.telefono,
          }
        : null,
    }
  },
})

// Estadísticas de ventas
export const getEstadisticasVentas = query({
  args: {
    tiendaId: v.id('tiendas'),
    fechaInicio: v.optional(v.string()),
    fechaFin: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let ventas = await ctx.db
      .query('ventas')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .filter(q => q.eq(q.field('estado'), 'completada'))
      .collect()

    // Filtrar por fecha si se proporciona
    if (args.fechaInicio || args.fechaFin) {
      ventas = ventas.filter(v => {
        const fecha = new Date(v.fecha)
        if (args.fechaInicio && fecha < new Date(args.fechaInicio)) return false
        if (args.fechaFin && fecha > new Date(args.fechaFin)) return false
        return true
      })
    }

    const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0)
    const cantidadVentas = ventas.length
    const promedioVenta = cantidadVentas > 0 ? totalVentas / cantidadVentas : 0

    // Clientes únicos
    const clientesUnicos = new Set(
      ventas.filter(v => v.clienteId).map(v => v.clienteId)
    ).size

    return {
      totalVentas,
      cantidadVentas,
      promedioVenta,
      clientesAtendidos: clientesUnicos,
    }
  },
})

// Top productos por tienda (agrega cantidades y totales desde detallesVenta)
export const getTopProductosByTienda = query({
  args: { tiendaId: v.id('tiendas'), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const ventas = await ctx.db
      .query('ventas')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .collect()

    // Map productoId -> { nombreProducto, cantidad, total }
    const acumulado: Record<
      string,
      { nombre: string; cantidad: number; total: number }
    > = {}

    for (const venta of ventas) {
      const detalles = await ctx.db
        .query('detallesVenta')
        .withIndex('by_venta', q => q.eq('ventaId', venta._id))
        .collect()

      for (const d of detalles) {
        const key = String(d.productoId)
        if (!acumulado[key])
          acumulado[key] = { nombre: d.nombreProducto, cantidad: 0, total: 0 }
        acumulado[key].cantidad += d.cantidad
        acumulado[key].total += d.subtotal
      }
    }

    const totalAll =
      Object.values(acumulado).reduce((s, x) => s + x.total, 0) || 1

    const items = Object.entries(acumulado)
      .map(([productoId, v]) => ({
        productoId,
        nombre: v.nombre,
        ventas: v.total,
        cantidad: v.cantidad,
        participacion: (v.total / totalAll) * 100,
      }))
      .sort((a, b) => b.ventas - a.ventas)
      .slice(0, args.limit || 5)

    return items
  },
})

// Ventas mensuales por tienda (últimos N meses)
export const getVentasMensualesByTienda = query({
  args: { tiendaId: v.id('tiendas'), meses: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const meses = args.meses ?? 6
    const ventas = await ctx.db
      .query('ventas')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .filter(q => q.eq(q.field('estado'), 'completada'))
      .collect()

    const ahora = new Date()
    const resultadosVentas: Record<string, number> = {}
    const resultadosCostos: Record<string, number> = {}

    // Inicializar últimos N meses
    for (let i = meses - 1; i >= 0; i--) {
      const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
      resultadosVentas[key] = 0
      resultadosCostos[key] = 0
    }

    for (const vta of ventas) {
      const f = new Date(vta.fecha)
      const key = `${f.getFullYear()}-${(f.getMonth() + 1).toString().padStart(2, '0')}`
      if (!(key in resultadosVentas)) continue

      resultadosVentas[key] += vta.total || 0

      // Calcular costo asociado a esta venta
      const detalles = await ctx.db
        .query('detallesVenta')
        .withIndex('by_venta', q => q.eq('ventaId', vta._id))
        .collect()

      for (const d of detalles) {
        const producto = await ctx.db.get(d.productoId)
        const costoUnitario = producto?.costo ?? 0
        resultadosCostos[key] += (costoUnitario || 0) * (d.cantidad || 0)
      }
    }

    // Convertir a array con nombre de mes
    const salida = Object.entries(resultadosVentas).map(([key, total]) => {
      const [y, m] = key.split('-')
      const fecha = new Date(Number(y), Number(m) - 1, 1)
      const nombreMes = fecha.toLocaleString('es-ES', { month: 'long' })
      return {
        mes: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
        ventas: total,
        costos: resultadosCostos[key] || 0,
      }
    })

    return salida
  },
})

// Ventas por categoría (suma subtotal/total por categoría según productos)
export const getVentasPorCategoria = query({
  args: { tiendaId: v.id('tiendas') },
  handler: async (ctx, args) => {
    // Recolectar ventas completadas de la tienda
    const ventas = await ctx.db
      .query('ventas')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .filter(q => q.eq(q.field('estado'), 'completada'))
      .collect()

    // Map categoria -> total
    const porCategoria: Record<string, number> = {}

    for (const vta of ventas) {
      const detalles = await ctx.db
        .query('detallesVenta')
        .withIndex('by_venta', q => q.eq('ventaId', vta._id))
        .collect()

      for (const d of detalles) {
        const producto = await ctx.db.get(d.productoId)
        const categoria = producto?.categoria || 'Sin categoría'
        porCategoria[categoria] =
          (porCategoria[categoria] || 0) + (d.subtotal || 0)
      }
    }

    // Convertir a array ordenado por valor desc
    const items = Object.entries(porCategoria)
      .map(([categoria, valor]) => ({ categoria, valor }))
      .sort((a, b) => b.valor - a.valor)

    return items
  },
})

// ==================== CREAR VENTA ONLINE ====================
/**
 * Crear venta online (compra desde usuario/cliente)
 * Similar a crearVenta pero incluye datos de envío y registra la compra del usuario
 */
export const crearVentaOnline = mutation({
  args: {
    tiendaId: v.id('tiendas'),
    productos: v.array(
      v.object({
        productoId: v.id('productos'),
        cantidad: v.number(),
        precioUnitario: v.number(),
        nombreProducto: v.string(),
      })
    ),
    metodoPago: v.union(
      v.literal('efectivo'),
      v.literal('transferencia'),
      v.literal('fiado')
    ),
    subtotal: v.number(),
    costoEnvio: v.number(),
    total: v.number(),
    // Datos de envío
    nombreComprador: v.string(),
    telefonoComprador: v.string(),
    direccionEntrega: v.string(),
    ciudadEntrega: v.string(),
    notasEntrega: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('No autenticado')

    // Obtener usuario (quien realiza la compra)
    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique()

    if (!usuario) throw new Error('Usuario no encontrado')

    // Generar número de orden único
    const numeroOrden = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // ========== 1. GESTIÓN DE CLIENTE (BUSCAR O CREAR) ==========
    let clienteId: Id<'clientes'> | undefined = undefined

    // Buscar cliente existente por teléfono en esta tienda
    const clienteExistente = await ctx.db
      .query('clientes')
      .withIndex('by_telefono', q =>
        q.eq('tiendaId', args.tiendaId).eq('telefono', args.telefonoComprador)
      )
      .first()

    if (clienteExistente) {
      // Si existe, actualizamos sus datos con la información reciente del formulario
      // Esto corrige el problema de que aparezca con un nombre antiguo
      await ctx.db.patch(clienteExistente._id, {
        nombre: args.nombreComprador, // Actualizar nombre
        direccion: `${args.direccionEntrega}, ${args.ciudadEntrega}`, // Actualizar dirección
        // No sobrescribimos email si ya tiene, o otros datos sensibles si no es necesario
      })
      clienteId = clienteExistente._id as any
    } else {
      // Crear nuevo cliente en la base de datos de la tienda si no existe
      clienteId = (await ctx.db.insert('clientes', {
        tiendaId: args.tiendaId,
        nombre: args.nombreComprador,
        telefono: args.telefonoComprador,
        direccion: `${args.direccionEntrega}, ${args.ciudadEntrega}`,
        fechaRegistro: new Date().toISOString(),
        totalCompras: 0,
        cantidadCompras: 0,
        segmento: 'ocasional',
      })) as any
    }

    const tienda = await ctx.db.get(args.tiendaId)
    if (!tienda) throw new Error('Tienda no encontrada')

    // El propietario es el responsable de la venta online (actúa como cajero)
    const usuarioId = tienda.propietario

    // ========== 2. CREAR LA VENTA (REGISTRO TIENDA) ==========
    const ventaId = await ctx.db.insert('ventas', {
      tiendaId: args.tiendaId,
      clienteId: clienteId as any,
      usuarioId: usuarioId,
      fecha: new Date().toISOString(),
      // compraOnlineId se omite inicialmente (undefined) porque es opcional y no null
      subtotal: args.subtotal,
      impuesto: 0,
      total: args.total,
      metodoPago: args.metodoPago,
      estado: 'pendiente', // Cambiado a pendiente para aprobación
      notas: `Compra online - ${numeroOrden} - ${args.notasEntrega || ''}`,
      canal: 'online',
    })

    // ========== 3. CREAR LA COMPRA (REGISTRO USUARIO) ==========
    const compraId = await ctx.db.insert('compras', {
      usuarioId: usuario._id,
      tiendaId: args.tiendaId,
      clienteId: clienteId,
      numeroOrden,
      subtotal: args.subtotal,
      costoEnvio: args.costoEnvio,
      total: args.total,
      metodoPago: args.metodoPago,
      direccionEntrega: args.direccionEntrega,
      notas: args.notasEntrega,
      fecha: new Date().toISOString(),
      estado: 'pendiente',
    })

    // Vincular la venta con la compra online
    await ctx.db.patch(ventaId, {
      compraOnlineId: compraId,
    })

    // ========== 4. DETALLES Y STOCK ==========
    for (const item of args.productos) {
      // Detalle para la venta (tienda)
      await ctx.db.insert('detallesVenta', {
        ventaId,
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal: item.cantidad * item.precioUnitario,
        nombreProducto: item.nombreProducto,
      })

      // Detalle para la compra (usuario)
      await ctx.db.insert('detallesCompra', {
        compraId,
        productoId: item.productoId,
        nombreProducto: item.nombreProducto,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal: item.cantidad * item.precioUnitario,
      })

      // Actualizar inventario (RESERVAR)
      const producto = await ctx.db.get(item.productoId)
      if (producto) {
        await ctx.db.patch(item.productoId, {
          cantidad: producto.cantidad - item.cantidad,
        })

        // Registrar movimiento de inventario
        await ctx.db.insert('movimientosInventario', {
          productoId: item.productoId,
          tiendaId: args.tiendaId,
          usuarioId: usuarioId,
          tipo: 'SALIDA',
          cantidad: item.cantidad,
          stockAnterior: producto.cantidad,
          stockNuevo: producto.cantidad - item.cantidad,
          razon: 'Reserva Venta Online',
          fecha: new Date().toISOString(),
          ventaId,
        })
      }
    }

    // ========== 5. MANEJO DE CRÉDITO (FIADO) - Solo iniciar si es fiado, pero validar en aprobación?
    // Por simplicidad, ya lo creamos pero el crédito queda activo. Si se rechaza la venta, habría que anular el movimiento de crédito también.
    // MEJORA: Crear el crédito pero tal vez con una nota de "Pendiente aprobación".
    if (args.metodoPago === 'fiado' && clienteId) {
      const creditoExistente = await ctx.db
        .query('creditos')
        .withIndex('by_cliente', q => q.eq('clienteId', clienteId as any))
        .filter(q => q.eq(q.field('estado'), 'activo'))
        .first()

      if (creditoExistente) {
        // Actualizar crédito existente sumando el nuevo total
        await ctx.db.patch(creditoExistente._id, {
          saldoActual: creditoExistente.saldoActual + args.total,
          notas:
            (creditoExistente.notas || '') +
            `\n+ Compra online (Pendiente): ${numeroOrden}`,
        })
      } else {
        // Crear nuevo crédito si no existe uno activo
        await ctx.db.insert('creditos', {
          tiendaId: args.tiendaId,
          clienteId: clienteId as any,
          limiteCredito: 5000,
          saldoActual: args.total,
          fechaInicio: new Date().toISOString(),
          estado: 'activo',
          notas: `Crédito iniciado con compra online ${numeroOrden} (Pendiente)`,
        })
      }
    }

    // ========== 6. ACTUALIZAR ESTADÍSTICAS DEL CLIENTE ==========
    if (clienteId) {
      const clienteStats = await ctx.db.get(clienteId)
      if (clienteStats) {
        await ctx.db.patch(clienteId, {
          totalCompras: (clienteStats.totalCompras || 0) + args.total,
          cantidadCompras: (clienteStats.cantidadCompras || 0) + 1,
          ultimaCompra: new Date().toISOString(),
        })
      }
    }

    return {
      ventaId,
      compraId,
      numeroOrden,
      clienteId,
    }
  },
})

// Confirmar venta online (Aceptar pedido)
export const confirmarVentaOnline = mutation({
  args: { ventaId: v.id('ventas') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('No autenticado')

    const venta = await ctx.db.get(args.ventaId)
    if (!venta) throw new Error('Venta no encontrada')

    if (venta.estado !== 'pendiente') {
      throw new Error('La venta no está pendiente')
    }

    // Verificar permisos (propietario o vendedor)
    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique()
    // Aquí podrías agregar validación de que el usuario pertenece a la tienda

    // Actualizar estado venta
    await ctx.db.patch(args.ventaId, {
      estado: 'completada',
    })

    // Actualizar estado compra (si existe vinculo) y Notificar
    if (venta.compraOnlineId) {
      await ctx.db.patch(venta.compraOnlineId, {
        estado: 'en_proceso', // O lista para entrega
      })

      // Obtener la compra para saber el usuario
      const compra = await ctx.db.get(venta.compraOnlineId)
      if (compra) {
        await ctx.scheduler.runAfter(
          0,
          internal.notificaciones.crearNotificacionUsuario,
          {
            usuarioId: compra.usuarioId,
            tipo: 'compra_estado',
            titulo: 'Pedido Confirmado',
            mensaje: `Tu pedido #${compra.numeroOrden} ha sido aceptado y está en proceso.`,
            url: '/user/compras',
            tiendaId: venta.tiendaId,
          }
        )
      }
    }

    return { success: true }
  },
})

// Rechazar venta online (Cancelar pedido)
export const rechazarVentaOnline = mutation({
  args: {
    ventaId: v.id('ventas'),
    motivo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('No autenticado')

    const venta = await ctx.db.get(args.ventaId)
    if (!venta) throw new Error('Venta no encontrada')

    if (venta.estado !== 'pendiente') {
      throw new Error('Solo se pueden rechazar ventas pendientes')
    }

    // 1. Revertir Stock
    const detalles = await ctx.db
      .query('detallesVenta')
      .withIndex('by_venta', q => q.eq('ventaId', args.ventaId))
      .collect()

    for (const d of detalles) {
      const producto = await ctx.db.get(d.productoId)
      if (producto) {
        // Devolver cantidad
        await ctx.db.patch(d.productoId, {
          cantidad: producto.cantidad + d.cantidad,
        })

        // Registrar movimiento de retorno
        await ctx.db.insert('movimientosInventario', {
          productoId: d.productoId,
          tiendaId: venta.tiendaId,
          usuarioId: venta.usuarioId, // Quien registró la venta (el sistema/propietario)
          tipo: 'ENTRADA', // Retorno
          cantidad: d.cantidad,
          stockAnterior: producto.cantidad,
          stockNuevo: producto.cantidad + d.cantidad,
          razon: `Venta Rechazada: ${args.motivo || 'Sin motivo'}`,
          fecha: new Date().toISOString(),
          ventaId: args.ventaId,
        })
      }
    }

    // 2. Revertir Crédito (si fue fiado)
    if (venta.metodoPago === 'fiado' && venta.clienteId) {
      const creditos = await ctx.db
        .query('creditos')
        .withIndex('by_cliente', q => q.eq('clienteId', venta.clienteId!))
        .filter(q => q.eq(q.field('estado'), 'activo'))
        .collect()

      // Buscar el crédito afectado (simplificación: revertir del saldo actual del crédito activo)
      // Idealmente rastrearías qué crédito específico se tocó, pero asumimos el activo.
      for (const c of creditos) {
        // Restar el monto que se había sumado
        const nuevoSaldo = Math.max(0, c.saldoActual - venta.total)
        await ctx.db.patch(c._id, {
          saldoActual: nuevoSaldo,
          notas:
            (c.notas || '') +
            `\n- Venta rechazada (Reversión): -${venta.total}`,
        })
      }
    }

    // 3. Revertir Estadísticas Cliente
    if (venta.clienteId) {
      const cliente = await ctx.db.get(venta.clienteId)
      if (cliente) {
        await ctx.db.patch(venta.clienteId, {
          totalCompras: Math.max(0, (cliente.totalCompras || 0) - venta.total),
          cantidadCompras: Math.max(0, (cliente.cantidadCompras || 0) - 1),
        })
      }
    }

    // 4. Actualizar estados a 'cancelada'
    await ctx.db.patch(args.ventaId, {
      estado: 'cancelada',
      notas: (venta.notas || '') + ` | RECHAZADA: ${args.motivo || ''}`,
    })

    if (venta.compraOnlineId) {
      await ctx.db.patch(venta.compraOnlineId, {
        estado: 'cancelada',
      })
    }

    return { success: true }
  },
})

// Obtener ventas pendientes por tienda
export const getVentasPendientes = query({
  args: { tiendaId: v.id('tiendas') },
  handler: async (ctx, args) => {
    // Ventas pendientes (canal online generalmente)
    const ventas = await ctx.db
      .query('ventas')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .filter(q => q.eq(q.field('estado'), 'pendiente'))
      .collect()

    return await Promise.all(
      ventas.map(async v => {
        const cliente = v.clienteId ? await ctx.db.get(v.clienteId) : null
        return {
          ...v,
          clienteNombre: cliente?.nombre || 'Cliente web',
        }
      })
    )
  },
})

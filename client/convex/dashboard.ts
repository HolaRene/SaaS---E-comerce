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

// ==================== DASHBOARD EMPRESARIAL ====================
/**
 * Queries optimizadas para agregar datos de múltiples tiendas
 * Solo incluye tiendas donde el usuario es PROPIETARIO (no miembro)
 */

/**
 * Obtiene métricas agregadas de todas las tiendas del propietario
 * Optimizado: Una sola query por tienda, cálculos en memoria
 */
export const getEmpresarialMetrics = query({
  args: {
    propietarioId: v.id('usuarios'),
    periodo: v.union(v.literal('today'), v.literal('week'), v.literal('month')),
  },
  handler: async (ctx, args) => {
    try {
      // 1. Obtener todas las tiendas del propietario
      const tiendas = await ctx.db
        .query('tiendas')
        .withIndex('by_propietario', q =>
          q.eq('propietario', args.propietarioId)
        )
        .collect()

      if (tiendas.length === 0) {
        return {
          ventas: 0,
          crecimiento: 0,
          pedidos: 0,
          alertas: 0,
          tiendasCount: 0,
        }
      }

      // 2. Calcular rango de fechas según período
      const ahora = new Date()
      let inicioPeriodo = new Date()
      let inicioAnterior = new Date()

      switch (args.periodo) {
        case 'today':
          inicioPeriodo = new Date(
            ahora.getFullYear(),
            ahora.getMonth(),
            ahora.getDate()
          )
          inicioAnterior = new Date(
            ahora.getFullYear(),
            ahora.getMonth(),
            ahora.getDate() - 1
          )
          break
        case 'week':
          const diaSemana = ahora.getDay()
          inicioPeriodo = new Date(
            ahora.getFullYear(),
            ahora.getMonth(),
            ahora.getDate() - diaSemana
          )
          inicioAnterior = new Date(
            inicioPeriodo.getTime() - 7 * 24 * 60 * 60 * 1000
          )
          break
        case 'month':
          inicioPeriodo = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
          inicioAnterior = new Date(
            ahora.getFullYear(),
            ahora.getMonth() - 1,
            1
          )
          break
      }

      // 3. Obtener ventas de todas las tiendas en paralelo
      const ventasPromises = tiendas.map(tienda =>
        ctx.db
          .query('ventas')
          .withIndex('by_tienda', q => q.eq('tiendaId', tienda._id))
          .filter(q => q.eq(q.field('estado'), 'completada'))
          .collect()
      )

      const ventasPorTienda = await Promise.all(ventasPromises)
      const todasLasVentas = ventasPorTienda.flat()

      // 4. Filtrar por período actual y anterior
      const ventasPeriodoActual = todasLasVentas.filter(v => {
        const fecha = new Date(v.fecha)
        return fecha >= inicioPeriodo
      })

      const ventasPeriodoAnterior = todasLasVentas.filter(v => {
        const fecha = new Date(v.fecha)
        return fecha >= inicioAnterior && fecha < inicioPeriodo
      })

      // 5. Calcular métricas
      const ventasTotales = ventasPeriodoActual.reduce(
        (sum, v) => sum + (v.total || 0),
        0
      )
      const pedidosTotales = ventasPeriodoActual.length
      const ventasAnterior = ventasPeriodoAnterior.reduce(
        (sum, v) => sum + (v.total || 0),
        0
      )

      const crecimiento =
        ventasAnterior > 0
          ? ((ventasTotales - ventasAnterior) / ventasAnterior) * 100
          : 0

      // 6. Contar alertas (stock bajo, créditos vencidos, ventas pendientes)
      let alertasCount = 0

      for (const tienda of tiendas) {
        // Stock bajo
        const productos = await ctx.db
          .query('productos')
          .withIndex('by_tienda', q => q.eq('tiendaId', tienda._id))
          .collect()
        alertasCount += productos.filter(p => p.cantidad < 10).length

        // Créditos vencidos/próximos a vencer
        const creditos = await ctx.db
          .query('creditos')
          .withIndex('by_tienda', q => q.eq('tiendaId', tienda._id))
          .filter(q => q.eq(q.field('estado'), 'activo'))
          .collect()

        const hoy = new Date()
        alertasCount += creditos.filter(c => {
          if (!c.fechaVencimiento) return false
          const fechaVenc = new Date(c.fechaVencimiento)
          const diasDiferencia = Math.ceil(
            (fechaVenc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
          )
          return diasDiferencia <= 3
        }).length

        // Ventas pendientes
        const ventasPendientes = await ctx.db
          .query('ventas')
          .withIndex('by_tienda', q => q.eq('tiendaId', tienda._id))
          .filter(q => q.eq(q.field('estado'), 'pendiente'))
          .collect()
        alertasCount += ventasPendientes.length
      }

      return {
        ventas: Math.round(ventasTotales),
        crecimiento: Number(crecimiento.toFixed(1)),
        pedidos: pedidosTotales,
        alertas: alertasCount,
        tiendasCount: tiendas.length,
      }
    } catch (error) {
      console.error('Error en getEmpresarialMetrics:', error)
      return {
        ventas: 0,
        crecimiento: 0,
        pedidos: 0,
        alertas: 0,
        tiendasCount: 0,
      }
    }
  },
})

/**
 * Obtiene las top N tiendas por rendimiento
 * Optimizado: Cálculos en memoria después de obtener datos
 */
export const getTopStoresPerformance = query({
  args: {
    propietarioId: v.id('usuarios'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      const limite = args.limit || 5

      // 1. Obtener tiendas del propietario
      const tiendas = await ctx.db
        .query('tiendas')
        .withIndex('by_propietario', q =>
          q.eq('propietario', args.propietarioId)
        )
        .collect()

      if (tiendas.length === 0) return []

      // 2. Calcular métricas para cada tienda
      const ahora = new Date()
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
      const inicioMesAnterior = new Date(
        ahora.getFullYear(),
        ahora.getMonth() - 1,
        1
      )

      const performancePromises = tiendas.map(async tienda => {
        // Ventas del mes actual
        const ventasMes = await ctx.db
          .query('ventas')
          .withIndex('by_tienda', q => q.eq('tiendaId', tienda._id))
          .filter(q => q.eq(q.field('estado'), 'completada'))
          .collect()

        const ventasMesActual = ventasMes.filter(
          v => new Date(v.fecha) >= inicioMes
        )
        const ventasMesAnterior = ventasMes.filter(
          v =>
            new Date(v.fecha) >= inicioMesAnterior &&
            new Date(v.fecha) < inicioMes
        )

        const salesActual = ventasMesActual.reduce(
          (sum, v) => sum + (v.total || 0),
          0
        )
        const salesAnterior = ventasMesAnterior.reduce(
          (sum, v) => sum + (v.total || 0),
          0
        )

        const growth =
          salesAnterior > 0
            ? ((salesActual - salesAnterior) / salesAnterior) * 100
            : 0

        // Determinar estado según crecimiento
        let status: 'excellent' | 'good' | 'warning' | 'critical'
        if (growth >= 15) status = 'excellent'
        else if (growth >= 5) status = 'good'
        else if (growth >= -5) status = 'warning'
        else status = 'critical'

        return {
          storeId: tienda._id,
          storeName: tienda.nombre,
          region: tienda.departamento || 'Sin región',
          sales: Math.round(salesActual),
          growth: Number(growth.toFixed(1)),
          orders: ventasMesActual.length,
          status,
        }
      })

      const performance = await Promise.all(performancePromises)

      // 3. Ordenar por ventas y limitar
      return performance.sort((a, b) => b.sales - a.sales).slice(0, limite)
    } catch (error) {
      console.error('Error en getTopStoresPerformance:', error)
      return []
    }
  },
})

/**
 * Obtiene alertas críticas de todas las tiendas
 * Incluye: stock bajo, créditos vencidos, ventas pendientes
 */
export const getEmpresarialAlerts = query({
  args: {
    propietarioId: v.id('usuarios'),
  },
  handler: async (ctx, args) => {
    try {
      const tiendas = await ctx.db
        .query('tiendas')
        .withIndex('by_propietario', q =>
          q.eq('propietario', args.propietarioId)
        )
        .collect()

      if (tiendas.length === 0) return []

      const alertas: Array<{
        id: string
        storeId: Id<'tiendas'>
        storeName: string
        type: 'critical' | 'warning' | 'info'
        message: string
        timestamp: string
      }> = []

      const hoy = new Date()

      for (const tienda of tiendas) {
        // 1. Stock bajo (< 10 unidades)
        const productos = await ctx.db
          .query('productos')
          .withIndex('by_tienda', q => q.eq('tiendaId', tienda._id))
          .collect()

        const productosStockBajo = productos.filter(p => p.cantidad < 10)
        if (productosStockBajo.length > 0) {
          alertas.push({
            id: `stock-${tienda._id}`,
            storeId: tienda._id,
            storeName: tienda.nombre,
            type: productosStockBajo.length > 5 ? 'critical' : 'warning',
            message: `${productosStockBajo.length} producto(s) con stock bajo`,
            timestamp: hoy.toISOString(),
          })
        }

        // 2. Créditos vencidos o próximos a vencer (3 días)
        const creditos = await ctx.db
          .query('creditos')
          .withIndex('by_tienda', q => q.eq('tiendaId', tienda._id))
          .filter(q => q.eq(q.field('estado'), 'activo'))
          .collect()

        const creditosVencidos = creditos.filter(c => {
          if (!c.fechaVencimiento) return false
          const fechaVenc = new Date(c.fechaVencimiento)
          const diasDiferencia = Math.ceil(
            (fechaVenc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
          )
          return diasDiferencia <= 3
        })

        if (creditosVencidos.length > 0) {
          alertas.push({
            id: `creditos-${tienda._id}`,
            storeId: tienda._id,
            storeName: tienda.nombre,
            type: 'warning',
            message: `${creditosVencidos.length} crédito(s) próximo(s) a vencer`,
            timestamp: hoy.toISOString(),
          })
        }

        // 3. Ventas pendientes (pedidos web sin aprobar)
        const ventasPendientes = await ctx.db
          .query('ventas')
          .withIndex('by_tienda', q => q.eq('tiendaId', tienda._id))
          .filter(q => q.eq(q.field('estado'), 'pendiente'))
          .collect()

        if (ventasPendientes.length > 0) {
          alertas.push({
            id: `pendientes-${tienda._id}`,
            storeId: tienda._id,
            storeName: tienda.nombre,
            type: 'info',
            message: `${ventasPendientes.length} pedido(s) web pendiente(s) de aprobación`,
            timestamp: hoy.toISOString(),
          })
        }
      }

      // Ordenar por tipo (critical > warning > info) y luego por timestamp
      const prioridad = { critical: 0, warning: 1, info: 2 }
      return alertas.sort((a, b) => {
        if (prioridad[a.type] !== prioridad[b.type]) {
          return prioridad[a.type] - prioridad[b.type]
        }
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })
    } catch (error) {
      console.error('Error en getEmpresarialAlerts:', error)
      return []
    }
  },
})

/**
 * Agrupa tiendas por departamento y calcula métricas
 * Optimizado: Agrupa en memoria después de obtener datos
 */
export const getRegionalMetrics = query({
  args: {
    propietarioId: v.id('usuarios'),
  },
  handler: async (ctx, args) => {
    try {
      const tiendas = await ctx.db
        .query('tiendas')
        .withIndex('by_propietario', q =>
          q.eq('propietario', args.propietarioId)
        )
        .collect()

      if (tiendas.length === 0) return []

      // Agrupar por departamento
      const porDepartamento: Record<
        string,
        { sales: number; growths: number[]; stores: number }
      > = {}

      const ahora = new Date()
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
      const inicioMesAnterior = new Date(
        ahora.getFullYear(),
        ahora.getMonth() - 1,
        1
      )

      for (const tienda of tiendas) {
        const region = tienda.departamento || 'Sin región'

        if (!porDepartamento[region]) {
          porDepartamento[region] = { sales: 0, growths: [], stores: 0 }
        }

        // Ventas del mes
        const ventas = await ctx.db
          .query('ventas')
          .withIndex('by_tienda', q => q.eq('tiendaId', tienda._id))
          .filter(q => q.eq(q.field('estado'), 'completada'))
          .collect()

        const ventasMesActual = ventas.filter(
          v => new Date(v.fecha) >= inicioMes
        )
        const ventasMesAnterior = ventas.filter(
          v =>
            new Date(v.fecha) >= inicioMesAnterior &&
            new Date(v.fecha) < inicioMes
        )

        const salesActual = ventasMesActual.reduce(
          (sum, v) => sum + (v.total || 0),
          0
        )
        const salesAnterior = ventasMesAnterior.reduce(
          (sum, v) => sum + (v.total || 0),
          0
        )

        const growth =
          salesAnterior > 0
            ? ((salesActual - salesAnterior) / salesAnterior) * 100
            : 0

        porDepartamento[region].sales += salesActual
        porDepartamento[region].growths.push(growth)
        porDepartamento[region].stores += 1
      }

      // Convertir a array y calcular promedio de crecimiento
      return Object.entries(porDepartamento).map(([region, data]) => ({
        region,
        sales: Math.round(data.sales),
        growth: Number(
          (
            data.growths.reduce((sum, g) => sum + g, 0) / data.growths.length
          ).toFixed(1)
        ),
        stores: data.stores,
      }))
    } catch (error) {
      console.error('Error en getRegionalMetrics:', error)
      return []
    }
  },
})

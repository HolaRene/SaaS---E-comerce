import { v } from 'convex/values'
import { query } from './_generated/server'

/**
 * Obtener flujo de caja mensual (ingresos vs egresos)
 */
export const getFlujoCaja = query({
  args: {
    tiendaId: v.id('tiendas'),
    meses: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const meses = args.meses ?? 5

    // Obtener ventas completadas de la tienda
    const ventas = await ctx.db
      .query('ventas')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .filter(q => q.eq(q.field('estado'), 'completada'))
      .collect()

    const ahora = new Date()
    const resultados: Record<string, { ingresos: number; egresos: number }> = {}

    // Inicializar últimos N meses
    for (let i = meses - 1; i >= 0; i--) {
      const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
      resultados[key] = { ingresos: 0, egresos: 0 }
    }

    // Calcular ingresos y egresos por mes
    for (const venta of ventas) {
      const fecha = new Date(venta.fecha)
      const key = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`

      if (!(key in resultados)) continue

      // Sumar ingresos
      resultados[key].ingresos += venta.total || 0

      // Calcular egresos (costos de productos vendidos)
      const detalles = await ctx.db
        .query('detallesVenta')
        .withIndex('by_venta', q => q.eq('ventaId', venta._id))
        .collect()

      for (const detalle of detalles) {
        const producto = await ctx.db.get(detalle.productoId)
        const costoUnitario = producto?.costo ?? 0
        resultados[key].egresos += costoUnitario * detalle.cantidad
      }
    }

    // Convertir a array con nombre de mes
    const salida = Object.entries(resultados).map(([key, data]) => {
      const [y, m] = key.split('-')
      const fecha = new Date(Number(y), Number(m) - 1, 1)
      const nombreMes = fecha.toLocaleString('es-ES', { month: 'long' })
      return {
        mes: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
        ingresos: Math.round(data.ingresos),
        egresos: Math.round(data.egresos),
      }
    })

    return salida
  },
})

/**
 * Obtener cuentas por cobrar (créditos pendientes)
 */
export const getCuentasPorCobrar = query({
  args: { tiendaId: v.id('tiendas') },
  handler: async (ctx, args) => {
    // Obtener créditos activos de la tienda
    const creditos = await ctx.db
      .query('creditos')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .filter(q => q.eq(q.field('estado'), 'activo'))
      .collect()

    const hoy = new Date()

    // Enriquecer con información del cliente y calcular estado
    const cuentas = await Promise.all(
      creditos.map(async credito => {
        const cliente = await ctx.db.get(credito.clienteId)

        // Determinar estado basado en fecha de vencimiento
        let estado = 'Pendiente'
        if (credito.fechaVencimiento) {
          const fechaVenc = new Date(credito.fechaVencimiento)
          const diasParaVencer = Math.ceil(
            (fechaVenc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
          )

          if (diasParaVencer < 0) {
            estado = 'Vencido'
          } else if (diasParaVencer <= 7) {
            estado = 'Por vencer'
          }
        }

        return {
          cliente: cliente?.nombre || 'Cliente desconocido',
          monto: credito.saldoActual,
          fechaVencimiento: credito.fechaVencimiento
            ? new Date(credito.fechaVencimiento).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : 'Sin fecha',
          estado,
        }
      })
    )

    return cuentas
  },
})

/**
 * Obtener resumen financiero del período actual (mes actual)
 */
export const getResumenFinanciero = query({
  args: { tiendaId: v.id('tiendas') },
  handler: async (ctx, args) => {
    const ahora = new Date()
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
    const finMes = new Date(
      ahora.getFullYear(),
      ahora.getMonth() + 1,
      0,
      23,
      59,
      59
    )

    // Obtener ventas del mes actual
    const ventas = await ctx.db
      .query('ventas')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .filter(q => q.eq(q.field('estado'), 'completada'))
      .collect()

    // Filtrar por mes actual
    const ventasMesActual = ventas.filter(v => {
      const fecha = new Date(v.fecha)
      return fecha >= inicioMes && fecha <= finMes
    })

    let ingresos = 0
    let egresos = 0

    // Calcular ingresos y egresos
    for (const venta of ventasMesActual) {
      ingresos += venta.total || 0

      // Calcular egresos (costos)
      const detalles = await ctx.db
        .query('detallesVenta')
        .withIndex('by_venta', q => q.eq('ventaId', venta._id))
        .collect()

      for (const detalle of detalles) {
        const producto = await ctx.db.get(detalle.productoId)
        const costoUnitario = producto?.costo ?? 0
        egresos += costoUnitario * detalle.cantidad
      }
    }

    const resultado = ingresos - egresos

    return {
      ingresos: Math.round(ingresos),
      egresos: Math.round(egresos),
      resultado: Math.round(resultado),
    }
  },
})

/**
 * Obtener proyección de ventas basada en tendencia histórica
 */
export const getProyeccionVentas = query({
  args: {
    tiendaId: v.id('tiendas'),
    mesesHistoricos: v.optional(v.number()),
    mesesProyectados: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const mesesHistoricos = args.mesesHistoricos ?? 3
    const mesesProyectados = args.mesesProyectados ?? 3

    // Obtener ventas históricas
    const ventas = await ctx.db
      .query('ventas')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .filter(q => q.eq(q.field('estado'), 'completada'))
      .collect()

    const ahora = new Date()
    const ventasPorMes: Record<string, number> = {}

    // Inicializar meses históricos
    for (let i = mesesHistoricos - 1; i >= 0; i--) {
      const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
      ventasPorMes[key] = 0
    }

    // Sumar ventas por mes
    for (const venta of ventas) {
      const fecha = new Date(venta.fecha)
      const key = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`

      if (key in ventasPorMes) {
        ventasPorMes[key] += venta.total || 0
      }
    }

    // Calcular tasa de crecimiento promedio
    const valores = Object.values(ventasPorMes)
    let tasaCrecimiento = 0

    if (valores.length > 1) {
      let sumaCrec = 0
      let count = 0

      for (let i = 1; i < valores.length; i++) {
        if (valores[i - 1] > 0) {
          const crec = (valores[i] - valores[i - 1]) / valores[i - 1]
          sumaCrec += crec
          count++
        }
      }

      tasaCrecimiento = count > 0 ? sumaCrec / count : 0.08 // 8% por defecto
    } else {
      tasaCrecimiento = 0.08 // 8% por defecto si no hay suficientes datos
    }

    // Crear array de resultados con datos históricos
    const resultado: Array<{
      mes: string
      ventas: number
      tipo: 'real' | 'proyectado'
    }> = Object.entries(ventasPorMes).map(([key, total]) => {
      const [y, m] = key.split('-')
      const fecha = new Date(Number(y), Number(m) - 1, 1)
      const nombreMes = fecha.toLocaleString('es-ES', { month: 'short' })
      return {
        mes: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
        ventas: Math.round(total),
        tipo: 'real',
      }
    })

    // Agregar proyecciones
    const ultimoValor = valores[valores.length - 1] || 0
    let valorProyectado = ultimoValor

    for (let i = 1; i <= mesesProyectados; i++) {
      valorProyectado = valorProyectado * (1 + tasaCrecimiento)
      const d = new Date(ahora.getFullYear(), ahora.getMonth() + i, 1)
      const nombreMes = d.toLocaleString('es-ES', { month: 'short' })

      resultado.push({
        mes: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
        ventas: Math.round(valorProyectado),
        tipo: 'proyectado',
      })
    }

    return resultado
  },
})

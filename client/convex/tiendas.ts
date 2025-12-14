import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { internal } from './_generated/api'
import { Id } from './_generated/dataModel'

export const getTiendaById = query({
  args: { id: v.id('tiendas') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const buscarTiendas = query({
  args: {
    search: v.optional(v.string()),
    departamento: v.optional(v.string()),
    categoria: v.optional(v.string()),
    puntuacionMinima: v.optional(v.number()),
    limite: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limite = args.limite ?? 20

    // ✅ CASO 1: Con búsqueda de texto (sin .order() - ya está ordenado por relevancia)
    if (args.search && args.search.trim() !== '') {
      let consulta = ctx.db
        .query('tiendas')
        .withSearchIndex('search_nombre', q =>
          q.search('nombre', args.search.trim())
        )
        .filter(q => q.eq(q.field('publica'), true))
        .filter(q =>
          q.or(
            q.eq(q.field('estado'), 'activo'),
            q.eq(q.field('estado'), 'pendiente')
          )
        )

      if (args.departamento) {
        consulta = consulta.filter(q =>
          q.eq(q.field('departamento'), args.departamento)
        )
      }

      if (args.categoria) {
        consulta = consulta.filter(q =>
          q.eq(q.field('categoria'), args.categoria)
        )
      }

      if (args.puntuacionMinima !== undefined) {
        consulta = consulta.filter(q =>
          q.gte(q.field('puntuacion'), args.puntuacionMinima)
        )
      }

      return await consulta.take(limite)
    }

    // ✅ CASO 2: Sin búsqueda de texto (usa índice + .order())
    // Usamos el índice por `publica` y luego filtramos por estados
    // (activo | pendiente) para alinear el comportamiento con `getTiendasPublicas`.
    let consulta = ctx.db
      .query('tiendas')
      .withIndex('by_publica', q => q.eq('publica', true))
      .filter(q =>
        q.or(
          q.eq(q.field('estado'), 'activo'),
          q.eq(q.field('estado'), 'pendiente')
        )
      )

    if (args.departamento) {
      consulta = consulta.filter(q =>
        q.eq(q.field('departamento'), args.departamento)
      )
    }

    if (args.categoria) {
      consulta = consulta.filter(q =>
        q.eq(q.field('categoria'), args.categoria)
      )
    }

    if (args.puntuacionMinima !== undefined) {
      consulta = consulta.filter(q =>
        q.gte(q.field('puntuacion'), args.puntuacionMinima)
      )
    }

    // Ordenar por `puntuacion` en memoria si el índice no permite orden directo
    const resultados = await consulta.collect()
    resultados.sort((a, b) => (b.puntuacion || 0) - (a.puntuacion || 0))
    return resultados.slice(0, limite)
  },
})

export const updateTienda = mutation({
  args: {
    id: v.id('tiendas'),
    nombre: v.optional(v.string()),
    descripcion: v.optional(v.string()),
    direccion: v.optional(v.string()),
    telefono: v.optional(v.string()),
    departamento: v.optional(v.string()),
    avatar: v.optional(v.string()),
    imgBanner: v.optional(v.string()),
    categoria: v.optional(v.string()),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    publica: v.optional(v.boolean()), // Asegurarnos que existía o agregarlo si faltaba en el mutation original
    configuracion: v.optional(
      v.object({
        NIT: v.optional(v.string()),
        RUC: v.optional(v.string()),
        moneda: v.string(),
        whatsapp: v.optional(v.string()),
        backup: v.optional(v.string()),
        permisosTienda: v.object({
          vendedoresPuedenCrearProductos: v.boolean(),
          vendedoresPuedenModificarPrecios: v.boolean(),
          vendedoresPuedenVerReportes: v.boolean(),
          maxVendedores: v.number(),
        }),
      })
    ),
    horarios: v.optional(
      v.array(
        v.object({
          dia: v.string(),
          apertura: v.string(),
          cierre: v.string(),
          cerrado: v.boolean(),
          aperturaEspecial: v.optional(v.string()),
          cierreEspecial: v.optional(v.string()),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args
    const tienda = await ctx.db.get(id)

    if (!tienda) {
      throw new ConvexError('Tienda no encontrada')
    }
    const nombreAntiguo = tienda.nombre
    const nombreNuevo = fields.nombre

    // Gestionar borrado de AVATAR anterior
    if (
      fields.avatar &&
      tienda.avatar &&
      tienda.avatar !== fields.avatar &&
      !tienda.avatar.startsWith('/') // No borrar assets por defecto
    ) {
      try {
        const parts = tienda.avatar.split('/')
        const storageId = parts[parts.length - 1] as Id<'_storage'>
        await ctx.storage.delete(storageId)
      } catch (error) {
        console.error('Error eliminando avatar anterior:', error)
      }
    }

    // Gestionar borrado de BANNER anterior
    if (
      fields.imgBanner &&
      tienda.imgBanner &&
      tienda.imgBanner !== fields.imgBanner &&
      !tienda.imgBanner.startsWith('/') // No borrar assets por defecto
    ) {
      try {
        const parts = tienda.imgBanner.split('/')
        const storageId = parts[parts.length - 1] as Id<'_storage'>
        await ctx.storage.delete(storageId)
      } catch (error) {
        console.error('Error eliminando banner anterior:', error)
      }
    }

    await ctx.db.patch(id, {
      ...fields,
      ultimaActualizacion: new Date().toISOString(),
    })
    // 🔔 NOTIFICAR SOLO SI CAMBIÓ EL NOMBRE
    if (nombreNuevo && nombreAntiguo !== nombreNuevo) {
      await ctx.scheduler.runAfter(
        0,
        internal.notificaciones.crearNotificacionesParaFavoritos,
        {
          tipo: 'tienda_nombre_cambiado',
          tiendaId: id,
          datos: {
            nombreAntiguo,
            nombreNuevo,
          },
        }
      )
    }

    // 🔔 NOTIFICAR SI SE HACE PÚBLICA (NUEVA TIENDA)
    // Si antes no era pública y ahora si (o si estaba pendiente y pasa a activo, etc)
    // El trigger sencillo es: publica: true (y antes false)
    if (fields.publica === true && !tienda.publica) {
      // Validar que tenga departamento set
      const depto = fields.departamento || tienda.departamento
      const nombre = fields.nombre || tienda.nombre

      if (depto && nombre) {
        await ctx.scheduler.runAfter(
          0,
          internal.notificaciones.crearNotificacionNuevaTienda,
          {
            tiendaId: id,
            nombreTienda: nombre,
            departamento: depto,
          }
        )
      }
    }
  },
})

export const incrementarVisitas = mutation({
  args: { id: v.id('tiendas') },
  handler: async (ctx, args) => {
    const tienda = await ctx.db.get(args.id)
    if (tienda) {
      await ctx.db.patch(args.id, {
        visitas: (tienda.visitas || 0) + 1,
      })
    }
  },
})

export const deleteTienda = mutation({
  args: { id: v.id('tiendas') },
  handler: async (ctx, args) => {
    const tiendaId = args.id

    // 0. Obtener la tienda para borrar sus IMÁGENES
    const tienda = await ctx.db.get(tiendaId)
    if (tienda) {
      if (tienda.avatar && !tienda.avatar.startsWith('/')) {
        try {
          const parts = tienda.avatar.split('/')
          const storageId = parts[parts.length - 1] as Id<'_storage'>
          await ctx.storage.delete(storageId)
        } catch (error) {
          console.error('Error eliminando avatar de tienda:', error)
        }
      }
      if (tienda.imgBanner && !tienda.imgBanner.startsWith('/')) {
        try {
          const parts = tienda.imgBanner.split('/')
          const storageId = parts[parts.length - 1] as Id<'_storage'>
          await ctx.storage.delete(storageId)
        } catch (error) {
          console.error('Error eliminando banner de tienda:', error)
        }
      }
    }

    // 1. Obtener y eliminar VENTAS y sus dependencias
    const ventas = await ctx.db
      .query('ventas')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()

    for (const venta of ventas) {
      // Eliminar detalles de venta
      const detalles = await ctx.db
        .query('detallesVenta')
        .withIndex('by_venta', q => q.eq('ventaId', venta._id))
        .collect()
      for (const detalle of detalles) await ctx.db.delete(detalle._id)

      // Eliminar recordatorios de cobro
      const recordatorios = await ctx.db
        .query('recordatoriosCobro')
        .withIndex('by_venta', q => q.eq('ventaId', venta._id))
        .collect()
      for (const rec of recordatorios) await ctx.db.delete(rec._id)

      // Eliminar la venta
      await ctx.db.delete(venta._id)
    }

    // 2. Obtener y eliminar PRODUCTOS y sus dependencias
    const productos = await ctx.db
      .query('productos')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()

    for (const producto of productos) {
      // Eliminar reseñas de productos
      const resenas = await ctx.db
        .query('resenasProductos')
        .withIndex('by_producto', q => q.eq('productoId', producto._id))
        .collect()
      for (const resena of resenas) await ctx.db.delete(resena._id)

      // Eliminar el producto
      await ctx.db.delete(producto._id)
    }

    // 3. Eliminar tablas directas por tiendaId
    const tablesToDelete = [
      'clientes',
      'creditos',
      'pagosCredito',
      'movimientosInventario',
      'resenasTienda',
      'historialProductos',
      'etiquetas',
      'productoEtiquetas',
      'recordatorios',
      'clientesFrecuentes',
      // "documentos", // Excluido por solicitud
      // "hojasCalculo" // Excluido por solicitud
    ]

    // Helper para borrar por tiendaId (si la tabla tiene índice by_tienda)
    // Nota: TypeScript no inferirá dinámicamente los nombres de tabla aquí fácilmente,
    // así que lo hacemos explícito o uno por uno para seguridad de tipos.

    // Clientes
    const clientes = await ctx.db
      .query('clientes')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const c of clientes) await ctx.db.delete(c._id)

    // Creditos
    const creditos = await ctx.db
      .query('creditos')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const c of creditos) await ctx.db.delete(c._id)

    // PagosCredito
    const pagos = await ctx.db
      .query('pagosCredito')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const p of pagos) await ctx.db.delete(p._id)

    // MovimientosInventario
    const movimientos = await ctx.db
      .query('movimientosInventario')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const m of movimientos) await ctx.db.delete(m._id)

    // ResenasTienda
    const resenasT = await ctx.db
      .query('resenasTienda')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const r of resenasT) await ctx.db.delete(r._id)

    // HistorialProductos
    const historial = await ctx.db
      .query('historialProductos')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const h of historial) await ctx.db.delete(h._id)

    // Etiquetas
    const etiquetas = await ctx.db
      .query('etiquetas')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const e of etiquetas) await ctx.db.delete(e._id)

    // ProductoEtiquetas
    const prodEtiquetas = await ctx.db
      .query('productoEtiquetas')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const pe of prodEtiquetas) await ctx.db.delete(pe._id)

    // Recordatorios
    const recordatorios = await ctx.db
      .query('recordatorios')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const r of recordatorios) await ctx.db.delete(r._id)

    // ClientesFrecuentes
    const clientesF = await ctx.db
      .query('clientesFrecuentes')
      .withIndex('by_tienda', q => q.eq('tiendaId', tiendaId))
      .collect()
    for (const cf of clientesF) await ctx.db.delete(cf._id)

    // 4. Eliminar la tienda
    await ctx.db.delete(tiendaId)
  },
})

// ==========================================
// QUERIES PARA MARKETPLACE PÚBLICO
// ==========================================

/**
 * Obtiene todas las tiendas públicas activas o pendientes
 * Para mostrar en el marketplace de usuarios
 */
export const getTiendasPublicas = query({
  args: {},
  handler: async ctx => {
    const tiendas = await ctx.db
      .query('tiendas')
      .withIndex('by_publica', q => q.eq('publica', true))
      .filter(q =>
        q.or(
          q.eq(q.field('estado'), 'activo'),
          q.eq(q.field('estado'), 'pendiente')
        )
      )
      .collect()

    return tiendas
  },
})

/**
 * Obtiene una tienda pública por ID
 * Retorna si es pública y está activa o pendiente
 */
export const getTiendaPublicaById = query({
  args: { id: v.id('tiendas') },
  handler: async (ctx, args) => {
    const tienda = await ctx.db.get(args.id)

    // Solo retornar si es pública y activa/pendiente
    if (
      !tienda ||
      !tienda.publica ||
      (tienda.estado !== 'activo' && tienda.estado !== 'pendiente')
    ) {
      return null
    }

    return tienda
  },
})

/**
 * Obtiene productos públicos de una tienda
 * Solo productos activos y públicos
 */
export const getProductosPublicosByTienda = query({
  args: { tiendaId: v.id('tiendas') },
  handler: async (ctx, args) => {
    const productos = await ctx.db
      .query('productos')
      .withIndex('by_tienda_publica', q =>
        q.eq('tiendaId', args.tiendaId).eq('publica', true)
      )
      .filter(q => q.eq(q.field('estado'), 'activo'))
      .collect()

    return productos
  },
})

/**
 * Obtiene reseñas activas de una tienda
 */
export const getResenasPublicasByTienda = query({
  args: { tiendaId: v.id('tiendas') },
  handler: async (ctx, args) => {
    const resenas = await ctx.db
      .query('resenasTienda')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .filter(q => q.eq(q.field('estado'), 'activa'))
      .collect()

    // Obtener información de los clientes para cada reseña
    const resenasConCliente = await Promise.all(
      resenas.map(async resena => {
        const cliente = await ctx.db.get(resena.clienteId)
        return {
          ...resena,
          clienteNombre: cliente?.nombre || 'Usuario',
          clienteImagen: cliente?.imgUrl || '/placeholder.svg',
        }
      })
    )

    return resenasConCliente
  },
})

export const getTiendasByPropietario = query({
  args: { propietarioId: v.id('usuarios') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError('No autenticado')
    }

    const tiendas = await ctx.db
      .query('tiendas')
      .withIndex('by_propietario', q => q.eq('propietario', args.propietarioId))
      .collect()

    return tiendas ?? null
  },
})

export const crearTienda = mutation({
  args: {
    nombre: v.string(),
    categoria: v.string(),
    descripcion: v.string(),
    direccion: v.string(),
    telefono: v.string(),
    departamento: v.string(),
    lat: v.number(),
    lng: v.number(),
    avatar: v.optional(v.string()),
    imgBanner: v.optional(v.string()),

    configuracion: v.object({
      NIT: v.optional(v.string()),
      RUC: v.optional(v.string()),
      moneda: v.string(),
      whatsapp: v.optional(v.string()),
      backup: v.optional(v.string()),
      permisosTienda: v.object({
        vendedoresPuedenCrearProductos: v.boolean(),
        vendedoresPuedenModificarPrecios: v.boolean(),
        vendedoresPuedenVerReportes: v.boolean(),
        maxVendedores: v.number(),
      }),
    }),

    horarios: v.array(
      v.object({
        dia: v.string(),
        apertura: v.string(),
        cierre: v.string(),
        cerrado: v.boolean(),
        aperturaEspecial: v.optional(v.string()),
        cierreEspecial: v.optional(v.string()),
      })
    ),
  },

  handler: async (ctx, args) => {
    // Obtener usuario actual desde Clerk
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('No autenticado este diablo falla')

    // Buscar usuario en la DB Convex
    const user = await ctx.db
      .query('usuarios')
      .filter(q => q.eq(q.field('correo'), identity.email))
      .collect()
    if (user.length === 0) throw new ConvexError('Usuario no encontrado')

    // Validar límite de tiendas según plan del usuario
    const { getLimitesPlan, excedeLimite } = await import('./planes')

    // Contar tiendas actuales del usuario
    const tiendasActuales = await ctx.db
      .query('tiendas')
      .withIndex('by_propietario', q => q.eq('propietario', user[0]._id))
      .collect()

    // Por ahora asumimos plan gratis, cuando implementes usuarios con planes,
    // deberás obtener el plan del usuario desde la tabla usuarios
    const planUsuario = 'gratis' // TODO: Obtener de user[0].plan cuando exista
    const limites = getLimitesPlan(planUsuario)

    if (excedeLimite(tiendasActuales.length, limites.tiendas)) {
      throw new ConvexError(
        `Límite alcanzado. El plan ${limites.nombre} permite máximo ${limites.tiendas} tienda(s). Actualiza tu plan para crear más.`
      )
    }

    const tiendaId = await ctx.db.insert('tiendas', {
      avatar: args.avatar ?? '/icons/icons8-tienda-80.png',
      imgBanner: args.imgBanner ?? '/icons/icons8-tienda-80.png',
      nombre: args.nombre,
      categoria: args.categoria,
      descripcion: args.descripcion,
      direccion: args.direccion,
      lat: args.lat,
      lng: args.lng,
      puntuacion: 5, // ✔ obligatorio
      telefono: args.telefono,
      propietario: user[0]._id, // ✔ tu ID del usuario logueado
      estado: 'pendiente', // ✔ obligatorio
      ventasHoy: 0, // ✔ obligatorio
      departamento: args.departamento,
      miembros: [
        {
          usuarioId: user[0]._id,
          rol: 'admin',
          fechaUnion: new Date().toISOString(),
          permisos: ['full_access'],
        },
      ],
      configuracion: {
        NIT: args.configuracion?.NIT ?? '',
        RUC: args.configuracion?.RUC ?? '',
        moneda: args.configuracion?.moneda ?? 'NIO',
        whatsapp: args.configuracion?.whatsapp ?? '',
        backup: args.configuracion?.backup ?? '',
        permisosTienda: {
          vendedoresPuedenCrearProductos:
            args.configuracion?.permisosTienda
              ?.vendedoresPuedenCrearProductos ?? true,
          vendedoresPuedenModificarPrecios:
            args.configuracion?.permisosTienda
              ?.vendedoresPuedenModificarPrecios ?? false,
          vendedoresPuedenVerReportes:
            args.configuracion?.permisosTienda?.vendedoresPuedenVerReportes ??
            false,
          maxVendedores: args.configuracion?.permisosTienda?.maxVendedores ?? 5,
        },
      },
      favoritos: 0,
      likes: 0,
      publica: true,
      visitas: 0,
      estadisticas: {
        clientesTotales: 0,
        productosActivos: 0,
        ventasTotales: 0,
      },
      delivery: {
        costo: 10,
        habilitado: true,
        tiempoEstimado: '1h',
        zonas: ['boaco'],
      },
      facturacion: {
        habilitada: true,
        numeracionActual: 1234,
        serie: 'lo que venga me da igual',
        tipo: 'automatica',
      },
      ultimaActualizacion: new Date().toISOString(),

      horarios: args.horarios,
      metricasEquipo: {
        totalVendedores: 0,
        ventasEsteMes: 0,
        productoMasVendido: undefined,
      },
      creadoEn: new Date().toISOString(),
    })

    return tiendaId
  },
})

// obtener datos metricas
export const getMetricasTienda = query({
  args: {
    tiendaId: v.id('tiendas'),
    periodo: v.union(v.literal('today'), v.literal('week'), v.literal('month')),
  },
  handler: async (ctx, args) => {
    const ahora = new Date()
    let inicioPeriodo = new Date()
    let inicioAnterior = new Date()

    // Calcular rangos de fechas
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
        const diaSemana = ahora.getDay() // 0 = domingo
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
        inicioAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1)
        break
    }

    // Obtener todas las ventas de la tienda
    const ventas = await ctx.db
      .query('ventas')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .collect()

    // Filtrar ventas por período
    const ventasPeriodoActual = ventas.filter(v => {
      const fecha = new Date(v.fecha)
      return fecha >= inicioPeriodo && v.estado === 'completada'
    })

    const ventasPeriodoAnterior = ventas.filter(v => {
      const fecha = new Date(v.fecha)
      return (
        fecha >= inicioAnterior &&
        fecha < inicioPeriodo &&
        v.estado === 'completada'
      )
    })

    // Calcular métricas
    const ventasTotales = ventasPeriodoActual.reduce(
      (sum, v) => sum + (v.total || 0),
      0
    )
    const pedidos = ventasPeriodoActual.length
    const ventasAnterior = ventasPeriodoAnterior.reduce(
      (sum, v) => sum + (v.total || 0),
      0
    )

    // Calcular crecimiento (evitar división por cero)
    const crecimiento =
      ventasAnterior > 0
        ? ((ventasTotales - ventasAnterior) / ventasAnterior) * 100
        : 0

    // ========== ALERTAS ==========
    let alertasCount = 0

    // Alerta 1: Productos con stock bajo (< 10 unidades)
    const productos = await ctx.db
      .query('productos')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .collect()

    const stockBajo = productos.filter(p => p.cantidad < 10).length
    alertasCount += stockBajo

    // Alerta 2: Créditos vencidos o próximos a vencer
    const creditos = await ctx.db
      .query('creditos')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .filter(q => q.eq(q.field('estado'), 'activo'))
      .collect()

    const hoy = new Date()
    const creditosVencidos = creditos.filter(c => {
      if (!c.fechaVencimiento) return false
      const fechaVenc = new Date(c.fechaVencimiento)
      const diasDiferencia = Math.ceil(
        (fechaVenc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
      )
      return diasDiferencia <= 3 // Vence en 3 días o ya vencido
    }).length
    alertasCount += creditosVencidos

    // Alerta 3: Ventas pendientes
    const ventasPendientes = ventas.filter(v => v.estado === 'pendiente').length
    alertasCount += ventasPendientes

    return {
      ventas: Math.round(ventasTotales),
      pedidos,
      crecimiento: Number(crecimiento.toFixed(1)),
      alertas: alertasCount,
      detallesAlertas: {
        stockBajo,
        creditosVencidos,
        ventasPendientes,
      },
    }
  },
})

// obtener ventas diarias por propietario

export const getVentasDiariasByPropietario = query({
  args: {
    propietarioId: v.id('usuarios'),
    dias: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const dias = args.dias || 7
    const hoy = new Date()
    const inicio = new Date(hoy.getTime() - dias * 24 * 60 * 60 * 1000)

    // 1. Obtener TODAS las tiendas del propietario
    const tiendas = await ctx.db
      .query('tiendas')
      .withIndex('by_propietario', q => q.eq('propietario', args.propietarioId))
      .collect()

    const tiendaIds = tiendas.map(t => t._id)

    if (tiendaIds.length === 0) return []

    // 2. Obtener ventas de TODAS las tiendas en el período
    const ventas = await ctx.db
      .query('ventas')
      .withIndex('by_fecha') // Necesitas este índice: .index('by_fecha', ['fecha'])
      .filter(q => q.gte(q.field('fecha'), inicio.toISOString()))
      .filter(q => q.eq(q.field('estado'), 'completada'))
      .collect()

    // Filtrar solo las ventas de las tiendas del propietario
    const ventasPropietario = ventas.filter(v => tiendaIds.includes(v.tiendaId))

    // 3. Agrupar por fecha y sumar
    const ventasPorFecha: Record<string, { sales: number; orders: number }> = {}

    for (const venta of ventasPropietario) {
      const fecha = new Date(venta.fecha).toLocaleDateString('es-AR')
      if (!ventasPorFecha[fecha]) {
        ventasPorFecha[fecha] = { sales: 0, orders: 0 }
      }
      ventasPorFecha[fecha].sales += venta.total || 0
      ventasPorFecha[fecha].orders += 1
    }

    return Object.entries(ventasPorFecha).map(([date, metrics]) => ({
      date,
      ...metrics,
    }))
  },
})

// ==================== MUTATIONS INTERNAS PARA ESTADÍSTICAS ====================
/**
 * Actualiza las estadísticas principales de una tienda
 * Esta es una función interna que se llama desde otras mutations
 */
export const actualizarEstadisticasTienda = mutation({
  args: {
    tiendaId: v.id('tiendas'),
    tipo: v.union(
      v.literal('venta'),
      v.literal('cliente'),
      v.literal('producto')
    ),
    incremento: v.number(), // Puede ser positivo o negativo
  },
  handler: async (ctx, args) => {
    const tienda = await ctx.db.get(args.tiendaId)
    if (!tienda) return

    const estadisticas = { ...tienda.estadisticas }

    switch (args.tipo) {
      case 'venta':
        estadisticas.ventasTotales += args.incremento
        break
      case 'cliente':
        estadisticas.clientesTotales = Math.max(
          0,
          estadisticas.clientesTotales + args.incremento
        )
        break
      case 'producto':
        estadisticas.productosActivos = Math.max(
          0,
          estadisticas.productosActivos + args.incremento
        )
        break
    }

    await ctx.db.patch(args.tiendaId, { estadisticas })
  },
})

/**
 * Actualiza las métricas del equipo de una tienda
 */
export const actualizarMetricasEquipo = mutation({
  args: {
    tiendaId: v.id('tiendas'),
    ventasEsteMes: v.optional(v.number()),
    productoMasVendido: v.optional(v.id('productos')),
  },
  handler: async (ctx, args) => {
    const tienda = await ctx.db.get(args.tiendaId)
    if (!tienda) return

    const metricasEquipo = { ...tienda.metricasEquipo }

    if (args.ventasEsteMes !== undefined) {
      metricasEquipo.ventasEsteMes += args.ventasEsteMes
    }

    if (args.productoMasVendido !== undefined) {
      metricasEquipo.productoMasVendido = args.productoMasVendido
    }

    // Actualizar total de vendedores (miembros)
    metricasEquipo.totalVendedores = tienda.miembros.length

    await ctx.db.patch(args.tiendaId, { metricasEquipo })
  },
})

// ==================== GESTIÓN DE MIEMBROS/VENDEDORES ====================

import { getLimitesPlan, excedeLimite } from './planes'

/**
 * Agregar un nuevo miembro al equipo de la tienda
 * Solo propietario o admin pueden agregar miembros
 */
export const agregarMiembro = mutation({
  args: {
    tiendaId: v.id('tiendas'),
    usuarioId: v.id('usuarios'),
    rol: v.union(
      v.literal('admin'),
      v.literal('vendedor'),
      v.literal('asistente')
    ),
    permisos: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('No autenticado')

    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique()

    if (!usuario) throw new Error('Usuario no encontrado')

    const tienda = await ctx.db.get(args.tiendaId)
    if (!tienda) throw new Error('Tienda no encontrada')

    // Verificar permisos
    const esPropietario = String(tienda.propietario) === String(usuario._id)
    const esAdmin = tienda.miembros.some(
      m => String(m.usuarioId) === String(usuario._id) && m.rol === 'admin'
    )

    if (!esPropietario && !esAdmin) {
      throw new Error('No tienes permiso para agregar miembros')
    }

    // Verificar que el miembro no exista ya
    const yaExiste = tienda.miembros.some(
      m => String(m.usuarioId) === String(args.usuarioId)
    )

    if (yaExiste) {
      throw new Error('Este usuario ya es miembro de la tienda')
    }

    // Validar límite según plan
    const limites = getLimitesPlan(tienda.plan)

    if (excedeLimite(tienda.miembros.length, limites.miembros)) {
      throw new Error(
        `Límite alcanzado. El plan ${limites.nombre} permite máximo ${limites.miembros} miembros. Actualiza tu plan.`
      )
    }

    // Verificar que el usuario a agregar exista
    const usuarioAAgregar = await ctx.db.get(args.usuarioId)
    if (!usuarioAAgregar) {
      throw new Error('El usuario a agregar no existe')
    }

    // Definir permisos según rol
    let permisos = args.permisos
    if (!permisos || permisos.length === 0) {
      switch (args.rol) {
        case 'admin':
          permisos = ['full_access']
          break
        case 'vendedor':
          permisos = [
            'crear_venta',
            'ver_productos',
            'ver_clientes',
            'crear_cliente',
          ]
          if (
            tienda.configuracion.permisosTienda.vendedoresPuedenCrearProductos
          ) {
            permisos.push('crear_producto')
          }
          if (
            tienda.configuracion.permisosTienda.vendedoresPuedenModificarPrecios
          ) {
            permisos.push('editar_precio')
          }
          if (tienda.configuracion.permisosTienda.vendedoresPuedenVerReportes) {
            permisos.push('ver_reportes')
          }
          break
        case 'asistente':
          permisos = ['ver_productos', 'ver_clientes']
          break
      }
    }

    // Agregar nuevo miembro
    const nuevoMiembro = {
      usuarioId: args.usuarioId,
      rol: args.rol,
      fechaUnion: new Date().toISOString(),
      permisos,
    }

    const miembrosActualizados = [...tienda.miembros, nuevoMiembro]

    await ctx.db.patch(args.tiendaId, {
      miembros: miembrosActualizados,
    })

    // Actualizar metricasEquipo.totalVendedores
    const metricasEquipo = { ...tienda.metricasEquipo }
    metricasEquipo.totalVendedores = miembrosActualizados.length
    await ctx.db.patch(args.tiendaId, { metricasEquipo })

    return {
      success: true,
      miembroId: args.usuarioId,
      nombreMiembro: usuarioAAgregar.nombre,
      totalMiembros: miembrosActualizados.length,
      limiteMaximo: limites.miembros,
    }
  },
})

/**
 * Remover un miembro del equipo de la tienda
 */
export const removerMiembro = mutation({
  args: {
    tiendaId: v.id('tiendas'),
    usuarioId: v.id('usuarios'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('No autenticado')

    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique()

    if (!usuario) throw new Error('Usuario no encontrado')

    const tienda = await ctx.db.get(args.tiendaId)
    if (!tienda) throw new Error('Tienda no encontrada')

    // Verificar permisos
    const esPropietario = String(tienda.propietario) === String(usuario._id)
    const esAdmin = tienda.miembros.some(
      m => String(m.usuarioId) === String(usuario._id) && m.rol === 'admin'
    )

    if (!esPropietario && !esAdmin) {
      throw new Error('No tienes permiso para remover miembros')
    }

    // No se puede remover al propietario
    if (String(args.usuarioId) === String(tienda.propietario)) {
      throw new Error('No se puede remover al propietario de la tienda')
    }

    // Remover miembro
    const miembrosActualizados = tienda.miembros.filter(
      m => String(m.usuarioId) !== String(args.usuarioId)
    )

    await ctx.db.patch(args.tiendaId, {
      miembros: miembrosActualizados,
    })

    // Actualizar metricasEquipo.totalVendedores
    const metricasEquipo = { ...tienda.metricasEquipo }
    metricasEquipo.totalVendedores = miembrosActualizados.length
    await ctx.db.patch(args.tiendaId, { metricasEquipo })

    return {
      success: true,
      totalMiembros: miembrosActualizados.length,
    }
  },
})

/**
 * Actualizar rol de un miembro
 */
export const actualizarRolMiembro = mutation({
  args: {
    tiendaId: v.id('tiendas'),
    usuarioId: v.id('usuarios'),
    nuevoRol: v.union(
      v.literal('admin'),
      v.literal('vendedor'),
      v.literal('asistente')
    ),
    nuevosPermisos: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('No autenticado')

    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .unique()

    if (!usuario) throw new Error('Usuario no encontrado')

    const tienda = await ctx.db.get(args.tiendaId)
    if (!tienda) throw new Error('Tienda no encontrada')

    // Solo propietario puede cambiar roles
    const esPropietario = String(tienda.propietario) === String(usuario._id)
    if (!esPropietario) {
      throw new Error('Solo el propietario puede cambiar roles')
    }

    // No se puede cambiar rol del propietario
    if (String(args.usuarioId) === String(tienda.propietario)) {
      throw new Error('No se puede cambiar el rol del propietario')
    }

    // Actualizar rol y permisos
    const miembrosActualizados = tienda.miembros.map(m => {
      if (String(m.usuarioId) === String(args.usuarioId)) {
        let permisos = args.nuevosPermisos
        if (!permisos || permisos.length === 0) {
          switch (args.nuevoRol) {
            case 'admin':
              permisos = ['full_access']
              break
            case 'vendedor':
              permisos = [
                'crear_venta',
                'ver_productos',
                'ver_clientes',
                'crear_cliente',
              ]
              if (
                tienda.configuracion.permisosTienda
                  .vendedoresPuedenCrearProductos
              ) {
                permisos.push('crear_producto')
              }
              if (
                tienda.configuracion.permisosTienda
                  .vendedoresPuedenModificarPrecios
              ) {
                permisos.push('editar_precio')
              }
              if (
                tienda.configuracion.permisosTienda.vendedoresPuedenVerReportes
              ) {
                permisos.push('ver_reportes')
              }
              break
            case 'asistente':
              permisos = ['ver_productos', 'ver_clientes']
              break
          }
        }

        return {
          ...m,
          rol: args.nuevoRol,
          permisos,
        }
      }
      return m
    })

    await ctx.db.patch(args.tiendaId, {
      miembros: miembrosActualizados,
    })

    return { success: true }
  },
})

/**
 * Obtener lista de miembros de la tienda
 */
export const getMiembrosTienda = query({
  args: { tiendaId: v.id('tiendas') },
  handler: async (ctx, args) => {
    const tienda = await ctx.db.get(args.tiendaId)
    if (!tienda) return null

    const limites = getLimitesPlan(tienda.plan)

    // Enriquecer con datos de usuario
    const miembrosConDatos = await Promise.all(
      tienda.miembros.map(async miembro => {
        const usuario = await ctx.db.get(miembro.usuarioId)
        return {
          ...miembro,
          nombre: usuario?.nombre || 'Usuario desconocido',
          correo: usuario?.correo,
          imgUrl: usuario?.imgUrl,
          esPropietario:
            String(miembro.usuarioId) === String(tienda.propietario),
        }
      })
    )

    return {
      miembros: miembrosConDatos,
      totalMiembros: tienda.miembros.length,
      limiteMaximo: limites.miembros,
      plan: limites.nombre,
      puedeAgregarMas: tienda.miembros.length < limites.miembros,
    }
  },
})

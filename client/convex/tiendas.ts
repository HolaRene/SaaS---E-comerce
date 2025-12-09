import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'
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

    // Gestionar borrado de AVATAR anterior
    if (
      fields.avatar &&
      tienda.avatar &&
      tienda.avatar !== fields.avatar &&
      !tienda.avatar.startsWith('/') // No borrar assets por defecto
    ) {
      try {
        await ctx.storage.delete(tienda.avatar as Id<'_storage'>)
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
        await ctx.storage.delete(tienda.imgBanner as Id<'_storage'>)
      } catch (error) {
        console.error('Error eliminando banner anterior:', error)
      }
    }

    await ctx.db.patch(id, {
      ...fields,
      ultimaActualizacion: new Date().toISOString(),
    })
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
          await ctx.storage.delete(tienda.avatar as Id<'_storage'>)
        } catch (error) {
          console.error('Error eliminando avatar de tienda:', error)
        }
      }
      if (tienda.imgBanner && !tienda.imgBanner.startsWith('/')) {
        try {
          await ctx.storage.delete(tienda.imgBanner as Id<'_storage'>)
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

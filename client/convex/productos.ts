import { mutation, query } from './_generated/server'
import { internal } from './_generated/api'
import { ConvexError, v } from 'convex/values'
import { Id } from './_generated/dataModel'

// crear producto
export const crearProducto = mutation({
  args: {
    tiendaId: v.id('tiendas'), // Opcional - se obtiene del usuario autenticado
    nombre: v.string(),
    descripcion: v.string(),
    precio: v.number(),
    costo: v.optional(v.number()),
    categoria: v.string(),
    imagenes: v.array(v.string()),
    cantidad: v.number(),
    estado: v.union(
      v.literal('activo'),
      v.literal('inactivo'),
      v.literal('agotado')
    ),

    // atributos dinámicos
    attributes: v.optional(
      v.record(v.string(), v.union(v.string(), v.number(), v.array(v.string())))
    ),

    codigoBarras: v.optional(v.string()),
    sku: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString()

    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('No autenticado este diablo falla')

    // Buscar usuario en la DB Convex
    const user = await ctx.db
      .query('usuarios')
      .filter(q => q.eq(q.field('correo'), identity.email))
      .collect()
    if (user.length === 0) throw new ConvexError('Usuario no encontrado')

    const newProduct = await ctx.db.insert('productos', {
      nombre: args.nombre,
      autorId: [user[0]._id],
      cantidad: args.cantidad,
      categoria: args.categoria,
      descripcion: args.descripcion,
      precio: args.precio,
      costo: args.costo ?? 0,
      tiendaId: args.tiendaId,
      publica: true, // ✔ Por defecto visible para usuarios
      sku: args.sku,
      attributes: {
        contenido: args.attributes?.contenido || '-',
        fechaExpiracion: args.attributes?.fechaExpiracion || '-',
        unidadMedida: args.attributes?.unidadMedida || '-',
        marca: args.attributes?.marca || '-',
      },
      puntuacionPromedio: 0,
      ventasTotales: 0,
      vistasTotales: 0,
      megusta: 0,
      ultimaActualizacion: now,
      imagenes: args.imagenes || ['/icons/producto-nuevo-64.png'],
      estado: 'activo',
      creadoEn: now,
    })

    // 🔔 NOTIFICAR A SEGUIDORES DE LA TIENDA
    const tienda = await ctx.db.get(args.tiendaId)
    if (tienda) {
      await ctx.scheduler.runAfter(
        0,
        internal.notificaciones.crearNotificacionesParaFavoritos,
        {
          tipo: 'nuevo_producto',
          tiendaId: args.tiendaId,
          productoId: newProduct,
          datos: {
            nombreTienda: tienda.nombre,
            nombreProducto: args.nombre,
            precio: args.precio,
          },
        }
      )
    }

    return newProduct
  },
})

// Rotación de inventario: entradas y salidas por producto en la tienda
export const getRotacionInventarioByTienda = query({
  args: { tiendaId: v.id('tiendas'), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const productos = await ctx.db
      .query('productos')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .collect()

    const ahora = new Date()

    const resultados = await Promise.all(
      productos.map(async p => {
        // Movimientos del producto en esta tienda
        const movimientos = await ctx.db
          .query('movimientosInventario')
          .withIndex('by_producto', q => q.eq('productoId', p._id))
          .collect()

        // Filtrar por tienda
        const movsTienda = movimientos.filter(
          m => String(m.tiendaId) === String(args.tiendaId)
        )

        const entradas = movsTienda
          .filter(m => m.tipo === 'ENTRADA')
          .reduce((s, m) => s + (m.cantidad || 0), 0)
        const salidas = movsTienda
          .filter(m => m.tipo === 'SALIDA')
          .reduce((s, m) => s + (m.cantidad || 0), 0)

        // Última venta (buscar detallesVenta más reciente para este producto)
        const detalles = await ctx.db
          .query('detallesVenta')
          .withIndex('by_producto', q => q.eq('productoId', p._id))
          .collect()

        let ultimaFechaVenta: string | null = null
        for (const d of detalles) {
          try {
            const venta = await ctx.db.get(d.ventaId)
            if (venta && venta.fecha) {
              if (
                !ultimaFechaVenta ||
                new Date(venta.fecha) > new Date(ultimaFechaVenta)
              ) {
                ultimaFechaVenta = venta.fecha
              }
            }
          } catch (e) {
            // ignore
          }
        }

        const dias = ultimaFechaVenta
          ? Math.floor(
              (ahora.getTime() - new Date(ultimaFechaVenta).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : null

        // calcular dias desde creacion si existe creadoEn o ultimaActualizacion
        let diasDesdeCreacion: number | null = null
        try {
          const creado = p.creadoEn || p.ultimaActualizacion || null
          if (creado) {
            diasDesdeCreacion = Math.floor(
              (ahora.getTime() - new Date(creado).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          }
        } catch (e) {
          diasDesdeCreacion = null
        }

        return {
          productoId: p._id,
          producto: p.nombre,
          entradas,
          salidas,
          stock: p.cantidad || 0,
          diasEnInventario: dias,
          diasDesdeCreacion,
        }
      })
    )

    return resultados
      .sort((a, b) => (b.salidas || 0) - (a.salidas || 0))
      .slice(0, args.limit || 50)
  },
})

// Productos sin movimiento reciente (stock estancado)
export const getStockEstancadoByTienda = query({
  args: {
    tiendaId: v.id('tiendas'),
    dias: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const threshold = args.dias ?? 14
    const productos = await ctx.db
      .query('productos')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .collect()

    const ahora = new Date()

    const resultados: Array<{
      productoId: any
      producto: string
      unidades: number
      diasSinVenta: number | null
      diasDesdeCreacion: number | null
    }> = []
    for (const p of productos) {
      if (!p.cantidad || p.cantidad <= 0) continue

      const detalles = await ctx.db
        .query('detallesVenta')
        .withIndex('by_producto', q => q.eq('productoId', p._id))
        .collect()

      let ultimaFechaVenta: string | null = null
      for (const d of detalles) {
        try {
          const venta = await ctx.db.get(d.ventaId)
          if (venta && venta.fecha) {
            if (
              !ultimaFechaVenta ||
              new Date(venta.fecha) > new Date(ultimaFechaVenta)
            ) {
              ultimaFechaVenta = venta.fecha
            }
          }
        } catch (e) {
          // ignore
        }
      }

      const diasSinVenta = ultimaFechaVenta
        ? Math.floor(
            (ahora.getTime() - new Date(ultimaFechaVenta).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null

      // Calcular días desde la creación del producto si existe creadoEn, si no usar ultimaActualizacion
      let diasDesdeCreacion: number | null = null
      try {
        const creado = p.creadoEn || p.ultimaActualizacion || null
        if (creado) {
          diasDesdeCreacion = Math.floor(
            (ahora.getTime() - new Date(creado).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        }
      } catch (e) {
        diasDesdeCreacion = null
      }

      // Incluir producto si:
      // 1. Nunca se ha vendido (diasSinVenta === null) Y ha existido por al menos 'threshold' días
      // 2. Se ha vendido pero no en los últimos 'threshold' días
      const debeIncluir =
        (diasSinVenta === null &&
          diasDesdeCreacion !== null &&
          diasDesdeCreacion >= threshold) ||
        (diasSinVenta !== null && diasSinVenta >= threshold)

      if (debeIncluir) {
        resultados.push({
          productoId: p._id,
          producto: p.nombre,
          unidades: p.cantidad,
          diasSinVenta,
          diasDesdeCreacion,
        })
      }
    }

    // Ordenar: productos sin ventas primero (null = infinito), luego por días sin venta
    return resultados
      .sort((a, b) => {
        // Si ambos son null, ordenar por días desde creación
        if (a.diasSinVenta === null && b.diasSinVenta === null) {
          return (b.diasDesdeCreacion || 0) - (a.diasDesdeCreacion || 0)
        }
        // Productos sin ventas van primero
        if (a.diasSinVenta === null) return -1
        if (b.diasSinVenta === null) return 1
        // Ordenar por días sin venta (mayor primero)
        return b.diasSinVenta - a.diasSinVenta
      })
      .slice(0, args.limit || 50)
  },
})

// Comparación de precios: compara el precio del producto con el promedio por categoría
export const getComparacionPreciosByTienda = query({
  args: { tiendaId: v.id('tiendas'), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const productos = await ctx.db
      .query('productos')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .collect()

    // Calcular promedio por categoría (en todas las tiendas)
    const allProducts = await ctx.db.query('productos').collect()
    const avgByCategoria: Record<string, { total: number; count: number }> = {}
    for (const p of allProducts) {
      const cat = p.categoria || 'Sin categoría'
      if (!avgByCategoria[cat]) avgByCategoria[cat] = { total: 0, count: 0 }
      avgByCategoria[cat].total += p.precio || 0
      avgByCategoria[cat].count += 1
    }

    const salida = productos.map(p => {
      const cat = p.categoria || 'Sin categoría'
      const avg = avgByCategoria[cat]
        ? avgByCategoria[cat].total / Math.max(1, avgByCategoria[cat].count)
        : 0
      return {
        productoId: p._id,
        producto: p.nombre,
        miPrecio: p.precio || 0,
        promedioMercado: avg,
        diferencia: (p.precio || 0) - avg,
      }
    })

    return salida.slice(0, args.limit || 50)
  },
})

// Obtener un productos por tienda
export const getProductosByTienda = query({
  args: { tiendaId: v.id('tiendas') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('productos')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .collect()
  },
})
// actualizar productos
// Actualizar producto (parche parcial)
export const actualizarProducto = mutation({
  args: {
    productoId: v.id('productos'),
    datos: v.object({
      nombre: v.optional(v.string()),
      descripcion: v.optional(v.string()),
      precio: v.optional(v.number()),
      costo: v.optional(v.number()),
      categoria: v.optional(v.string()),
      imagenes: v.optional(v.array(v.string())),
      cantidad: v.optional(v.number()),
      estado: v.optional(
        v.union(
          v.literal('activo'),
          v.literal('inactivo'),
          v.literal('agotado')
        )
      ),
      attributes: v.optional(
        v.record(
          v.string(),
          v.union(v.string(), v.number(), v.array(v.string()))
        )
      ),
      codigoBarras: v.optional(v.string()),
      sku: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('No autenticado')

    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .first()

    if (!usuario) throw new ConvexError('Usuario no encontrado')

    const producto = await ctx.db.get(args.productoId)
    if (!producto) throw new ConvexError('Producto no encontrado')

    const tienda = producto.tiendaId
      ? await ctx.db.get(producto.tiendaId)
      : null
    if (!tienda) throw new ConvexError('Tienda no encontrada')

    if (String(tienda.propietario) !== String(usuario._id)) {
      throw new ConvexError('No tienes permiso para editar este producto')
    }

    // Guardar datos antiguos
    const datosAntiguos = {
      nombre: producto.nombre,
      precio: producto.precio,
    }

    // Filtrar campos undefined
    const updateData: Record<string, any> = {}
    for (const [k, v_] of Object.entries(args.datos)) {
      if (v_ !== undefined) updateData[k] = v_
    }

    if (Object.keys(updateData).length === 0) return { success: true }

    // GESTIONAR BORRADO DE IMÁGENES
    // Si se envían nuevas imágenes, comparar con las antiguas para borrar las que ya no están
    if (args.datos.imagenes) {
      const nuevasImagenes = new Set(args.datos.imagenes)
      // Iterar sobre las imágenes actuales del producto
      for (const imgAntigua of producto.imagenes || []) {
        // Si una imagen antigua NO está en la nueva lista Y no es un asset por defecto
        if (!nuevasImagenes.has(imgAntigua) && !imgAntigua.startsWith('/')) {
          try {
            const parts = imgAntigua.split('/')
            const storageId = parts[parts.length - 1] as Id<'_storage'>
            await ctx.storage.delete(storageId)
          } catch (error) {
            console.error('Error eliminando imagen de producto antigua:', error)
          }
        }
      }
    }

    updateData.ultimaActualizacion = new Date().toISOString()

    // 🔔 DETECTAR BAJADA DE PRECIO
    if (args.datos.precio && datosAntiguos.precio > args.datos.precio) {
      await ctx.scheduler.runAfter(
        0,
        internal.notificaciones.crearNotificacionesParaFavoritos,
        {
          tipo: 'precio_bajado',
          tiendaId: producto.tiendaId,
          productoId: args.productoId,
          datos: {
            nombreProducto: datosAntiguos.nombre,
            precioAntiguo: datosAntiguos.precio,
            precioNuevo: args.datos.precio,
          },
        }
      )
    }

    // 🔔 DETECTAR SUBIDA DE PRECIO
    else if (args.datos.precio && datosAntiguos.precio < args.datos.precio) {
      await ctx.scheduler.runAfter(
        0,
        internal.notificaciones.crearNotificacionesParaFavoritos,
        {
          tipo: 'precio_subido',
          tiendaId: producto.tiendaId,
          productoId: args.productoId,
          datos: {
            nombreProducto: datosAntiguos.nombre,
            precioAntiguo: datosAntiguos.precio,
            precioNuevo: args.datos.precio,
          },
        }
      )
    }

    await ctx.db.patch(args.productoId, updateData)
    return { success: true }
  },
})
// Obtener productos con sus etiquetas
export const getProductosConEtiquetas = query({
  args: { tiendaId: v.id('tiendas') },
  handler: async (ctx, args) => {
    const productos = await ctx.db
      .query('productos')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .collect()

    // Para cada producto, obtener sus etiquetas
    return await Promise.all(
      productos.map(async producto => {
        // Obtener relaciones producto-etiqueta
        const relaciones = await ctx.db
          .query('productoEtiquetas')
          .withIndex('by_producto', q => q.eq('productoId', producto._id))
          .collect()

        // Obtener datos completos de cada etiqueta
        const etiquetas = await Promise.all(
          relaciones.map(async rel => {
            return await ctx.db.get(rel.etiquetaId)
          })
        )

        return {
          ...producto,
          etiquetas: etiquetas.filter(e => e !== null), // Filtrar nulls
        }
      })
    )
  },
})
// Obtener producto por etiqueta
export const getProductosPorEtiqueta = query({
  args: {
    etiquetaId: v.id('etiquetas'),
    tiendaId: v.id('tiendas'),
  },
  handler: async (ctx, args) => {
    // Obtener todas las relaciones de esta etiqueta
    const relaciones = await ctx.db
      .query('productoEtiquetas')
      .withIndex('by_etiqueta', q => q.eq('etiquetaId', args.etiquetaId))
      .collect()

    // Obtener los productos
    const productos = await Promise.all(
      relaciones.map(async rel => {
        return await ctx.db.get(rel.productoId)
      })
    )

    return productos.filter(p => p !== null && p.tiendaId === args.tiendaId)
  },
})

// Eliminar producto (solo propietario de la tienda)
export const eliminarProducto = mutation({
  args: { productoId: v.id('productos') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('No autenticado')

    const usuario = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .first()

    if (!usuario) throw new Error('Usuario no encontrado')

    const producto = await ctx.db.get(args.productoId)
    if (!producto) throw new Error('Producto no encontrado')

    const tienda = producto.tiendaId
      ? await ctx.db.get(producto.tiendaId)
      : null
    if (!tienda) throw new Error('Tienda no encontrada')

    if (String(tienda.propietario) !== String(usuario._id)) {
      throw new Error('No tienes permiso para eliminar este producto')
    }

    // 🔔 NOTIFICAR ANTES DE ELIMINAR
    await ctx.scheduler.runAfter(
      0,
      internal.notificaciones.crearNotificacionesParaFavoritos,
      {
        tipo: 'producto_eliminado',
        tiendaId: producto.tiendaId,
        productoId: args.productoId,
        datos: {
          nombreProducto: producto.nombre,
        },
      }
    )

    // BORRAR IMAGENES AL ELIMINAR PRODUCTO
    if (producto.imagenes && producto.imagenes.length > 0) {
      for (const img of producto.imagenes) {
        if (img && !img.startsWith('/')) {
          try {
            const parts = img.split('/')
            const storageId = parts[parts.length - 1] as Id<'_storage'>
            await ctx.storage.delete(storageId)
          } catch (error) {
            console.error('Error eliminando imagen al borrar producto:', error)
          }
        }
      }
    }

    await ctx.db.delete(args.productoId)
    return { success: true }
  },
})

// obtener un cachimbo de productos
export const getProductosPublicosConStock = query({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.db
      .query('productos')
      .withIndex('by_publica_cantidad', q =>
        q.eq('publica', true).gt('cantidad', 5)
      )
      .collect()
  },
})

// Obtener producto específico por ID
export const getProductoId = query({
  args: {
    id: v.id('productos'),
  },
  handler: async (ctx, args) => {
    const resultados = await ctx.db
      .query('productos')
      .withIndex('by_publica_cantidad', q =>
        q.eq('publica', true).gt('cantidad', 5)
      )
      .filter(q => q.eq(q.field('_id'), args.id))
      .take(1)

    return resultados[0] || null
  },
})

// Obtener producto con detalles de tienda (Optimizado para evitar waterfall)
export const getProductoConTienda = query({
  args: {
    id: v.id('productos'),
  },
  handler: async (ctx, args) => {
    // 1. Obtener producto
    const producto = await ctx.db.get(args.id)

    // Validar producto
    if (
      !producto ||
      producto.publica !== true ||
      producto.estado !== 'activo'
    ) {
      return null
    }

    // 2. Obtener tienda
    const tienda = await ctx.db.get(producto.tiendaId)

    // Validar tienda
    if (
      !tienda ||
      tienda.publica !== true ||
      (tienda.estado !== 'activo' && tienda.estado !== 'pendiente')
    ) {
      return null
    }

    return {
      producto,
      tienda,
    }
  },
})

// ==================== FILTRAR PRODUCTOS PÚBLICOS ====================
/**
 * Filtra productos públicos por búsqueda, categorías, rango de precio, y puntuación mínima
 */
export const filtrarProductosPublicos = query({
  args: {
    busqueda: v.optional(v.string()),
    categorias: v.optional(v.array(v.string())),
    precioMin: v.optional(v.number()),
    precioMax: v.optional(v.number()),
    puntuacionMinima: v.optional(v.number()),
    ordenarPor: v.optional(
      v.union(
        v.literal('precio_asc'),
        v.literal('precio_desc'),
        v.literal('puntuacion_desc'),
        v.literal('reciente')
      )
    ),
  },
  handler: async (ctx, args) => {
    // Obtener todos los productos públicos con stock
    let productos = await ctx.db
      .query('productos')
      .withIndex('by_publica_cantidad', q =>
        q.eq('publica', true).gt('cantidad', 0)
      )
      .collect()

    // Filtrar por búsqueda (nombre del producto o tienda)
    if (args.busqueda && args.busqueda.trim() !== '') {
      const searchLower = args.busqueda.toLowerCase().trim()

      // Obtener nombres de tiendas para búsqueda
      const tiendaIds = [...new Set(productos.map(p => p.tiendaId))]
      const tiendasMap = new Map<string, string>()

      for (const tiendaId of tiendaIds) {
        const tienda = await ctx.db.get(tiendaId)
        if (tienda) {
          tiendasMap.set(tiendaId, tienda.nombre.toLowerCase())
        }
      }

      productos = productos.filter(p => {
        const nombreMatch = p.nombre.toLowerCase().includes(searchLower)
        const tiendaNombre = tiendasMap.get(p.tiendaId) || ''
        const tiendaMatch = tiendaNombre.includes(searchLower)
        return nombreMatch || tiendaMatch
      })
    }

    // Filtrar por categorías (del producto)
    if (args.categorias && args.categorias.length > 0) {
      productos = productos.filter(p => args.categorias!.includes(p.categoria))
    }

    // Filtrar por rango de precio
    if (args.precioMin !== undefined) {
      productos = productos.filter(p => p.precio >= args.precioMin!)
    }
    if (args.precioMax !== undefined) {
      productos = productos.filter(p => p.precio <= args.precioMax!)
    }

    // Filtrar por puntuación mínima
    if (args.puntuacionMinima !== undefined) {
      productos = productos.filter(
        p => (p.puntuacionPromedio || 0) >= args.puntuacionMinima!
      )
    }

    // Ordenar
    switch (args.ordenarPor) {
      case 'precio_asc':
        productos.sort((a, b) => a.precio - b.precio)
        break
      case 'precio_desc':
        productos.sort((a, b) => b.precio - a.precio)
        break
      case 'puntuacion_desc':
        productos.sort(
          (a, b) => (b.puntuacionPromedio || 0) - (a.puntuacionPromedio || 0)
        )
        break
      case 'reciente':
        productos.sort((a, b) => b._creationTime - a._creationTime)
        break
      default:
        // Por defecto ordenar por más recientes
        productos.sort((a, b) => b._creationTime - a._creationTime)
    }

    return productos
  },
})

// ==================== OBTENER PRECIO MÁXIMO
/**
 * Obtiene el precio máximo de todos los productos públicos (para el slider de filtro)
 */
export const getPrecioMaximoProductos = query({
  args: {},
  handler: async ctx => {
    const productos = await ctx.db
      .query('productos')
      .withIndex('by_publica_cantidad', q =>
        q.eq('publica', true).gt('cantidad', 0)
      )
      .collect()

    if (productos.length === 0) return 1000 // Valor por defecto

    const maxPrecio = Math.max(...productos.map(p => p.precio))
    // Redondear al siguiente múltiplo de 100 para mejor UX
    return Math.ceil(maxPrecio / 100) * 100
  },
})

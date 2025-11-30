import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  tiendas: defineTable({
    avatar: v.string(),
    imgBanner: v.string(),
    nombre: v.string(),
    categoria: v.string(),
    descripcion: v.string(),
    direccion: v.string(),
    lat: v.number(),
    lng: v.number(),
    departamento: v.string(),
    telefono: v.string(),

    propietario: v.id('usuarios'),

    // Visibilidad pública (opcional para soportar datos existentes)
    publica: v.boolean(), // true = visible para usuarios, false = oculta

    estado: v.union(
      v.literal('activo'),
      v.literal('inactivo'),
      v.literal('pendiente'),
      v.literal('suspendido'),
      v.literal('cerradoTemporal'),
      v.literal('borrado')
    ),

    ventasHoy: v.number(),

    miembros: v.array(
      v.object({
        usuarioId: v.id('usuarios'),
        rol: v.union(
          v.literal('admin'),
          v.literal('vendedor'),
          v.literal('asistente')
        ),
        fechaUnion: v.string(),
        permisos: v.array(v.string()),
      })
    ),

    configuracion: v.object({
      NIT: v.string(),
      RUC: v.string(),
      moneda: v.string(),
      whatsapp: v.string(),
      backup: v.string(),
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

    metricasEquipo: v.object({
      totalVendedores: v.number(),
      ventasEsteMes: v.number(),
      productoMasVendido: v.optional(v.id('productos')),
    }),

    delivery: v.object({
      habilitado: v.boolean(),
      costo: v.number(),
      tiempoEstimado: v.string(),
      zonas: v.array(v.string()),
    }),

    facturacion: v.object({
      habilitada: v.boolean(),
      tipo: v.union(
        v.literal('manual'),
        v.literal('automatica'),
        v.literal('ninguna')
      ),
      serie: v.string(),
      numeracionActual: v.number(),
    }),

    estadisticas: v.object({
      ventasTotales: v.number(),
      clientesTotales: v.number(),
      productosActivos: v.number(),
    }),

    visitas: v.number(),
    likes: v.number(),
    favoritos: v.number(),
    puntuacion: v.number(),

    creadoEn: v.string(),
    ultimaActualizacion: v.string(),
  })
    .index('by_propietario', ['propietario'])
    .index('by_categoria', ['categoria'])
    .index('by_estado', ['estado'])
    .index('by_ubicacion', ['lat', 'lng'])
    .index('by_departamento', ['departamento'])
    .index('by_delivery', ['delivery.habilitado'])
    .index('by_estado_y_categoria', ['estado', 'categoria'])
    .index('by_publica', ['publica'])
    .index('by_publica_estado', ['publica', 'estado'])// ✅ CORRECTO: Índice de búsqueda para el nombre
    .searchIndex('search_nombre', {
      searchField: 'nombre',
      // Opcional: campos por los que filtrar (mejora rendimiento)
      filterFields: ['publica', 'estado', 'departamento', 'categoria', 'puntuacion']
    })
    // ✅ NUEVO ÍNDICE para ordenar por puntuación
    .index('by_publica_estado_puntuacion', ['publica', 'estado', 'puntuacion']),

  // EProductos flexis ----------------
  productos: defineTable({
    tiendaId: v.id('tiendas'),
    // Básicos
    nombre: v.string(),
    descripcion: v.string(),
    precio: v.number(),
    costo: v.optional(v.number()),
    categoria: v.string(),

    // Visibilidad pública (opcional para soportar datos existentes)
    publica: v.optional(v.boolean()), // true = visible para usuarios, false = oculta

    // Imágenes
    imagenes: v.array(v.string()),

    // Inventario
    cantidad: v.number(),
    estado: v.union(
      v.literal('activo'),
      v.literal('inactivo'),
      v.literal('agotado')
    ),

    // Estadísticas
    puntuacionPromedio: v.optional(v.number()),
    ventasTotales: v.optional(v.number()),
    vistasTotales: v.optional(v.number()),

    // ⬇️ Atributos dinámicos por categoría (flexible y elegante)
    attributes: v.optional(
      v.record(v.string(), v.union(v.string(), v.number(), v.array(v.string())))
    ),

    // Identificación
    codigoBarras: v.optional(v.string()),
    sku: v.optional(v.string()),

    autorId: v.array(v.id('usuarios')),
    ultimaActualizacion: v.string(),
    creadoEn: v.optional(v.string()),
  })
    .index('by_tienda', ['tiendaId'])
    .index('by_categoria', ['categoria'])
    .index('by_estado', ['estado'])
    .index('by_precio', ['precio'])
    .index('by_ventas', ['ventasTotales'])
    .index('by_publica', ['publica'])
    .index('by_tienda_publica', ['tiendaId', 'publica']),
  //  Usuario flexi ===========================
  usuarios: defineTable({
    nombre: v.string(),
    clerkId: v.string(),
    apellido: v.string(),
    correo: v.string(),
    rol: v.union(
      v.literal('admin'),
      v.literal('vendedor'),
      v.literal('cliente')
    ),
    imgUrl: v.string(),
    numTelefono: v.string(),
    configuracion: v.optional(
      v.object({
        tema: v.string(),
        notificaciones: v.boolean(),
      })
    ),
  })
    .index('by_correo', ['correo'])
    .index('by_nombre', ['nombre'])
    .index('by_rol', ['rol'])
    .index('by_clerkId', ['clerkId']),

  // reseñas tienda =====================
  resenasTienda: defineTable({
    tiendaId: v.id('tiendas'),
    clienteId: v.id('usuarios'),
    calificacion: v.number(), // 1-5
    comentario: v.optional(v.string()),
    fecha: v.string(),
    estado: v.union(v.literal('activa'), v.literal('oculta')), // Moderación
  })
    .index('by_tienda', ['tiendaId'])
    .index('by_cliente_tienda', ['clienteId', 'tiendaId']) // Para evitar duplicados
    .index('by_fecha', ['fecha']),

  // reseñas productos =====================
  resenasProductos: defineTable({
    productoId: v.id('productos'),
    clienteId: v.id('usuarios'),
    calificacion: v.number(), // 1-5
    comentario: v.optional(v.string()),
    fecha: v.string(),
    estado: v.union(v.literal('activa'), v.literal('oculta')),
  })
    .index('by_producto', ['productoId'])
    .index('by_cliente_producto', ['clienteId', 'productoId']) // Una reseña por cliente-producto
    .index('by_fecha', ['fecha'])
    .index('by_calificacion', ['calificacion']), // Para filtros por rating
  historialProductos: defineTable({
    productoId: v.id('productos'),
    tiendaId: v.id('tiendas'),
    usuarioId: v.id('usuarios'),

    // Tipo de cambio
    tipoEvento: v.union(
      v.literal('CREADO'),
      v.literal('ACTUALIZADO'),
      v.literal('ELIMINADO'),
      v.literal('PRECIO_CAMBIADO'),
      v.literal('STOCK_AJUSTADO')
    ),

    // Qué cambió
    camposModificados: v.array(v.string()), // ["precio", "nombre"]

    // Valores anteriores y nuevos
    valoresAnteriores: v.optional(v.any()),
    valoresNuevos: v.optional(v.any()),

    // Metadata
    descripcion: v.string(), // "Precio actualizado de C$10 a C$15"
    fecha: v.string(), // ISO timestamp
  })
    .index('by_producto', ['productoId'])
    .index('by_tienda', ['tiendaId'])
    .index('by_fecha', ['fecha']),

  // Movimientos de Inventario
  movimientosInventario: defineTable({
    productoId: v.id('productos'),
    tiendaId: v.id('tiendas'),
    usuarioId: v.id('usuarios'),

    // Tipo de movimiento
    tipo: v.union(
      v.literal('ENTRADA'), // Compra, devolución de cliente
      v.literal('SALIDA'), // Venta, devolución a proveedor
      v.literal('AJUSTE'), // Corrección manual, merma, robo
      v.literal('TRANSFERENCIA') // Entre sucursales (futuro)
    ),

    // Cantidad (positiva para entrada, negativa para salida)
    cantidad: v.number(),

    // Stock antes y después
    stockAnterior: v.number(),
    stockNuevo: v.number(),

    // Razón del movimiento
    razon: v.string(), // "Compra a proveedor", "Venta", "Producto vencido"
    notas: v.optional(v.string()),

    // Metadata
    fecha: v.string(),

    // Opcional: Relación con venta/compra
    ventaId: v.optional(v.id('ventas')),
    compraId: v.optional(v.id('compras')),
  })
    .index('by_producto', ['productoId'])
    .index('by_tienda', ['tiendaId'])
    .index('by_tipo', ['tipo'])
    .index('by_fecha', ['fecha']),
  // Etiquetas
  etiquetas: defineTable({
    nombre: v.string(), // "Ofertas", "Nuevo", "Popular"
    tiendaId: v.id('tiendas'), // A qué tienda pertenece
    color: v.optional(v.string()), // "#FF5733" para UI
    icono: v.optional(v.string()), // "🔥", "⭐", "🆕"
    descripcion: v.optional(v.string()),
    activa: v.boolean(), // Si está activa o no
  })
    .index('by_tienda', ['tiendaId'])
    .index('by_nombre', ['tiendaId', 'nombre']), // Evitar duplicados

  // Producto-Etiquetas
  productoEtiquetas: defineTable({
    productoId: v.id('productos'),
    etiquetaId: v.id('etiquetas'),
    tiendaId: v.id('tiendas'), // Para filtrar por tienda
    fechaAsignacion: v.string(), // Cuándo se asignó
  })
    .index('by_producto', ['productoId'])
    .index('by_etiqueta', ['etiquetaId'])
    .index('by_tienda', ['tiendaId'])
    .index('by_producto_etiqueta', ['productoId', 'etiquetaId']), // Evitar duplicados

  // Clientes
  clientes: defineTable({
    tiendaId: v.id('tiendas'),
    nombre: v.string(),
    email: v.optional(v.string()),
    telefono: v.optional(v.string()),
    direccion: v.optional(v.string()),
    notas: v.optional(v.string()),
    segmento: v.optional(
      v.union(
        v.literal('frecuente'),
        v.literal('ocasional'),
        v.literal('mayorista')
      )
    ),
    fechaRegistro: v.string(), // ISO string
    totalCompras: v.number(), // Monto total de compras
    cantidadCompras: v.number(), // Número de compras
    ultimaCompra: v.optional(v.string()), // Fecha última compra
  })
    .index('by_tienda', ['tiendaId'])
    .index('by_telefono', ['tiendaId', 'telefono'])
    .index('by_email', ['tiendaId', 'email']),

  // Ventas
  ventas: defineTable({
    tiendaId: v.id('tiendas'),
    clienteId: v.optional(v.id('clientes')), // Opcional para ventas sin cliente
    usuarioId: v.id('usuarios'), // Cajero que realizó la venta
    fecha: v.string(), // ISO string
    subtotal: v.number(),
    impuesto: v.number(),
    total: v.number(),
    metodoPago: v.union(
      v.literal('efectivo'),
      v.literal('tarjeta'),
      v.literal('transferencia'),
      v.literal('fiado')
    ),
    estado: v.union(
      v.literal('completada'),
      v.literal('cancelada'),
      v.literal('pendiente')
    ),
    notas: v.optional(v.string()),
  })
    .index('by_tienda', ['tiendaId'])
    .index('by_cliente', ['clienteId'])
    .index('by_fecha', ['tiendaId', 'fecha'])
    .index('by_usuario', ['usuarioId']),

  // Detalles de Venta (items de cada venta)
  detallesVenta: defineTable({
    ventaId: v.id('ventas'),
    productoId: v.id('productos'),
    cantidad: v.number(),
    precioUnitario: v.number(),
    subtotal: v.number(), // cantidad * precioUnitario
    nombreProducto: v.string(), // Guardado para historial
  })
    .index('by_venta', ['ventaId'])
    .index('by_producto', ['productoId']),

  // Recordatorios de cobro
  recordatoriosCobro: defineTable({
    ventaId: v.id('ventas'),
    fechaRecordatorio: v.string(), // ISO string
    estado: v.union(
      v.literal('pendiente'),
      v.literal('completado'),
      v.literal('cancelado')
    ),
    notas: v.optional(v.string()),
  }).index('by_venta', ['ventaId']),
  // Creditos
  creditos: defineTable({
    tiendaId: v.id('tiendas'),
    clienteId: v.id('clientes'),
    limiteCredito: v.number(),
    saldoActual: v.number(),
    fechaInicio: v.string(),
    fechaVencimiento: v.optional(v.string()),
    estado: v.union(
      v.literal('activo'),
      v.literal('pagado'),
      v.literal('vencido'),
      v.literal('cancelado')
    ),
    notas: v.optional(v.string()),
  })
    .index('by_tienda', ['tiendaId'])
    .index('by_cliente', ['clienteId'])
    .index('by_estado', ['estado'])
    .index('by_vencimiento', ['fechaVencimiento']),
  // Pagos de Creditos
  pagosCredito: defineTable({
    creditoId: v.id('creditos'),
    clienteId: v.id('clientes'),
    tiendaId: v.id('tiendas'),
    monto: v.number(),
    fecha: v.string(),
    metodoPago: v.union(
      v.literal('efectivo'),
      v.literal('tarjeta'),
      v.literal('transferencia')
    ),
    notas: v.optional(v.string()),
    registradoPor: v.id('usuarios'),
  })
    .index('by_credito', ['creditoId'])
    .index('by_cliente', ['clienteId'])
    .index('by_tienda', ['tiendaId'])
    .index('by_fecha', ['fecha', 'tiendaId']),
  // Recordatorios de cobro
  recordatorios: defineTable({
    tiendaId: v.id('tiendas'),
    clienteId: v.id('clientes'),
    creditoId: v.optional(v.id('creditos')),
    tipo: v.union(
      v.literal('cobro'),
      v.literal('recordatorio'),
      v.literal('vencimiento')
    ),
    fechaProgramada: v.string(),
    monto: v.number(),
    mensaje: v.optional(v.string()),
    estado: v.union(
      v.literal('pendiente'),
      v.literal('enviado'),
      v.literal('completado'),
      v.literal('cancelado')
    ),
    fechaEnvio: v.optional(v.string()),
    creadoPor: v.id('usuarios'),
  })
    .index('by_tienda', ['tiendaId'])
    .index('by_cliente', ['clienteId'])
    .index('by_fecha_programada', ['fechaProgramada', 'tiendaId'])
    .index('by_estado', ['estado', 'tiendaId']),
  // Tabla agregada: clientesFrecuentes por tienda (informes)
  clientesFrecuentes: defineTable({
    tiendaId: v.id('tiendas'),
    clienteId: v.id('clientes'),
    totalCompras: v.number(), // número de compras realizadas
    montoTotal: v.number(), // monto total comprado
    promedioMensual: v.optional(v.number()), // cálculo opcional para mostrar promedio mensual
    segmento: v.optional(
      v.union(
        v.literal('frecuente'),
        v.literal('ocasional'),
        v.literal('mayorista')
      )
    ),
    ultimaCompra: v.optional(v.string()),
    actualizadoEn: v.string(),
  })
    .index('by_tienda', ['tiendaId'])
    .index('by_cliente', ['clienteId'])
    .index('by_tienda_totalCompras', ['tiendaId', 'totalCompras']),

  // Documentos de texto
  documentos: defineTable({
    tiendaId: v.id('tiendas'),
    titulo: v.string(),
    contenido: v.string(), // HTML o JSON del editor
    tipo: v.union(v.literal('contrato'), v.literal('carta'), v.literal('otro')),
    creadoPor: v.id('usuarios'),
    ultimaModificacion: v.string(),
  }).index('by_tienda', ['tiendaId']),

  // Hojas de cálculo
  hojasCalculo: defineTable({
    tiendaId: v.id('tiendas'),
    titulo: v.string(),
    contenido: v.string(), // JSON stringified de los datos
    creadoPor: v.id('usuarios'),
    ultimaModificacion: v.string(),
  }).index('by_tienda', ['tiendaId']),
})

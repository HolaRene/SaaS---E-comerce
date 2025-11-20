import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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

  propietario: v.id("usuarios"),

  estado: v.union(
    v.literal("activo"),
    v.literal("inactivo"),
    v.literal("pendiente"),
    v.literal("suspendido"),
    v.literal("cerradoTemporal"),
    v.literal("borrado")
  ),

  ventasHoy: v.number(),

  miembros: v.array(v.object({
    usuarioId: v.id("usuarios"),
    rol: v.union(
      v.literal("admin"),
      v.literal("vendedor"),
      v.literal("asistente")
    ),
    fechaUnion: v.string(),
    permisos: v.array(v.string())
  })),

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
      maxVendedores: v.number()
    })
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
    productoMasVendido: v.optional(v.id("productos"))
  }),

  delivery: v.object({
    habilitado: v.boolean(),
    costo: v.number(),
    tiempoEstimado: v.string(),
    zonas: v.array(v.string())
  }),

  facturacion: v.object({
    habilitada: v.boolean(),
    tipo: v.union(
      v.literal("manual"),
      v.literal("automatica"),
      v.literal("ninguna")
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
  puntuacion:v.number(),

  creadoEn: v.string(),
  ultimaActualizacion: v.string(),
})
.index("by_propietario", ["propietario"])
.index("by_categoria", ["categoria"])
.index("by_estado", ["estado"])
.index("by_ubicacion", ["lat", "lng"])
.index("by_departamento", ["departamento"])
.index("by_delivery", ["delivery.habilitado"])
.index("by_estado_y_categoria", ["estado", "categoria"]),


  // EProductos flexis ----------------
productos: defineTable({
    tiendaId: v.id("tiendas"),
    // Básicos
    nombre: v.string(),
    descripcion: v.string(),
    precio: v.number(),
    categoria: v.string(),

    // Imágenes
    imagenes: v.array(v.string()),

    // Inventario
    cantidad: v.number(),
    estado: v.union(
      v.literal("activo"),
      v.literal("inactivo"),
      v.literal("agotado")
    ),

    // Estadísticas
    puntuacionPromedio: v.optional(v.number()),
    ventasTotales: v.optional(v.number()),
    vistasTotales: v.optional(v.number()),

    // ⬇️ Atributos dinámicos por categoría (flexible y elegante)
    attributes: v.optional(
      v.record(
        v.string(),
        v.union(v.string(), v.number(), v.array(v.string()))
      )
    ),

    // Identificación
    codigoBarras: v.optional(v.string()),
    sku: v.optional(v.string()),

    autorId: v.id("usuarios"),
    ultimaActualizacion: v.string(),
  })
    .index("by_tienda", ["tiendaId"])
    .index("by_categoria", ["categoria"])
    .index("by_estado", ["estado"])
    .index("by_precio", ["precio"])
    .index("by_ventas", ["ventasTotales"]),
//  Usuario flexi ===========================
usuarios: defineTable({
    nombre: v.string(),
    clerkId:v.string(),
    apellido:v.string(),
    correo: v.string(),
    rol: v.union(v.literal("admin"), v.literal("vendedor"), v.literal("cliente")),
    imgUrl: v.string(),
    numTelefono: v.string(),
    configuracion: v.optional(v.object({
      tema: v.string(),
      notificaciones: v.boolean()
    }))
  })
  .index("by_correo", ["correo"])
  .index("by_nombre", ["nombre"])
  .index("by_rol", ["rol"])
  .index("by_clerkId", ["clerkId"]),

// reseñas tienda =====================
resenasTienda: defineTable({
  tiendaId: v.id("tiendas"),
  clienteId: v.id("usuarios"),
  calificacion: v.number(), // 1-5
  comentario: v.optional(v.string()),
  fecha: v.string(),
  estado: v.union(v.literal("activa"), v.literal("oculta")) // Moderación
})
.index("by_tienda", ["tiendaId"])
.index("by_cliente_tienda", ["clienteId", "tiendaId"]) // Para evitar duplicados
.index("by_fecha", ["fecha"]),

// reseñas productos =====================
resenasProductos: defineTable({
  productoId: v.id("productos"),
  clienteId: v.id("usuarios"), 
  calificacion: v.number(), // 1-5
  comentario: v.optional(v.string()),
  fecha: v.string(),
  estado: v.union(v.literal("activa"), v.literal("oculta"))
})
.index("by_producto", ["productoId"])
.index("by_cliente_producto", ["clienteId", "productoId"]) // Una reseña por cliente-producto
.index("by_fecha", ["fecha"])
.index("by_calificacion", ["calificacion"]) // Para filtros por rating
});
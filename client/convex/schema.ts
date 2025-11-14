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
    puntuacion: v.number(),
    telefono: v.string(),
    propietario: v.id("usuarios"), // Dueño principal
    estado: v.union(v.literal("activo"), v.literal("inactivo"), v.literal("pendiente")),
    ventasHoy: v.number(),
    departamento: v.string(),
    
    // NUEVO: Sistema de miembros/colaboradores
    miembros: v.array(v.object({
      usuarioId: v.id("usuarios"),
      rol: v.union(
        v.literal("admin"),     // Mismos permisos que el propietario
        v.literal("vendedor"),  // Puede gestionar productos y ventas
        v.literal("asistente")  // Solo ver estadísticas
      ),
      fechaUnion: v.string(),
      permisos: v.array(v.string()) // Permisos específicos
    })),
    
    configuracion: v.object({
      NIT: v.string(),
      RUC: v.string(),
      moneda: v.string(),
      whatsapp: v.string(),
      backup: v.string(),
      // NUEVO: Configuración de permisos
      permisosTienda: v.object({
        vendedoresPuedenCrearProductos: v.boolean(),
        vendedoresPuedenModificarPrecios: v.boolean(),
        vendedoresPuedenVerReportes: v.boolean(),
        maxVendedores: v.number()
      })
    }),
    
    horarios: v.array(v.object({
      dia: v.string(),
      apertura: v.string(),
      cierre: v.string()
    })),
    
    // NUEVO: Métricas de equipo
    metricasEquipo: v.object({
      totalVendedores: v.number(),
      ventasEsteMes: v.number(),
      productoMasVendido: v.optional(v.id("productos"))
    })
  })
  .index("by_propietario", ["propietario"])
  .index("by_categoria", ["categoria"])
  .index("by_estado", ["estado"])
  .index("by_ubicacion", ["lat", "lng"])
  .index("by_miembros", ["miembros"]), // Nuevo índice para búsquedas por miembros,

  // EProductos flexis ----------------
productos: defineTable({
  tiendaId: v.id("tiendas"),        // Relación con la tienda
  nombre: v.string(),
  autorId: v.string(),
  categorias: v.array(v.string()),   // Más claro en plural
  precio: v.number(),
  precioOriginal: v.optional(v.number()), // Para mostrar descuentos
  stock: v.number(),
  imagenes: v.array(v.string()),     // Más claro en plural
  puntuacionPromedio: v.number(),    // Más descriptivo
  vistasTotales: v.number(),
  descripcion: v.string(),
  estado: v.union(v.literal("activo"), v.literal("inactivo"), v.literal("agotado")),
  codigoBarras: v.optional(v.string()),
  sku: v.optional(v.string()),       // Código interno único
  
  // Campos adicionales importantes para ecommerce
  etiquetas: v.array(v.string()),    // Para búsquedas y filtros
  peso: v.optional(v.number()),      // Para envíos
  dimensiones: v.optional(v.object({
    largo: v.number(),
    ancho: v.number(),
    alto: v.number()
  })),
  
  // Estadísticas (se calculan automáticamente)
  ventasTotales: v.number(),
  ultimaActualizacion: v.string(),
  
  // Variantes para productos con tallas/colores
  variantes: v.optional(v.array(v.object({
    nombre: v.string(),              // "Color", "Talla", etc.
    opciones: v.array(v.object({
      valor: v.string(),             // "Rojo", "XL", etc.
      precioExtra: v.optional(v.number()),
      stock: v.optional(v.number())
    }))
  })))
})
.index("by_tienda", ["tiendaId"])
.index("by_categoria", ["categorias"])
.index("by_estado", ["estado"])
.index("by_precio", ["precio"])
.index("by_ventas", ["ventasTotales"]),
//  Usuario flexi ===========================
usuarios: defineTable({
    nombre: v.string(),
    clerkId:v.string(),
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
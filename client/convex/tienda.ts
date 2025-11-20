import { ConvexError, v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "./_generated/api";

// ========== TIPOS Y FUNCIONES HELPER ==========
// type Rol = "admin" | "vendedor" | "asistente";

/**
 * Verifica si un usuario tiene permiso en una tienda
 * @returns true si tiene permiso, false si no
 */
// async function hasTiendaPermission(
//   ctx: any,
//   tiendaId: string,
//   userId: string,
//   minRole: Rol
// ): Promise<boolean> {
//   const tienda = await ctx.db.get(tiendaId);
//   if (!tienda) return false;

//   // El propietario tiene todos los permisos
//   if (tienda.propietario === userId) return true;

//   // Buscar en miembros
//   const miembro = tienda.miembros.find((m: any) => m.usuarioId === userId);
//   if (!miembro) return false;

//   // Jerarquía de roles: admin > vendedor > asistente
//   const rolesHierarchy: Record<Rol, number> = {
//     admin: 3,
//     vendedor: 2,
//     asistente: 1
//   };

//   return rolesHierarchy[miembro.rol] >= rolesHierarchy[minRole];
// }

// /**
//  * Verifica si un usuario es propietario de la tienda
//  */
// async function isOwner(ctx: any, tiendaId: string, userId: string): Promise<boolean> {
//   const tienda = await ctx.db.get(tiendaId);
//   return tienda?.propietario === userId;
// }

// // ========== QUERIES ==========

 // Obtener tienda por ID (solo si eres miembro o propietario)
export const getTiendaById = query({
  args: { tiendaId: v.id("tiendas") },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.warn("⚠️ Usuario no autenticado");
        return null;
    }

    const user = await ctx.db
      .query("usuarios")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      console.warn("⚠️ Usuario no encontrado en base de datos");
        return null;
    }

    const tienda = await ctx.db.get(args.tiendaId);
    if (!tienda) {
      console.warn("⚠️ Tienda no encontrada:", args.tiendaId);
        return null;
    }
    return tienda 
    } catch (error) {
      console.error(error)
      return null
    }
  }})

//     // Verificar que el usuario tenga acceso
//     const esMiembro = tienda.miembros.some((m: any) => m.usuarioId === user._id);
//     if (tienda.propietario !== user._id && !esMiembro) {
//       throw new ConvexError("No tienes permiso para ver esta tienda");
//     }

//     return tienda;
//   },
// });

// Obtener todas las tiendas de un propietario
export const getTiendasByPropietario = query({
  args: { propietarioId: v.id("usuarios") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("No autenticado");
    }

    const tiendas = await ctx.db
      .query("tiendas")
      .withIndex("by_propietario", (q) => q.eq("propietario", args.propietarioId))
      .collect();

    return tiendas ?? null;
  },
});

//  Obtener tiendas por categoría (solo activas)
// export const getTiendasByCategoria = query({
//   args: { categoria: v.string() },
//   handler: async (ctx, args) => {
//     const tiendas = await ctx.db
//       .query("tiendas")
//       .withIndex("by_categoria", (q) => q.eq("categoria", args.categoria))
//       .filter((q) => q.eq(q.field("estado"), "activo"))
//       .collect();

//     return tiendas;
//   },
// });

//  Obtener tiendas por estado (para admin)
// export const getTiendasByEstado = query({
//   args: { estado: v.union(v.literal("activo"), v.literal("inactivo"), v.literal("pendiente")) },
//   handler: async (ctx, args) => {
//     const tiendas = await ctx.db
//       .query("tiendas")
//       .withIndex("by_estado", (q) => q.eq("estado", args.estado))
//       .collect();

//     return tiendas;
//   },
// });

// // Buscar tiendas cercanas (por ubicación)
// export const getTiendasCercanas = query({
//   args: { 
//     lat: v.number(), 
//     lng: v.number(), 
//     radioKm: v.number() 
//   },
//   handler: async (ctx, args) => {
     // Radio en grados aproximados (1 grado ≈ 111 km)
//     const radioGrados = args.radioKm / 111;
//     const latMin = args.lat - radioGrados;
//     const latMax = args.lat + radioGrados;
//     const lngMin = args.lng - radioGrados;
//     const lngMax = args.lng + radioGrados;

//     const tiendas = await ctx.db
//       .query("tiendas")
//       .withIndex("by_ubicacion", (q) => q.gte("lat", latMin))
//       .filter((q) => q.lte(q.field("lat"), latMax))
//       .filter((q) => q.gte(q.field("lng"), lngMin))
//       .filter((q) => q.lte(q.field("lng"), lngMax))
//       .filter((q) => q.eq(q.field("estado"), "activo"))
//       .collect();

//     return tiendas;
//   },
// });

// // Obtener tiendas donde el usuario es miembro
// export const getTiendasByMiembro = query({
//   args: { usuarioId: v.id("usuarios") },
//   handler: async (ctx, args) => {
//     const tiendas = await ctx.db
//       .query("tiendas")
//       .filter((q) => q.eq(q.field("estado"), "activo"))
//       .collect();

//     // Filtrar tiendas donde el usuario es miembro
//     return tiendas.filter((tienda) => 
//       tienda.miembros.some((m: any) => m.usuarioId === args.usuarioId)
//     );
//   },
// });

// Verificar permisos de usuario en una tienda específica
// export const verifyUserPermissionInTienda = query({
//   args: { tiendaId: v.id("tiendas") },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       return { hasAccess: false, rol: null };
//     }

//     const user = await ctx.db
//       .query("usuarios")
//       .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
//       .first();

//     if (!user) {
//       return { hasAccess: false, rol: null };
//     }

//     const tienda = await ctx.db.get(args.tiendaId);
//     if (!tienda) {
//       throw new ConvexError("Tienda no encontrada");
//     }

//     // Verificar si es propietario
//     if (tienda.propietario === user._id) {
//       return { hasAccess: true, rol: "propietario" };
//     }

//     // Verificar si es miembro
//     const miembro = tienda.miembros.find((m: any) => m.usuarioId === user._id);
//     if (miembro) {
//       return { hasAccess: true, rol: miembro.rol };
//     }

//     return { hasAccess: false, rol: null };
//   },
// });

// ========== MUTATIONS ==========

// Crear nueva tienda


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
    if (!identity) throw new ConvexError("No autenticado este diablo falla");
 
    // Buscar usuario en la DB Convex
    const user = await ctx.db.query('usuarios').filter((q) => q.eq(q.field('correo'), identity.email)).collect()
        if(user.length === 0) throw new ConvexError('Usuario no encontrado')

        const tiendaId = await ctx.db.insert("tiendas", {
        avatar: args.avatar ?? "https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg",
        imgBanner: args.imgBanner ?? "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg",
        nombre: args.nombre,
        categoria: args.categoria,
        descripcion: args.descripcion,
        direccion: args.direccion,
        lat: args.lat,
        lng: args.lng,
        puntuacion: 5, // ✔ obligatorio
        telefono: args.telefono,
        propietario: user[0]._id, // ✔ tu ID del usuario logueado
        estado: "pendiente", // ✔ obligatorio
        ventasHoy: 0, // ✔ obligatorio
        departamento: args.departamento,
      miembros: [
        {
        usuarioId: user[0]._id,
        rol: "admin",
        fechaUnion: new Date().toISOString(),
        permisos: ["full_access"]
        }
  ],
  configuracion: {
    NIT: args.configuracion?.NIT ?? "",
    RUC: args.configuracion?.RUC ?? "",
    moneda: args.configuracion?.moneda ?? "NIO",
    whatsapp: args.configuracion?.whatsapp ?? "",
    backup: args.configuracion?.backup ?? "",
    permisosTienda: {
      vendedoresPuedenCrearProductos:
        args.configuracion?.permisosTienda?.vendedoresPuedenCrearProductos ?? true,
      vendedoresPuedenModificarPrecios:
        args.configuracion?.permisosTienda?.vendedoresPuedenModificarPrecios ?? false,
      vendedoresPuedenVerReportes:
        args.configuracion?.permisosTienda?.vendedoresPuedenVerReportes ?? false,
      maxVendedores:
        args.configuracion?.permisosTienda?.maxVendedores ?? 5
    }
  },
  favoritos:0,
  likes:0,
  visitas:0,
  estadisticas:{
    clientesTotales:0,
    productosActivos:0,
    ventasTotales:0
  },
  delivery:{
    costo:10,
    habilitado: true,
    tiempoEstimado: '1h',
    zonas:['boaco']   
  },
  facturacion:{
    habilitada:true,
    numeracionActual:1234,
    serie: "lo que venga me da igual",
    tipo: "automatica"
  },
  ultimaActualizacion:new Date().toISOString(),
  
  horarios: args.horarios,
  metricasEquipo: {
    totalVendedores: 0,
    ventasEsteMes: 0,
    productoMasVendido: undefined
  },
  creadoEn:new Date().toISOString()
});

    return tiendaId;
  },
});


// Actualizar tienda (solo propietario o admin)
// export const actualizarTienda = mutation({
//   args: {
//     tiendaId: v.id("tiendas"),
//     datos: v.object({
//       avatar: v.optional(v.string()),
//       imgBanner: v.optional(v.string()),
//       nombre: v.optional(v.string()),
//       categoria: v.optional(v.string()),
//       descripcion: v.optional(v.string()),
//       direccion: v.optional(v.string()),
//       telefono: v.optional(v.string()),
//       estado: v.optional(v.union(v.literal("activo"), v.literal("inactivo"), v.literal("pendiente"))),
//     })
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       throw new ConvexError("No autenticado");
//     }

//     const user = await ctx.db
//       .query("usuarios")
//       .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
//       .first();

//     if (!user) {
//       throw new ConvexError("Usuario no encontrado");
//     }

//     const tienda = await ctx.db.get(args.tiendaId);
//     if (!tienda) {
//       throw new ConvexError("Tienda no encontrada");
//     }

//     // Verificar permisos (solo propietario o admin)
//     const esPropietario = await isOwner(ctx, args.tiendaId, user._id);
//     const esAdmin = await hasTiendaPermission(ctx, args.tiendaId, user._id, "admin");
    
//     if (!esPropietario && !esAdmin) {
//       throw new ConvexError("No tienes permiso para actualizar esta tienda");
//     }

//     // Solo el propietario puede cambiar el estado
//     if (args.datos.estado && !esPropietario) {
//       throw new ConvexError("Solo el propietario puede cambiar el estado de la tienda");
//     }

//     // Filtrar campos undefined y actualizar
//     const updateData = Object.fromEntries(
//       Object.entries(args.datos).filter(([_, value]) => value !== undefined)
//     );

//     await ctx.db.patch(args.tiendaId, updateData);
//     console.log(`Tienda actualizada: ${args.tiendaId} por usuario ${user._id}`);
//     return { success: true };
//   },
// });

// // Eliminar tienda (solo propietario)
// export const eliminarTienda = mutation({
//   args: { tiendaId: v.id("tiendas") },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       throw new ConvexError("No autenticado");
//     }

//     const user = await ctx.db
//       .query("usuarios")
//       .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
//       .first();

//     if (!user) {
//       throw new ConvexError("Usuario no encontrado");
//     }

//     // Verificar que es propietario
//     const esPropietario = await isOwner(ctx, args.tiendaId, user._id);
//     if (!esPropietario) {
//       throw new ConvexError("Solo el propietario puede eliminar la tienda");
//     }

//     // Eliminar la tienda (esto eliminará también todos los datos relacionados si tienes en cascade)
//     await ctx.db.delete(args.tiendaId);
//     console.log(`Tienda eliminada: ${args.tiendaId} por propietario ${user._id}`);
//     return { success: true };
//   },
// });

// // ========== MUTATIONS PARA GESTIÓN DE MIEMBROS ==========

// // Agregar miembro a la tienda
// export const agregarMiembro = mutation({
//   args: {
//     tiendaId: v.id("tiendas"),
//     usuarioId: v.id("usuarios"),
//     rol: v.union(v.literal("admin"), v.literal("vendedor"), v.literal("asistente")),
//     permisos: v.optional(v.array(v.string()))
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       throw new ConvexError("No autenticado");
//     }

//     const user = await ctx.db
//       .query("usuarios")
//       .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
//       .first();

//     if (!user) {
//       throw new ConvexError("Usuario no encontrado");
//     }

//     const tienda = await ctx.db.get(args.tiendaId);
//     if (!tienda) {
//       throw new ConvexError("Tienda no encontrada");
//     }

//     // Verificar permisos (solo propietario o admin)
//     const puedeGestionar = await hasTiendaPermission(ctx, args.tiendaId, user._id, "admin");
//     if (!puedeGestionar) {
//       throw new ConvexError("No tienes permiso para agregar miembros");
//     }

//     // Verificar que el usuario no sea ya miembro
//     const yaEsMiembro = tienda.miembros.some((m: any) => m.usuarioId === args.usuarioId);
//     if (yaEsMiembro) {
//       throw new ConvexError("El usuario ya es miembro de esta tienda");
//     }

//     // Verificar límite de vendedores si el rol es vendedor
//     if (args.rol === "vendedor") {
//       const vendedoresActuales = tienda.miembros.filter((m: any) => m.rol === "vendedor").length;
//       const maxVendedores = tienda.configuracion.permisosTienda.maxVendedores;
      
//       if (vendedoresActuales >= maxVendedores) {
//         throw new ConvexError(`Límite de vendedores alcanzado (máx: ${maxVendedores})`);
//       }
//     }

//     // Agregar miembro
//     const miembroNuevo = {
//       usuarioId: args.usuarioId,
//       rol: args.rol,
//       fechaUnion: new Date().toISOString(),
//       permisos: args.permisos || []
//     };

//     await ctx.db.patch(args.tiendaId, {
//       miembros: [...tienda.miembros, miembroNuevo],
//       metricasEquipo: {
//         ...tienda.metricasEquipo,
//         totalVendedores: tienda.miembros.filter((m: any) => m.rol === "vendedor").length + (args.rol === "vendedor" ? 1 : 0)
//       }
//     });

//     console.log(`Miembro agregado: ${args.usuarioId} a tienda ${args.tiendaId} con rol ${args.rol}`);
//     return { success: true };
//   },
// });

// // Eliminar miembro de la tienda
// export const eliminarMiembro = mutation({
//   args: {
//     tiendaId: v.id("tiendas"),
//     usuarioId: v.id("usuarios")
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       throw new ConvexError("No autenticado");
//     }

//     const user = await ctx.db
//       .query("usuarios")
//       .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
//       .first();

//     if (!user) {
//       throw new ConvexError("Usuario no encontrado");
//     }

//     const tienda = await ctx.db.get(args.tiendaId);
//     if (!tienda) {
//       throw new ConvexError("Tienda no encontrada");
//     }

//     // Verificar que no se está eliminando al propietario
//     if (tienda.propietario === args.usuarioId) {
//       throw new ConvexError("No se puede eliminar al propietario de la tienda");
//     }

//     // Verificar permisos (solo propietario o admin)
//     const puedeGestionar = await hasTiendaPermission(ctx, args.tiendaId, user._id, "admin");
//     if (!puedeGestionar) {
//       throw new ConvexError("No tienes permiso para eliminar miembros");
//     }

//     // Verificar que el usuario a eliminar es miembro
//     const miembro = tienda.miembros.find((m: any) => m.usuarioId === args.usuarioId);
//     if (!miembro) {
//       throw new ConvexError("El usuario no es miembro de esta tienda");
//     }

//     // Eliminar miembro
//     const nuevosMiembros = tienda.miembros.filter((m: any) => m.usuarioId !== args.usuarioId);

//     await ctx.db.patch(args.tiendaId, {
//       miembros: nuevosMiembros,
//       metricasEquipo: {
//         ...tienda.metricasEquipo,
//         totalVendedores: nuevosMiembros.filter((m: any) => m.rol === "vendedor").length
//       }
//     });

//     console.log(`Miembro eliminado: ${args.usuarioId} de tienda ${args.tiendaId}`);
//     return { success: true };
//   },
// });

// // Actualizar rol de un miembro
// export const actualizarRolMiembro = mutation({
//   args: {
//     tiendaId: v.id("tiendas"),
//     usuarioId: v.id("usuarios"),
//     nuevoRol: v.union(v.literal("admin"), v.literal("vendedor"), v.literal("asistente")),
//     nuevosPermisos: v.optional(v.array(v.string()))
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       throw new ConvexError("No autenticado");
//     }

//     const user = await ctx.db
//       .query("usuarios")
//       .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
//       .first();

//     if (!user) {
//       throw new ConvexError("Usuario no encontrado");
//     }

//     const tienda = await ctx.db.get(args.tiendaId);
//     if (!tienda) {
//       throw new ConvexError("Tienda no encontrada");
//     }

//     // Verificar que no se está modificando al propietario
//     if (tienda.propietario === args.usuarioId) {
//       throw new ConvexError("No se puede modificar el rol del propietario");
//     }

//     // Verificar permisos (solo propietario)
//     const esPropietario = await isOwner(ctx, args.tiendaId, user._id);
//     if (!esPropietario) {
//       throw new ConvexError("Solo el propietario puede modificar roles");
//     }

//     // Verificar que el usuario es miembro
//     const miembroIndex = tienda.miembros.findIndex((m: any) => m.usuarioId === args.usuarioId);
//     if (miembroIndex === -1) {
//       throw new ConvexError("El usuario no es miembro de esta tienda");
//     }

//     // Verificar límite de vendedores si se promueve a vendedor
//     if (args.nuevoRol === "vendedor") {
//       const vendedoresActuales = tienda.miembros.filter((m: any) => m.rol === "vendedor").length;
//       const maxVendedores = tienda.configuracion.permisosTienda.maxVendedores;
      
//       if (tienda.miembros[miembroIndex].rol !== "vendedor" && vendedoresActuales >= maxVendedores) {
//         throw new ConvexError(`Límite de vendedores alcanzado (máx: ${maxVendedores})`);
//       }
//     }

//     // Actualizar rol y permisos
//     const miembrosActualizados = [...tienda.miembros];
//     miembrosActualizados[miembroIndex] = {
//       ...miembrosActualizados[miembroIndex],
//       rol: args.nuevoRol,
//       permisos: args.nuevosPermisos || miembrosActualizados[miembroIndex].permisos
//     };

//     await ctx.db.patch(args.tiendaId, {
//       miembros: miembrosActualizados,
//       metricasEquipo: {
//         ...tienda.metricasEquipo,
//         totalVendedores: miembrosActualizados.filter((m: any) => m.rol === "vendedor").length
//       }
//     });

//     console.log(`Rol actualizado: ${args.usuarioId} -> ${args.nuevoRol} en tienda ${args.tiendaId}`);
//     return { success: true };
//   },
// });

// // Actualizar configuración de la tienda
// export const actualizarConfiguracionTienda = mutation({
//   args: {
//     tiendaId: v.id("tiendas"),
//     configuracion: v.object({
//       NIT: v.optional(v.string()),
//       RUC: v.optional(v.string()),
//       moneda: v.optional(v.string()),
//       whatsapp: v.optional(v.string()),
//       backup: v.optional(v.string()),
//       permisosTienda: v.optional(v.object({
//         vendedoresPuedenCrearProductos: v.boolean(),
//         vendedoresPuedenModificarPrecios: v.boolean(),
//         vendedoresPuedenVerReportes: v.boolean(),
//         maxVendedores: v.number()
//       }))
//     })
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       throw new ConvexError("No autenticado");
//     }

//     const user = await ctx.db
//       .query("usuarios")
//       .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
//       .first();

//     if (!user) {
//       throw new ConvexError("Usuario no encontrado");
//     }

//     const tienda = await ctx.db.get(args.tiendaId);
//     if (!tienda) {
//       throw new ConvexError("Tienda no encontrada");
//     }

//     // Verificar permisos (solo propietario o admin)
//     const puedeModificar = await hasTiendaPermission(ctx, args.tiendaId, user._id, "admin");
//     if (!puedeModificar) {
//       throw new ConvexError("No tienes permiso para modificar la configuración");
//     }

//     // Fusionar configuración existente con nueva
//     const configuracionActualizada = {
//       ...tienda.configuracion,
//       ...args.configuracion,
//       permisosTienda: {
//         ...tienda.configuracion.permisosTienda,
//         ...(args.configuracion.permisosTienda || {})
//       }
//     };

//     await ctx.db.patch(args.tiendaId, {
//       configuracion: configuracionActualizada
//     });

//     console.log(`Configuración actualizada para tienda ${args.tiendaId}`);
//     return { success: true };
//   },
// });
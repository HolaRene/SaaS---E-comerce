import { ConvexError, v } from 'convex/values'
import { internalMutation, query, mutation } from './_generated/server'

// ========== QUERIES ==========
// Obtener usuario por ID de Convex (más eficiente cuando ya tienes el ID)
export const getUser = query({
  args: { userId: v.id('usuarios') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)

    if (!user) {
      throw new ConvexError('Usuario no encontrado')
    }

    return user
  },
})

// Obtener usuario por Clerk ID (para autenticación)
export const getUserById = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', args.clerkId))
      .first()

    if (!user) {
      throw new ConvexError('Usuario no encontrado')
    }

    return user
  },
})

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('usuarios')
      .withIndex('by_correo', q => q.eq('correo', args.email))
      .first()

    return user
  },
})

// Obtener usuarios por rol (para admin)
export const getUsersByRole = query({
  args: {
    rol: v.union(
      v.literal('admin'),
      v.literal('vendedor'),
      v.literal('cliente')
    ),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query('usuarios')
      .withIndex('by_rol', q => q.eq('rol', args.rol))
      .collect()

    return users
  },
})

// Top vendedores por ventas (similar al ejemplo de podcasts)
// export const getTopVendedores = query({
//   args: {},
//   handler: async (ctx, args) => {
//     const vendedores = await ctx.db
//       .query("usuarios")
//       .withIndex("by_rol", (q) => q.eq("rol", "vendedor"))
//       .collect();

//     const vendedoresConVentas = await Promise.all(
//       vendedores.map(async (vendedor) => {
//         // Obtener todas las tiendas donde este usuario es miembro como vendedor
//         const tiendasDelVendedor = await ctx.db
//           .query("tiendaMiembros")
//           .withIndex("by_usuario", (q) => q.eq("usuarioId", vendedor._id))
//           .filter((q) => q.eq(q.field("rol"), "vendedor"))
//           .collect();

//         // Obtener ventas de estas tiendas
//         let totalVentas = 0;
//         for (const membresia of tiendasDelVendedor) {
//           const ventas = await ctx.db
//             .query("ordenes")
//             .withIndex("by_tienda", (q) => q.eq("tiendaId", membresia.tiendaId))
//             .collect();
//           totalVentas += ventas.length;
//         }

//         return {
//           ...vendedor,
//           totalVentas,
//           totalTiendas: tiendasDelVendedor.length
//         };
//       })
//     );

//     return vendedoresConVentas.sort((a, b) => b.totalVentas - a.totalVentas);
//   },
// });

// ========== MUTATIONS ==========
export const crearUser = internalMutation({
  args: {
    clerkId: v.string(),
    correo: v.string(),
    imgUrl: v.optional(v.string()),
    nombre: v.string(),
    apellido: v.string(),
    numeroTelefono: v.optional(v.string()),
    rol: v.union(
      v.literal('admin'),
      v.literal('vendedor'),
      v.literal('cliente')
    ),
  },
  handler: async (ctx, args) => {
    // Validar que el usuario no exista
    const usuarioExistente = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', args.clerkId))
      .first()

    if (usuarioExistente) {
      throw new ConvexError(`Usuario con clerkId ${args.clerkId} ya existe`)
    }

    // Validar que el email no esté en uso
    const emailExistente = await ctx.db
      .query('usuarios')
      .withIndex('by_correo', q => q.eq('correo', args.correo))
      .first()

    if (emailExistente) {
      throw new ConvexError(`El email ${args.correo} ya está registrado`)
    }

    // Crear usuario
    const userId = await ctx.db.insert('usuarios', {
      clerkId: args.clerkId,
      correo: args.correo,
      imgUrl: args.imgUrl || '/default-avatar.png',
      nombre: args.nombre,
      numTelefono: args.numeroTelefono || '',
      apellido: args.apellido,
      rol: args.rol,
      configuracion: {
        notificaciones: true,
        tema: 'claro',
      },
      //   fechaCreacion: new Date().toISOString(),
      //   estado: "activo"
    })

    console.log(`Usuario creado: ${args.nombre} (${userId})`)
    return userId
  },
})

export const updateUser = internalMutation({
  args: {
    clerkId: v.string(),
    imgUrl: v.optional(v.string()),
    correo: v.optional(v.string()),
    nombre: v.optional(v.string()),
    numeroTelefono: v.optional(v.string()),
    rol: v.optional(
      v.union(v.literal('admin'), v.literal('vendedor'), v.literal('cliente'))
    ),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', args.clerkId))
      .first()

    if (!user) {
      throw new ConvexError('Usuario no encontrado')
    }

    // Si se actualiza el email, verificar que no esté en uso
    if (args.correo && args.correo !== user.correo) {
      const emailExistente = await ctx.db
        .query('usuarios')
        .withIndex('by_correo', q => q.eq('correo', args.correo!))
        .first()

      if (emailExistente) {
        throw new ConvexError('El email ya está en uso por otro usuario')
      }
    }

    await ctx.db.patch(user._id, {
      ...(args.imgUrl && { imgUrl: args.imgUrl }),
      ...(args.correo && { correo: args.correo }),
      ...(args.nombre && { nombre: args.nombre }),
      ...(args.numeroTelefono && { numTelefono: args.numeroTelefono }),
      ...(args.rol && { rol: args.rol }),
    })

    // Actualizar referencias en otras tablas (similar al ejemplo de podcasts)
    // Actualizar imagen en reseñas
    // const resenas = await ctx.db
    //   .query("resenasProductos")
    //   .withIndex("by_cliente_producto", (q) => q.eq("clienteId", user._id))
    //   .collect();

    // await Promise.all(
    //   resenas.map(async (resena) => {
    //     // Aquí podrías actualizar información del cliente en las reseñas si es necesario
    //     // Por ejemplo, si almacenas el nombre del cliente en la reseña
    //   })
    // );

    return user._id
  },
})

// export const deleteUser = internalMutation({
//   args: { clerkId: v.string() },
//   async handler(ctx, args) {
//     const user = await ctx.db
//       .query("usuarios")
//       .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
//       .first();

//     if (!user) {
//       throw new ConvexError("Usuario no encontrado");
//     }

//     // 1. Verificar si el usuario tiene tiendas como propietario
//     const tiendasComoPropietario = await ctx.db
//       .query("tiendas")
//       .withIndex("by_propietario", (q) => q.eq("propietario", user._id))
//       .collect();

//     if (tiendasComoPropietario.length > 0) {
//       throw new ConvexError("No se puede eliminar usuario con tiendas activas. Transfiere las tiendas primero.");
//     }

//     // 2. Buscar y eliminar membresías en tiendaMiembros
//     const membresias = await ctx.db
//       .query("tiendaMiembros")
//       .withIndex("by_usuario", (q) => q.eq("usuarioId", user._id))
//       .collect();

//     if (membresias.length > 0) {
//       // Eliminar cada membresía
//       await Promise.all(
//         membresias.map(async (membresia) => {
//           await ctx.db.delete(membresia._id);
//         })
//       );

//       // Actualizar métricas en cada tienda afectada
//       for (const membresia of membresias) {
//         const tienda = await ctx.db.get(membresia.tiendaId);
//         if (tienda) {
//           // Calcular nuevo total de vendedores
//           const vendedoresRestantes = await ctx.db
//             .query("tiendaMiembros")
//             .withIndex("by_tienda", (q) => q.eq("tiendaId", membresia.tiendaId))
//             .filter((q) => q.eq(q.field("rol"), "vendedor"))
//             .collect();

//           await ctx.db.patch(tienda._id, {
//             metricasEquipo: {
//               totalVendedores: vendedoresRestantes.length,
//               ventasEsteMes: tienda.metricasEquipo?.ventasEsteMes || 0,
//               productoMasVendido: tienda.metricasEquipo?.productoMasVendido
//             }
//           });
//         }
//       }
//     }

//     // 3. Eliminar reseñas del usuario
//     const resenasProductos = await ctx.db
//       .query("resenasProductos")
//       .withIndex("by_cliente", (q) => q.eq("clienteId", user._id))
//       .collect();

//     const resenasTienda = await ctx.db
//       .query("resenasTienda")
//       .withIndex("by_cliente", (q) => q.eq("clienteId", user._id))
//       .collect();

//     // Eliminar todas las reseñas
//     await Promise.all([
//       ...resenasProductos.map(resena => ctx.db.delete(resena._id)),
//       ...resenasTienda.map(resena => ctx.db.delete(resena._id))
//     ]);

//     // 4. Finalmente eliminar el usuario
//     await ctx.db.delete(user._id);

//     console.log(`Usuario eliminado: ${user.nombre} (${user._id})`);
//     return { success: true };
//   },
// });

// ========== MUTATIONS PÚBLICAS (para el cliente) ==========
export const updateProfile = mutation({
  args: {
    nombre: v.optional(v.string()),
    imgUrl: v.optional(v.string()),
    numeroTelefono: v.optional(v.string()),
    configuracion: v.optional(
      v.object({
        notificaciones: v.boolean(),
        tema: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError('No autenticado')
    }

    const user = await ctx.db
      .query('usuarios')
      .withIndex('by_clerkId', q => q.eq('clerkId', identity.subject))
      .first()

    if (!user) {
      throw new ConvexError('Usuario no encontrado')
    }

    await ctx.db.patch(user._id, {
      ...(args.nombre && { nombre: args.nombre }),
      ...(args.imgUrl && { imgUrl: args.imgUrl }),
      ...(args.numeroTelefono && { numTelefono: args.numeroTelefono }),
      ...(args.configuracion && { configuracion: args.configuracion }),
    })

    return { success: true }
  },
})

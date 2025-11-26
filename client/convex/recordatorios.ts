import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============================================
// QUERIES
// ============================================

/**
 * Obtener todos los recordatorios de una tienda
 */
export const getRecordatoriosByTienda = query({
  args: {
    tiendaId: v.id("tiendas"),
    estado: v.optional(v.union(
      v.literal("pendiente"),
      v.literal("enviado"),
      v.literal("completado"),
      v.literal("cancelado")
    )),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("recordatorios")
      .withIndex("by_tienda", (q) => q.eq("tiendaId", args.tiendaId));

    let recordatorios = await query.collect();

    // Filtrar por estado si se especifica
    if (args.estado) {
      recordatorios = recordatorios.filter((r) => r.estado === args.estado);
    }

    // Enriquecer con información del cliente
    const recordatoriosConCliente = await Promise.all(
      recordatorios.map(async (recordatorio) => {
        const cliente = await ctx.db.get(recordatorio.clienteId);
        return {
          ...recordatorio,
          clienteNombre: cliente?.nombre || "Cliente desconocido",
          clienteTelefono: cliente?.telefono,
        };
      })
    );

    // Ordenar por fecha programada
    return recordatoriosConCliente.sort((a, b) => 
      a.fechaProgramada.localeCompare(b.fechaProgramada)
    );
  },
});

/**
 * Obtener clientes morosos (con créditos vencidos)
 */
export const getMorosos = query({
  args: {
    tiendaId: v.id("tiendas"),
  },
  handler: async (ctx, args) => {
    const hoy = new Date().toISOString();

    // Obtener créditos vencidos
    const creditos = await ctx.db
      .query("creditos")
      .withIndex("by_tienda", (q) => q.eq("tiendaId", args.tiendaId))
      .filter((q) => q.eq(q.field("estado"), "activo"))
      .collect();

    // Filtrar solo los vencidos
    const creditosVencidos = creditos.filter(
      (c) => c.fechaVencimiento && c.fechaVencimiento < hoy
    );

    // Enriquecer con información del cliente
    const morosos = await Promise.all(
      creditosVencidos.map(async (credito) => {
        const cliente = await ctx.db.get(credito.clienteId);
        
        // Calcular días de atraso
        const fechaVenc = new Date(credito.fechaVencimiento!);
        const hoyDate = new Date(hoy);
        const diasAtraso = Math.floor(
          (hoyDate.getTime() - fechaVenc.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          clienteId: credito.clienteId,
          creditoId: credito._id,
          nombre: cliente?.nombre || "Cliente desconocido",
          telefono: cliente?.telefono,
          monto: credito.saldoActual,
          diasAtraso,
          fechaVencimiento: credito.fechaVencimiento,
        };
      })
    );

    // Ordenar por días de atraso (mayor a menor)
    return morosos.sort((a, b) => b.diasAtraso - a.diasAtraso);
  },
});

/**
 * Obtener estadísticas de cartera (distribución de créditos)
 */
export const getEstadisticasCartera = query({
  args: {
    tiendaId: v.id("tiendas"),
  },
  handler: async (ctx, args) => {
    const creditos = await ctx.db
      .query("creditos")
      .withIndex("by_tienda", (q) => q.eq("tiendaId", args.tiendaId))
      .collect();

    const total = creditos.length;
    if (total === 0) {
      return {
        pagado: 0,
        pendiente: 0,
        vencido: 0,
        totalCreditos: 0,
      };
    }

    const hoy = new Date().toISOString();

    const pagados = creditos.filter((c) => c.estado === "pagado").length;
    const activos = creditos.filter((c) => c.estado === "activo");
    const vencidos = activos.filter(
      (c) => c.fechaVencimiento && c.fechaVencimiento < hoy
    ).length;
    const pendientes = activos.length - vencidos;

    return {
      pagado: Math.round((pagados / total) * 100),
      pendiente: Math.round((pendientes / total) * 100),
      vencido: Math.round((vencidos / total) * 100),
      totalCreditos: total,
    };
  },
});

/**
 * Obtener recordatorios próximos a vencer (próximos 7 días)
 */
export const getRecordatoriosProximos = query({
  args: {
    tiendaId: v.id("tiendas"),
    dias: v.optional(v.number()), // Días hacia adelante (default: 7)
  },
  handler: async (ctx, args) => {
    const hoy = new Date();
    const diasAdelante = args.dias || 7;
    const fechaLimite = new Date(hoy.getTime() + diasAdelante * 24 * 60 * 60 * 1000);

    const recordatorios = await ctx.db
      .query("recordatorios")
      .withIndex("by_tienda", (q) => q.eq("tiendaId", args.tiendaId))
      .filter((q) => q.eq(q.field("estado"), "pendiente"))
      .collect();

    // Filtrar por rango de fechas
    const recordatoriosProximos = recordatorios.filter((r) => {
      const fechaProg = new Date(r.fechaProgramada);
      return fechaProg >= hoy && fechaProg <= fechaLimite;
    });

    // Enriquecer con información del cliente
    const recordatoriosConCliente = await Promise.all(
      recordatoriosProximos.map(async (recordatorio) => {
        const cliente = await ctx.db.get(recordatorio.clienteId);
        return {
          ...recordatorio,
          clienteNombre: cliente?.nombre || "Cliente desconocido",
        };
      })
    );

    return recordatoriosConCliente.sort((a, b) => 
      a.fechaProgramada.localeCompare(b.fechaProgramada)
    );
  },
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Crear un nuevo recordatorio
 */
export const createRecordatorio = mutation({
  args: {
    tiendaId: v.id("tiendas"),
    clienteId: v.id("clientes"),
    creditoId: v.optional(v.id("creditos")),
    tipo: v.union(
      v.literal("cobro"),
      v.literal("recordatorio"),
      v.literal("vencimiento")
    ),
    fechaProgramada: v.string(),
    monto: v.number(),
    mensaje: v.optional(v.string()),
    actualizarCredito: v.optional(v.boolean()), // Nuevo flag
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    // Obtener el usuario actual
    const usuario = await ctx.db
      .query("usuarios")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!usuario) throw new Error("Usuario no encontrado");

    const recordatorioId = await ctx.db.insert("recordatorios", {
      tiendaId: args.tiendaId,
      clienteId: args.clienteId,
      creditoId: args.creditoId,
      tipo: args.tipo,
      fechaProgramada: args.fechaProgramada,
      monto: args.monto,
      mensaje: args.mensaje,
      estado: "pendiente",
      creadoPor: usuario._id,
    });

    // Si se solicita, actualizar la fecha de vencimiento del crédito
    if (args.actualizarCredito && args.creditoId) {
      await ctx.db.patch(args.creditoId, {
        fechaVencimiento: args.fechaProgramada,
      });
    }

    return recordatorioId;
  },
});

/**
 * Marcar recordatorio como enviado
 */
export const enviarRecordatorio = mutation({
  args: {
    recordatorioId: v.id("recordatorios"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    await ctx.db.patch(args.recordatorioId, {
      estado: "enviado",
      fechaEnvio: new Date().toISOString(),
    });

    return args.recordatorioId;
  },
});

/**
 * Marcar recordatorio como completado
 */
export const completarRecordatorio = mutation({
  args: {
    recordatorioId: v.id("recordatorios"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    await ctx.db.patch(args.recordatorioId, {
      estado: "completado",
    });

    return args.recordatorioId;
  },
});

/**
 * Cancelar recordatorio
 */
export const cancelarRecordatorio = mutation({
  args: {
    recordatorioId: v.id("recordatorios"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    await ctx.db.patch(args.recordatorioId, {
      estado: "cancelado",
    });

    return args.recordatorioId;
  },
});

/**
 * Eliminar recordatorio permanentemente
 */
export const deleteRecordatorio = mutation({
  args: {
    recordatorioId: v.id("recordatorios"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    await ctx.db.delete(args.recordatorioId);
  },
});

/**
 * Crear recordatorios automáticos para créditos próximos a vencer
 */
export const crearRecordatoriosAutomaticos = mutation({
  args: {
    tiendaId: v.id("tiendas"),
    diasAnticipacion: v.optional(v.number()), // Días antes del vencimiento (default: 1)
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const usuario = await ctx.db
      .query("usuarios")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!usuario) throw new Error("Usuario no encontrado");

    const diasAnticipacion = args.diasAnticipacion || 1;
    const hoy = new Date();
    const fechaLimite = new Date(hoy.getTime() + diasAnticipacion * 24 * 60 * 60 * 1000);

    // Obtener créditos activos próximos a vencer
    const creditos = await ctx.db
      .query("creditos")
      .withIndex("by_tienda", (q) => q.eq("tiendaId", args.tiendaId))
      .filter((q) => q.eq(q.field("estado"), "activo"))
      .collect();

    const creditosProximos = creditos.filter((c) => {
      if (!c.fechaVencimiento) return false;
      const fechaVenc = new Date(c.fechaVencimiento);
      return fechaVenc >= hoy && fechaVenc <= fechaLimite;
    });

    // Crear recordatorios
    const recordatoriosCreados = [];
    for (const credito of creditosProximos) {
      // Verificar que no exista ya un recordatorio pendiente
      const recordatorioExistente = await ctx.db
        .query("recordatorios")
        .withIndex("by_cliente", (q) => q.eq("clienteId", credito.clienteId))
        .filter((q) => 
          q.and(
            q.eq(q.field("creditoId"), credito._id),
            q.eq(q.field("estado"), "pendiente")
          )
        )
        .first();

      if (!recordatorioExistente) {
        const recordatorioId = await ctx.db.insert("recordatorios", {
          tiendaId: args.tiendaId,
          clienteId: credito.clienteId,
          creditoId: credito._id,
          tipo: "vencimiento",
          fechaProgramada: credito.fechaVencimiento!,
          monto: credito.saldoActual,
          mensaje: `Recordatorio: Su crédito vence el ${credito.fechaVencimiento}`,
          estado: "pendiente",
          creadoPor: usuario._id,
        });
        recordatoriosCreados.push(recordatorioId);
      }
    }

    return {
      cantidad: recordatoriosCreados.length,
      recordatorios: recordatoriosCreados,
    };
  },
});

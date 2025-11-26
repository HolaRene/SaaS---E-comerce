import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Crear venta completa
export const crearVenta = mutation({
  args: {
    tiendaId: v.id("tiendas"),
    clienteId: v.optional(v.id("clientes")),
    productos: v.array(v.object({
      productoId: v.id("productos"),
      cantidad: v.number(),
      precioUnitario: v.number(),
      nombreProducto: v.string(),
    })),
    metodoPago: v.union(
      v.literal("efectivo"),
      v.literal("tarjeta"),
      v.literal("transferencia"),
      v.literal("fiado")
    ),
    subtotal: v.number(),
    impuesto: v.number(),
    total: v.number(),
    notas: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    // Obtener usuario
    const usuario = await ctx.db
      .query("usuarios")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    if (!usuario) throw new Error("Usuario no encontrado");

    // 1. Crear la venta
    const ventaId = await ctx.db.insert("ventas", {
      tiendaId: args.tiendaId,
      clienteId: args.clienteId,
      usuarioId: usuario._id,
      fecha: new Date().toISOString(),
      subtotal: args.subtotal,
      impuesto: args.impuesto,
      total: args.total,
      metodoPago: args.metodoPago,
      estado: "completada",
      notas: args.notas,
    });

    // 2. Crear detalles de venta y actualizar stock
    for (const item of args.productos) {
      await ctx.db.insert("detallesVenta", {
        ventaId,
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal: item.cantidad * item.precioUnitario,
        nombreProducto: item.nombreProducto,
      });

      // 3. Actualizar stock del producto
      const producto = await ctx.db.get(item.productoId);
      if (producto) {
        await ctx.db.patch(item.productoId, {
          cantidad: producto.cantidad - item.cantidad,
        });

        // 4. Registrar movimiento de inventario
        await ctx.db.insert("movimientosInventario", {
          productoId: item.productoId,
          tiendaId: args.tiendaId,
          usuarioId: usuario._id,
          tipo: "SALIDA",
          cantidad: item.cantidad,
          stockAnterior: producto.cantidad,
          stockNuevo: producto.cantidad - item.cantidad,
          razon: "Venta",
          fecha: new Date().toISOString(),
          ventaId,
        });
      }
    }

    // 5. Si es fiado, crear o actualizar crédito
    if (args.metodoPago === "fiado" && args.clienteId) {
      // Buscar si ya existe un crédito activo para este cliente
      const creditoExistente = await ctx.db
        .query("creditos")
        .withIndex("by_cliente", (q) => q.eq("clienteId", args.clienteId!))
        .filter((q) => q.eq(q.field("estado"), "activo"))
        .first();

      if (creditoExistente) {
        // Actualizar crédito existente
        await ctx.db.patch(creditoExistente._id, {
          saldoActual: creditoExistente.saldoActual + args.total,
        });
      } else {
        // Crear nuevo crédito
        await ctx.db.insert("creditos", {
          tiendaId: args.tiendaId,
          clienteId: args.clienteId,
          limiteCredito: 5000, // Límite por defecto, puedes ajustarlo
          saldoActual: args.total,
          fechaInicio: new Date().toISOString(),
          estado: "activo",
          notas: `Crédito iniciado con venta`,
        });
      }
    }

    // 6. Actualizar estadísticas del cliente (si existe)
    if (args.clienteId) {
      const cliente = await ctx.db.get(args.clienteId);
      if (cliente) {
        await ctx.db.patch(args.clienteId, {
          totalCompras: cliente.totalCompras + args.total,
          cantidadCompras: cliente.cantidadCompras + 1,
          ultimaCompra: new Date().toISOString(),
        });
      }
    }

    return ventaId;
  },
});

// Obtener ventas por tienda
export const getVentasByTienda = query({
  args: { 
    tiendaId: v.id("tiendas"),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const ventas = await ctx.db
      .query("ventas")
      .withIndex("by_tienda", (q) => q.eq("tiendaId", args.tiendaId))
      .order("desc")
      .take(args.limit || 50);

    // Enriquecer con datos de cliente y cajero
    return await Promise.all(
      ventas.map(async (venta) => {
        const cliente = venta.clienteId 
          ? await ctx.db.get(venta.clienteId)
          : null;
        
        const usuario = await ctx.db.get(venta.usuarioId);

        return {
          ...venta,
          clienteNombre: cliente?.nombre || "Cliente General",
          cajeroNombre: usuario?.nombre || "Desconocido",
        };
      })
    );
  },
});

// Obtener detalle de venta
export const getDetalleVenta = query({
  args: { ventaId: v.id("ventas") },
  handler: async (ctx, args) => {
    const venta = await ctx.db.get(args.ventaId);
    if (!venta) return null;

    const detalles = await ctx.db
      .query("detallesVenta")
      .withIndex("by_venta", (q) => q.eq("ventaId", args.ventaId))
      .collect();

    const cliente = venta.clienteId 
      ? await ctx.db.get(venta.clienteId)
      : null;

    const usuario = await ctx.db.get(venta.usuarioId);

    return {
      ...venta,
      detalles,
      cliente,
      cajero: usuario,
    };
  },
});

// Estadísticas de ventas
export const getEstadisticasVentas = query({
  args: { 
    tiendaId: v.id("tiendas"),
    fechaInicio: v.optional(v.string()),
    fechaFin: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let ventas = await ctx.db
      .query("ventas")
      .withIndex("by_tienda", (q) => q.eq("tiendaId", args.tiendaId))
      .filter((q) => q.eq(q.field("estado"), "completada"))
      .collect();

    // Filtrar por fecha si se proporciona
    if (args.fechaInicio || args.fechaFin) {
      ventas = ventas.filter(v => {
        const fecha = new Date(v.fecha);
        if (args.fechaInicio && fecha < new Date(args.fechaInicio)) return false;
        if (args.fechaFin && fecha > new Date(args.fechaFin)) return false;
        return true;
      });
    }

    const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
    const cantidadVentas = ventas.length;
    const promedioVenta = cantidadVentas > 0 ? totalVentas / cantidadVentas : 0;

    // Clientes únicos
    const clientesUnicos = new Set(
      ventas.filter(v => v.clienteId).map(v => v.clienteId)
    ).size;

    return {
      totalVentas,
      cantidadVentas,
      promedioVenta,
      clientesAtendidos: clientesUnicos,
    };
  },
});

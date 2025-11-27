import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// --- DOCUMENTOS ---

export const getDocumentos = query({
  args: { tiendaId: v.id('tiendas') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('documentos')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .order('desc')
      .collect()
  },
})

export const getDocumentoById = query({
  args: { id: v.id('documentos') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const createDocumento = mutation({
  args: {
    tiendaId: v.id('tiendas'),
    titulo: v.string(),
    contenido: v.string(),
    tipo: v.union(v.literal('contrato'), v.literal('carta'), v.literal('otro')),
    creadoPor: v.id('usuarios'),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString()
    return await ctx.db.insert('documentos', {
      ...args,
      ultimaModificacion: now,
    })
  },
})

export const updateDocumento = mutation({
  args: {
    id: v.id('documentos'),
    titulo: v.optional(v.string()),
    contenido: v.optional(v.string()),
    tipo: v.optional(
      v.union(v.literal('contrato'), v.literal('carta'), v.literal('otro'))
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args
    const now = new Date().toISOString()
    await ctx.db.patch(id, {
      ...fields,
      ultimaModificacion: now,
    })
  },
})

export const deleteDocumento = mutation({
  args: { id: v.id('documentos') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

// --- HOJAS DE CÁLCULO ---

export const getHojasCalculo = query({
  args: { tiendaId: v.id('tiendas') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('hojasCalculo')
      .withIndex('by_tienda', q => q.eq('tiendaId', args.tiendaId))
      .order('desc')
      .collect()
  },
})

export const getHojaCalculoById = query({
  args: { id: v.id('hojasCalculo') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const createHojaCalculo = mutation({
  args: {
    tiendaId: v.id('tiendas'),
    titulo: v.string(),
    contenido: v.string(),
    creadoPor: v.id('usuarios'),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString()
    return await ctx.db.insert('hojasCalculo', {
      ...args,
      ultimaModificacion: now,
    })
  },
})

export const updateHojaCalculo = mutation({
  args: {
    id: v.id('hojasCalculo'),
    titulo: v.optional(v.string()),
    contenido: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args
    const now = new Date().toISOString()
    await ctx.db.patch(id, {
      ...fields,
      ultimaModificacion: now,
    })
  },
})

export const deleteHojaCalculo = mutation({
  args: { id: v.id('hojasCalculo') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

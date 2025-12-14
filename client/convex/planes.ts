/**
 * Sistema de Planes Simplificado
 * Solo límites esenciales: Productos, Miembros, Clientes
 */

export const LIMITES_PLANES = {
  gratis: {
    nombre: 'Gratis',
    precio: 0,
    tiendas: 1,
    productos: 20,
    miembros: 2, // 1 propietario + 1 vendedor
    clientes: 50,
  },
  basico: {
    nombre: 'Básico',
    precio: 15,
    tiendas: 3,
    productos: 100,
    miembros: 3,
    clientes: 500,
  },
  profesional: {
    nombre: 'Profesional',
    precio: 39,
    tiendas: 10,
    productos: 500,
    miembros: 10,
    clientes: 5000,
  },
  empresarial: {
    nombre: 'Empresarial',
    precio: 99,
    tiendas: -1, // ilimitado
    productos: -1, // -1 = ilimitado
    miembros: 50,
    clientes: -1, // ilimitado
  },
} as const

export type PlanTipo = keyof typeof LIMITES_PLANES

/**
 * Obtener límites de un plan
 */
export function getLimitesPlan(plan?: string) {
  const planNormalizado = (plan || 'gratis') as PlanTipo
  return LIMITES_PLANES[planNormalizado] || LIMITES_PLANES.gratis
}

/**
 * Verificar si un recurso específico excede el límite
 */
export function excedeLimite(usoActual: number, limite: number): boolean {
  if (limite === -1) return false // Ilimitado
  return usoActual >= limite
}

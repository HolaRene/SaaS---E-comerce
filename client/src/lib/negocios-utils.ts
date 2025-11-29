/**
 * UTILIDADES PARA MANEJO DE TIENDAS
 * Funciones helper para estados, horarios y filtrado
 */


import type { Store, StoreFilters, Schedule } from "./types-negocios"

// ==========================================
// VERIFICACIÓN DE HORARIOS
// ==========================================

/**
 * Verifica si una tienda está abierta actualmente basándose en sus horarios
 */
export function isStoreOpen(horarios: Schedule[]): boolean {
  const now = new Date()
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  const currentDay = days[now.getDay()]
  const currentTime = now.getHours() * 60 + now.getMinutes() // Minutos desde medianoche

  const todaySchedule = horarios.find((h) => h.dia === currentDay)

  if (!todaySchedule || todaySchedule.cerrado) {
    return false
  }

  const [openHour, openMin] = todaySchedule.apertura.split(":").map(Number)
  const [closeHour, closeMin] = todaySchedule.cierre.split(":").map(Number)

  const openTime = openHour * 60 + openMin
  const closeTime = closeHour * 60 + closeMin

  return currentTime >= openTime && currentTime <= closeTime
}

/**
 * Obtiene el estado visual de una tienda (texto y color)
 */
export function getStoreStatusInfo(store: Store): {
  text: string
  color: "success" | "destructive" | "warning" | "muted"
  isOpen: boolean
} {
  // Primero verificar estado general de la tienda
  switch (store.estado) {
    case "cerrado_temporal":
      return { text: "Cerrado temporal", color: "warning", isOpen: false }
    case "suspendido":
      return { text: "Suspendido", color: "muted", isOpen: false }
    case "cerrado":
      return { text: "Cerrado", color: "destructive", isOpen: false }
  }

  // Si está activo, verificar horarios
  const open = isStoreOpen(store.horarios)
  return open
    ? { text: "Abierto", color: "success", isOpen: true }
    : { text: "Cerrado", color: "destructive", isOpen: false }
}

/**
 * Formatea el horario de hoy para mostrar
 */
export function getTodaySchedule(horarios: Schedule[]): string {
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  const today = days[new Date().getDay()]
  const schedule = horarios.find((h) => h.dia === today)

  if (!schedule || schedule.cerrado) {
    return "Cerrado hoy"
  }

  return `${schedule.apertura} - ${schedule.cierre}`
}

// ==========================================
// BÚSQUEDA CON FUSE.JS
// ==========================================

/** Configuración de Fuse.js para búsqueda difusa */
const fuseOptions: Fuse.IFuseOptions<Store> = {
  keys: [
    { name: "nombre", weight: 0.4 },
    { name: "categoria", weight: 0.25 },
    { name: "departamento", weight: 0.2 },
    { name: "descripcion", weight: 0.15 },
  ],
  threshold: 0.4, // Tolerancia a errores tipográficos
  includeScore: true,
}

/**
 * Realiza búsqueda difusa en tiendas
 */
export function searchStores(stores: Store[], query: string): Store[] {
  if (!query.trim()) return stores

  const fuse = new Fuse(stores, fuseOptions)
  const results = fuse.search(query)

  return results.map((r) => r.item)
}

// ==========================================
// FILTRADO DE TIENDAS
// ==========================================

/**
 * Aplica todos los filtros a la lista de tiendas
 */
export function filterStores(stores: Store[], filters: StoreFilters): Store[] {
  let filtered = [...stores]

  // Filtro por búsqueda (usa Fuse.js)
  if (filters.searchQuery) {
    filtered = searchStores(filtered, filters.searchQuery)
  }

  // Filtro por categoría
  if (filters.categoria) {
    filtered = filtered.filter((s) => s.categoria === filters.categoria)
  }

  // Filtro por departamento
  if (filters.departamento) {
    filtered = filtered.filter((s) => s.departamento === filters.departamento)
  }

  // Filtro por rating mínimo
  if (filters.minRating > 0) {
    filtered = filtered.filter((s) => s.rating >= filters.minRating)
  }

  // Filtro por tiendas abiertas
  if (filters.soloAbiertas) {
    filtered = filtered.filter((s) => {
      const status = getStoreStatusInfo(s)
      return status.isOpen
    })
  }

  // Filtro por delivery
  if (filters.conDelivery) {
    filtered = filtered.filter((s) => s.delivery.habilitado)
  }

  // Filtro por verificadas
  if (filters.verificadas) {
    filtered = filtered.filter((s) => s.verificada)
  }

  return filtered
}

// ==========================================
// FORMATEO
// ==========================================

/**
 * Formatea precio en córdobas
 */
export function formatPrice(price: number): string {
  return `C$ ${price.toLocaleString("es-NI")}`
}

/**
 * Formatea fecha relativa
 */
export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Hoy"
  if (diffDays === 1) return "Ayer"
  if (diffDays < 7) return `Hace ${diffDays} días`
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`
  return `Hace ${Math.floor(diffDays / 365)} años`
}

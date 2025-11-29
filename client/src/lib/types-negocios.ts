/**
 * TIPOS Y INTERFACES DEL MARKETPLACE
 * Define la estructura de datos para tiendas, productos, reseñas y filtros
 */

// ==========================================
// ENUMS Y CONSTANTES
// ==========================================

export type StoreCategory =
  | 'Electrónica'
  | 'Ropa'
  | 'Calzado'
  | 'Farmacia'
  | 'Supermercado'
  | 'Abarrotes'
  | 'Pulpería'
  | 'Ferretería'
  | 'Hogar'
  | 'Belleza'
  | 'Barbería'
  | 'Restaurante'
  | 'Comida Rápida'
  | 'Café'
  | 'Panadería'
  | 'Pastelería'
  | 'Librería'
  | 'Juguetería'
  | 'Mueblería'
  | 'Tecnología'
  | 'Accesorios'
  | 'Vehículos'
  | 'Repuestos'

export type StoreStatus =
  | 'activo'
  | 'cerrado'
  | 'cerrado_temporal'
  | 'suspendido'

export type ProductStatus = 'activo' | 'agotado' | 'pausado'

// Departamentos de Nicaragua
export const DEPARTMENTS = [
  'Managua',
  'León',
  'Granada',
  'Masaya',
  'Chinandega',
  'Matagalpa',
  'Estelí',
  'Jinotega',
  'Rivas',
  'Boaco',
  'Chontales',
  'Nueva Segovia',
  'Madriz',
  'Carazo',
  'Río San Juan',
  'RAAN',
  'RAAS',
] as const

export type Department = (typeof DEPARTMENTS)[number]

// ==========================================
// INTERFACES PRINCIPALES
// ==========================================

/** Horario de atención por día */
export interface Schedule {
  dia: string
  apertura: string
  cierre: string
  cerrado?: boolean
}

/** Configuración de delivery de la tienda */
export interface DeliveryConfig {
  habilitado: boolean
  costoBase?: number
  radioKm?: number
}

/** Coordenadas geográficas */
export interface Coordinates {
  lat: number
  lng: number
}

/** Tienda del marketplace */
export interface Store {
  id: string
  nombre: string
  slug: string
  categoria: StoreCategory
  departamento: Department
  direccion: string
  coordenadas: Coordinates
  telefono: string
  whatsapp?: string
  email?: string
  descripcion: string
  avatar: string
  banner?: string
  rating: number
  totalReviews: number
  estado: StoreStatus
  horarios: Schedule[]
  delivery: DeliveryConfig
  facturacion: boolean
  retiroEnTienda: boolean
  productosActivos: number
  ventasTotales: number
  clientes: number
  fechaCreacion: string
  verificada: boolean
  nueva?: boolean
}

/** Producto de una tienda */
export interface Product {
  id: string
  storeId: string
  nombre: string
  descripcion: string
  precio: number
  precioAnterior?: number
  categoria: string
  imagenes: string[]
  estado: ProductStatus
  rating: number
  totalReviews: number
  stock: number
  destacado?: boolean
}

/** Reseña de usuario */
export interface Review {
  id: string
  storeId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comentario: string
  fecha: string
  respuesta?: {
    texto: string
    fecha: string
  }
}

// ==========================================
// FILTROS Y BÚSQUEDA
// ==========================================

/** Filtros aplicables a la búsqueda de tiendas */
export interface StoreFilters {
  searchQuery: string
  categoria: StoreCategory | null
  departamento: Department | null
  minRating: number
  soloAbiertas: boolean
  conDelivery: boolean
  verificadas: boolean
}

/** Estado de los filtros por defecto */
export const DEFAULT_FILTERS: StoreFilters = {
  searchQuery: '',
  categoria: null,
  departamento: null,
  minRating: 0,
  soloAbiertas: false,
  conDelivery: false,
  verificadas: false,
}

// ==========================================
// UTILIDADES
// ==========================================

/** Colores por categoría para marcadores del mapa */
export const CATEGORY_COLORS: Record<StoreCategory, string> = {
  Electrónica: '#3B82F6',
  Ropa: '#EAB308',
  Calzado: '#A855F7',
  Farmacia: '#22C55E',
  Supermercado: '#EF4444',
  Abarrotes: '#F97316',
  Pulpería: '#84CC16',
  Ferretería: '#64748B',
  Hogar: '#EC4899',
  Belleza: '#F472B6',
  Barbería: '#06B6D4',
  Restaurante: '#F59E0B',
  'Comida Rápida': '#EF4444',
  Café: '#78350F',
  Panadería: '#FBBF24',
  Pastelería: '#FDE047',
  Librería: '#6366F1',
  Juguetería: '#EC4899',
  Mueblería: '#92400E',
  Tecnología: '#3B82F6',
  Accesorios: '#A855F7',
  Vehículos: '#1E40AF',
  Repuestos: '#475569',
}

/** Iconos de categoría (emoji) */
export const CATEGORY_ICONS: Record<StoreCategory, string> = {
  Electrónica: '📱',
  Ropa: '👕',
  Calzado: '👟',
  Farmacia: '💊',
  Supermercado: '🛒',
  Abarrotes: '🏪',
  Pulpería: '🏬',
  Ferretería: '🔨',
  Hogar: '🏠',
  Belleza: '💄',
  Barbería: '💈',
  Restaurante: '🍽️',
  'Comida Rápida': '🍔',
  Café: '☕',
  Panadería: '🍞',
  Pastelería: '🍰',
  Librería: '📚',
  Juguetería: '🧸',
  Mueblería: '🛋️',
  Tecnología: '💻',
  Accesorios: '👜',
  Vehículos: '🚗',
  Repuestos: '🔧',
}

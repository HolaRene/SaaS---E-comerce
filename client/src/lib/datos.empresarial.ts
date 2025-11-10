/**
 * Structured data for MiComercio Digital dashboard
 * Contains store information, metrics, and performance data
 */

export interface Store {
  id: number
  name: string
  region: string
}

export interface Metrics {
  dailySales: number
  weeklySales: number
  monthlySales: number
  growth: number
  alertCount: number
}

export interface StorePerformance {
  storeId: number
  storeName: string
  region: string
  sales: number
  growth: number
  orders: number
  status: "excellent" | "good" | "warning" | "critical"
}

export interface Alert {
  id: number
  storeId: number
  storeName: string
  type: "critical" | "warning" | "info"
  message: string
  timestamp: string
}

export interface DailySalesData {
  date: string
  sales: number
  orders: number
}

// Store data - 5 stores across different regions
export const stores: Store[] = [
  { id: 1, name: "Flagship Downtown", region: "Norte" },
  { id: 2, name: "Galería Mall", region: "Sur" },
  { id: 3, name: "Plaza Central", region: "Centro" },
  { id: 4, name: "Outlet Oeste", region: "Oeste" },
  { id: 5, name: "Shopping Este", region: "Este" },
]

// Consolidated metrics
export const metrics: Metrics = {
  dailySales: 154820,
  weeklySales: 892450,
  monthlySales: 3250000,
  growth: 12.3,
  alertCount: 3,
}

// Store performance data for top stores table
export const storePerformance: StorePerformance[] = [
  {
    storeId: 1,
    storeName: "Flagship Downtown",
    region: "Norte",
    sales: 892450,
    growth: 18.5,
    orders: 1243,
    status: "excellent",
  },
  {
    storeId: 2,
    storeName: "Galería Mall",
    region: "Sur",
    sales: 756320,
    growth: 15.2,
    orders: 1089,
    status: "excellent",
  },
  {
    storeId: 3,
    storeName: "Plaza Central",
    region: "Centro",
    sales: 645890,
    growth: 8.7,
    orders: 892,
    status: "good",
  },
  {
    storeId: 4,
    storeName: "Outlet Oeste",
    region: "Oeste",
    sales: 523670,
    growth: -3.2,
    orders: 756,
    status: "warning",
  },
  {
    storeId: 5,
    storeName: "Shopping Este",
    region: "Este",
    sales: 431120,
    growth: -8.5,
    orders: 623,
    status: "critical",
  },
]

// Daily sales data for the last 7 days
export const dailySalesData: DailySalesData[] = [
  { date: "2025-10-14", sales: 118500, orders: 892 },
  { date: "2025-10-15", sales: 125300, orders: 945 },
  { date: "2025-10-16", sales: 132800, orders: 1012 },
  { date: "2025-10-17", sales: 128900, orders: 978 },
  { date: "2025-10-18", sales: 142600, orders: 1089 },
  { date: "2025-10-19", sales: 149530, orders: 1134 },
  { date: "2025-10-20", sales: 154820, orders: 1178 },
]

// Alerts data
export const alerts: Alert[] = [
  {
    id: 1,
    storeId: 5,
    storeName: "Shopping Este",
    type: "critical",
    message: "Ventas 8.5% por debajo del objetivo mensual",
    timestamp: "2025-10-20T09:30:00",
  },
  {
    id: 2,
    storeId: 4,
    storeName: "Outlet Oeste",
    type: "warning",
    message: "Inventario bajo en categoría electrónica",
    timestamp: "2025-10-20T08:15:00",
  },
  {
    id: 3,
    storeId: 2,
    storeName: "Galería Mall",
    type: "info",
    message: "Nueva promoción generó 15% más tráfico",
    timestamp: "2025-10-20T07:00:00",
  },
]

// Comparative metrics for regional analysis
export const regionalMetrics = [
  { region: "Norte", sales: 892450, growth: 18.5, stores: 1 },
  { region: "Sur", sales: 756320, growth: 15.2, stores: 1 },
  { region: "Centro", sales: 645890, growth: 8.7, stores: 1 },
  { region: "Oeste", sales: 523670, growth: -3.2, stores: 1 },
  { region: "Este", sales: 431120, growth: -8.5, stores: 1 },
]

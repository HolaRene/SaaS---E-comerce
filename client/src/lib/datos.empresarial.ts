/**
 * Type definitions for MiComercio Digital dashboard
 * Contains interfaces for store information, metrics, and performance data
 * Mock data removed - now using real Convex queries
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
  storeId: string
  storeName: string
  region: string
  sales: number
  growth: number
  orders: number
  status: 'excellent' | 'good' | 'warning' | 'critical'
}

export interface Alert {
  id: string
  storeId: string
  storeName: string
  type: 'critical' | 'warning' | 'info'
  message: string
  timestamp: string
}

export interface DailySalesData {
  date: string
  sales: number
  orders: number
}

export interface RegionalMetric {
  region: string
  sales: number
  growth: number
  stores: number
}

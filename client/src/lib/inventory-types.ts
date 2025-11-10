export interface InventoryProduct {
  id: string
  sku: string
  name: string
  category: string
  totalStock: number
  inventoryValue: number
  stores: StoreStock[]
  turnoverRate: number
  lastMovement: Date
  status: "optimal" | "low" | "overstock" | "critical"
}

export interface StoreStock {
  storeId: string
  storeName: string
  quantity: number
  minStock: number
  maxStock: number
  lastRestock: Date
  turnover: number
  daysOfStock: number
}

export interface StockAlert {
  id: string
  productId: string
  productName: string
  storeId: string
  storeName: string
  type: "low_stock" | "overstock" | "no_movement" | "expiring"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  suggestedAction: string
  createdAt: Date
  resolved: boolean
}

export interface ConsolidatedInventory {
  totalProducts: number
  totalValue: number
  totalStock: number
  averageTurnover: number
  alerts: StockAlert[]
  products: InventoryProduct[]
  metrics: InventoryMetrics
}

export interface InventoryMetrics {
  stockDistribution: {
    storeId: string
    storeName: string
    totalStock: number
    value: number
  }[]
  categoryBreakdown: {
    category: string
    stock: number
    value: number
  }[]
  turnoverTrends: {
    date: string
    turnover: number
  }[]
}

export interface InventoryFilters {
  category?: string
  storeId?: string
  status?: string
  search?: string
}

export interface OptimizationStrategy {
  type: "balance" | "minimize_transfers" | "maximize_turnover"
  priority: "cost" | "speed" | "balanced"
}

export type PriorityLevel = "high" | "medium" | "low";

export interface RedistributionSuggestion {
  id: string
  productId: string
  productName: string
  fromStore: string
  toStore: string
  quantity: number
  reason: string
  priority: "low" | "medium" | "high"
  estimatedImpact: {
    costSavings: number
    turnoverImprovement: number
  }
}

export interface ActionState {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export interface SalesData {
  date: Date
  storeId: string
  storeName: string
  region: string
  totalSales: number
  transactions: number
  averageTicket: number
  growthRate: number
  seasonalIndex: number
  previousPeriodSales: number
}

export interface PerformanceMetrics {
  storeId: string
  storeName: string
  region: string
  salesTarget: number
  actualSales: number
  gap: number
  gapPercentage: number
  efficiency: number
  rank: number
  trend: "up" | "down" | "stable"
  trendPercentage: number
  transactions: number
  averageTicket: number
}

export interface CustomerBehavior {
  customerId: string
  customerName: string
  storesVisited: string[]
  totalSpent: number
  frequency: number
  lastPurchase: Date
  firstPurchase: Date
  segment: "high_value" | "medium_value" | "low_value" | "new"
  clv: number
  averageTicket: number
  preferredRegion: string
}

export interface RegionalMetrics {
  region: string
  totalSales: number
  storeCount: number
  averageSalesPerStore: number
  growthRate: number
  marketShare: number
  topProducts: string[]
}

export interface SeasonalPattern {
  month: string
  averageSales: number
  peakDay: string
  lowDay: string
  volatility: number
}

export interface ReportConfig {
  id: string
  name: string
  type: "sales" | "performance" | "customers" | "custom"
  dateRange: { from: Date; to: Date }
  stores: string[]
  metrics: string[]
  groupBy: "day" | "week" | "month" | "quarter"
  format: "table" | "chart" | "mixed"
  schedule?: {
    frequency: "daily" | "weekly" | "monthly"
    recipients: string[]
  }
}

export interface ExportConfig {
  format: "excel" | "csv" | "pdf"
  data: any[]
  fileName: string
  includeCharts: boolean
}

export interface SegmentationCriteria {
  minSpent?: number
  maxSpent?: number
  minFrequency?: number
  regions?: string[]
  dateRange?: { from: Date; to: Date }
}

export interface SegmentAnalysis {
  segments: {
    name: string
    count: number
    totalValue: number
    averageValue: number
    characteristics: string[]
  }[]
  recommendations: string[]
}

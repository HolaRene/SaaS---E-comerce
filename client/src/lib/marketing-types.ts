export type CampaignType = "global" | "group" | "store_specific"
export type CampaignStatus = "draft" | "active" | "paused" | "completed"
export type GroupType = "region" | "custom" | "performance"
export type AlertSeverity = "low" | "medium" | "high" | "critical"

export interface Campaign {
    id: string
    name: string
    type: CampaignType
    budget: number
    stores: string[]
    groups: string[]
    dateRange: { start: Date; end: Date }
    status: CampaignStatus
    description?: string
    metrics?: CampaignMetrics
    createdAt: Date
    updatedAt: Date
}

export interface CampaignMetrics {
    roi: number
    salesIncrease: number
    customerAcquisition: number
    totalRevenue: number
    totalCost: number
    storePerformance: Record<string, StorePerformance>
}

export interface StorePerformance {
    storeId: string
    storeName: string
    revenue: number
    cost: number
    roi: number
    salesIncrease: number
    customers: number
}

export interface StoreGroup {
    id: string
    name: string
    type: GroupType
    stores: string[]
    rules: GroupRule[]
    createdAt: Date
    description?: string
}

export interface GroupRule {
    field: "region" | "performance" | "size" | "custom"
    operator: "equals" | "contains" | "greater_than" | "less_than"
    value: string | number
}

export interface CalendarEvent {
    id: string
    campaignId: string
    title: string
    start: Date
    end: Date
    type: "campaign" | "reminder" | "deadline"
    priority: "low" | "medium" | "high"
    stores: string[]
}

export interface BudgetAllocation {
    storeId: string
    storeName: string
    allocated: number
    spent: number
    remaining: number
}

export interface CampaignFormState {
    success: boolean
    message: string
    errors?: Record<string, string[]>
    campaign?: Campaign
}

export interface PerformanceAnalysis {
    campaignId: string
    dateRange: { start: Date; end: Date }
    overallROI: number
    topStores: StorePerformance[]
    bottomStores: StorePerformance[]
    regionalBreakdown: RegionalPerformance[]
    productPerformance: ProductPerformance[]
}

export interface RegionalPerformance {
    region: string
    stores: number
    revenue: number
    roi: number
    salesIncrease: number
}

export interface ProductPerformance {
    productId: string
    productName: string
    campaigns: number
    revenue: number
    unitsSold: number
    avgDiscount: number
}

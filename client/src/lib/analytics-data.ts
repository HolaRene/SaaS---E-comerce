import type {
  SalesData,
  PerformanceMetrics,
  CustomerBehavior,
  RegionalMetrics,
  SeasonalPattern,
} from "./analytics-types"

// Generate mock sales data for the last 12 months
export function generateSalesData(): SalesData[] {
  const stores = [
    { id: "TDA-001", name: "Tienda Centro", region: "Norte" },
    { id: "TDA-002", name: "Tienda Plaza", region: "Sur" },
    { id: "TDA-003", name: "Tienda Mall", region: "Este" },
    { id: "TDA-004", name: "Tienda Outlet", region: "Oeste" },
    { id: "TDA-005", name: "Tienda Express", region: "Norte" },
  ]

  const data: SalesData[] = []
  const today = new Date()

  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    stores.forEach((store) => {
      const baseAmount = 50000 + Math.random() * 50000
      const seasonalFactor = 1 + Math.sin((date.getMonth() / 12) * Math.PI * 2) * 0.3
      const totalSales = baseAmount * seasonalFactor
      const transactions = Math.floor(100 + Math.random() * 200)
      const previousPeriodSales = totalSales * (0.85 + Math.random() * 0.3)

      data.push({
        date,
        storeId: store.id,
        storeName: store.name,
        region: store.region,
        totalSales: Math.round(totalSales),
        transactions,
        averageTicket: Math.round(totalSales / transactions),
        growthRate: ((totalSales - previousPeriodSales) / previousPeriodSales) * 100,
        seasonalIndex: seasonalFactor,
        previousPeriodSales: Math.round(previousPeriodSales),
      })
    })
  }

  return data
}

export function getPerformanceMetrics(): PerformanceMetrics[] {
  const stores = [
    { id: "TDA-001", name: "Tienda Centro", region: "Norte", target: 2500000 },
    { id: "TDA-002", name: "Tienda Plaza", region: "Sur", target: 2200000 },
    { id: "TDA-003", name: "Tienda Mall", region: "Este", target: 2800000 },
    { id: "TDA-004", name: "Tienda Outlet", region: "Oeste", target: 1800000 },
    { id: "TDA-005", name: "Tienda Express", region: "Norte", target: 2000000 },
  ]

  return stores
    .map((store, index) => {
      const actualSales = store.target * (0.85 + Math.random() * 0.3)
      const gap = actualSales - store.target
      const previousMonthSales = actualSales * (0.9 + Math.random() * 0.2)
      const trendPercentage =
        ((actualSales - previousMonthSales) / previousMonthSales) * 100

      // ✅ Convertimos el string a tipo literal con `as const`
      const trend =
        trendPercentage > 5
          ? ("up" as const)
          : trendPercentage < -5
          ? ("down" as const)
          : ("stable" as const)

      return {
        storeId: store.id,
        storeName: store.name,
        region: store.region,
        salesTarget: store.target,
        actualSales: Math.round(actualSales),
        gap: Math.round(gap),
        gapPercentage: (gap / store.target) * 100,
        efficiency: (actualSales / store.target) * 100,
        rank: index + 1,
        trend, // ✅ ahora es del tipo correcto
        trendPercentage,
        transactions: Math.floor(3000 + Math.random() * 2000),
        averageTicket: Math.round(
          actualSales / (3000 + Math.random() * 2000)
        ),
      }
    })
    .sort((a, b) => b.actualSales - a.actualSales)
    .map((item, index) => ({ ...item, rank: index + 1 }))
}
export function getCustomerBehavior(): CustomerBehavior[] {
  const customers: CustomerBehavior[] = []
  const stores = ["TDA-001", "TDA-002", "TDA-003", "TDA-004", "TDA-005"]
  const regions = ["Norte", "Sur", "Este", "Oeste"]

  for (let i = 0; i < 500; i++) {
    const storesVisited = stores.slice(0, Math.floor(1 + Math.random() * 3))
    const totalSpent = 5000 + Math.random() * 95000
    const frequency = Math.floor(1 + Math.random() * 50)
    const clv = totalSpent * (1 + frequency / 10)

    let segment: "high_value" | "medium_value" | "low_value" | "new"
    if (clv > 150000) segment = "high_value"
    else if (clv > 50000) segment = "medium_value"
    else if (frequency > 5) segment = "low_value"
    else segment = "new"

    const lastPurchase = new Date()
    lastPurchase.setDate(lastPurchase.getDate() - Math.floor(Math.random() * 90))

    const firstPurchase = new Date(lastPurchase)
    firstPurchase.setMonth(firstPurchase.getMonth() - Math.floor(1 + Math.random() * 24))

    customers.push({
      customerId: `CLI-${String(i + 1).padStart(5, "0")}`,
      customerName: `Cliente ${i + 1}`,
      storesVisited,
      totalSpent: Math.round(totalSpent),
      frequency,
      lastPurchase,
      firstPurchase,
      segment,
      clv: Math.round(clv),
      averageTicket: Math.round(totalSpent / frequency),
      preferredRegion: regions[Math.floor(Math.random() * regions.length)],
    })
  }

  return customers
}

export function getRegionalMetrics(): RegionalMetrics[] {
  return [
    {
      region: "Norte",
      totalSales: 4500000,
      storeCount: 2,
      averageSalesPerStore: 2250000,
      growthRate: 12.5,
      marketShare: 35,
      topProducts: ["Producto A", "Producto B", "Producto C"],
    },
    {
      region: "Sur",
      totalSales: 2200000,
      storeCount: 1,
      averageSalesPerStore: 2200000,
      growthRate: 8.3,
      marketShare: 18,
      topProducts: ["Producto D", "Producto E", "Producto F"],
    },
    {
      region: "Este",
      totalSales: 2800000,
      storeCount: 1,
      averageSalesPerStore: 2800000,
      growthRate: 15.7,
      marketShare: 22,
      topProducts: ["Producto G", "Producto H", "Producto I"],
    },
    {
      region: "Oeste",
      totalSales: 1800000,
      storeCount: 1,
      averageSalesPerStore: 1800000,
      growthRate: 5.2,
      marketShare: 15,
      topProducts: ["Producto J", "Producto K", "Producto L"],
    },
  ]
}

export function getSeasonalPatterns(): SeasonalPattern[] {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

  return months.map((month, index) => ({
    month,
    averageSales: 2000000 + Math.sin((index / 12) * Math.PI * 2) * 500000,
    peakDay: ["Viernes", "Sábado", "Domingo"][Math.floor(Math.random() * 3)],
    lowDay: ["Lunes", "Martes", "Miércoles"][Math.floor(Math.random() * 3)],
    volatility: 5 + Math.random() * 15,
  }))
}

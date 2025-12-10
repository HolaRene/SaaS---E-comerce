import type { InventoryProduct, StockAlert, ConsolidatedInventory } from "./inventory-types"

// Mock data para productos de inventario
export const mockInventoryProducts: InventoryProduct[] = [
  {
    id: "1",
    sku: "PROD-001",
    name: "Laptop Dell XPS 15",
    category: "Electrónica",
    totalStock: 45,
    inventoryValue: 67500,
    turnoverRate: 8.5,
    lastMovement: new Date("2025-01-20"),
    status: "optimal",
    stores: [
      {
        storeId: "1",
        storeName: "Tienda Centro",
        quantity: 15,
        minStock: 10,
        maxStock: 25,
        lastRestock: new Date("2025-01-15"),
        turnover: 9.2,
        daysOfStock: 12,
      },
      {
        storeId: "2",
        storeName: "Tienda Norte",
        quantity: 20,
        minStock: 15,
        maxStock: 30,
        lastRestock: new Date("2025-01-18"),
        turnover: 8.1,
        daysOfStock: 15,
      },
      {
        storeId: "3",
        storeName: "Tienda Sur",
        quantity: 10,
        minStock: 8,
        maxStock: 20,
        lastRestock: new Date("2025-01-10"),
        turnover: 8.3,
        daysOfStock: 14,
      },
    ],
  },
  {
    id: "2",
    sku: "PROD-002",
    name: "iPhone 15 Pro",
    category: "Electrónica",
    totalStock: 8,
    inventoryValue: 12000,
    turnoverRate: 12.3,
    lastMovement: new Date("2025-01-22"),
    status: "critical",
    stores: [
      {
        storeId: "1",
        storeName: "Tienda Centro",
        quantity: 3,
        minStock: 10,
        maxStock: 25,
        lastRestock: new Date("2025-01-05"),
        turnover: 13.1,
        daysOfStock: 3,
      },
      {
        storeId: "2",
        storeName: "Tienda Norte",
        quantity: 5,
        minStock: 12,
        maxStock: 30,
        lastRestock: new Date("2025-01-08"),
        turnover: 11.8,
        daysOfStock: 5,
      },
      {
        storeId: "3",
        storeName: "Tienda Sur",
        quantity: 0,
        minStock: 8,
        maxStock: 20,
        lastRestock: new Date("2024-12-28"),
        turnover: 12.0,
        daysOfStock: 0,
      },
    ],
  },
  {
    id: "3",
    sku: "PROD-003",
    name: "Samsung Galaxy S24",
    category: "Electrónica",
    totalStock: 62,
    inventoryValue: 49600,
    turnoverRate: 6.8,
    lastMovement: new Date("2025-01-21"),
    status: "optimal",
    stores: [
      {
        storeId: "1",
        storeName: "Tienda Centro",
        quantity: 22,
        minStock: 15,
        maxStock: 30,
        lastRestock: new Date("2025-01-16"),
        turnover: 7.2,
        daysOfStock: 18,
      },
      {
        storeId: "2",
        storeName: "Tienda Norte",
        quantity: 25,
        minStock: 18,
        maxStock: 35,
        lastRestock: new Date("2025-01-19"),
        turnover: 6.5,
        daysOfStock: 20,
      },
      {
        storeId: "3",
        storeName: "Tienda Sur",
        quantity: 15,
        minStock: 12,
        maxStock: 25,
        lastRestock: new Date("2025-01-14"),
        turnover: 6.7,
        daysOfStock: 19,
      },
    ],
  },
  {
    id: "4",
    sku: "PROD-004",
    name: "MacBook Air M3",
    category: "Electrónica",
    totalStock: 95,
    inventoryValue: 118750,
    turnoverRate: 3.2,
    lastMovement: new Date("2024-12-15"),
    status: "overstock",
    stores: [
      {
        storeId: "1",
        storeName: "Tienda Centro",
        quantity: 35,
        minStock: 10,
        maxStock: 20,
        lastRestock: new Date("2024-11-20"),
        turnover: 2.8,
        daysOfStock: 45,
      },
      {
        storeId: "2",
        storeName: "Tienda Norte",
        quantity: 40,
        minStock: 12,
        maxStock: 25,
        lastRestock: new Date("2024-11-25"),
        turnover: 3.1,
        daysOfStock: 42,
      },
      {
        storeId: "3",
        storeName: "Tienda Sur",
        quantity: 20,
        minStock: 8,
        maxStock: 18,
        lastRestock: new Date("2024-11-18"),
        turnover: 3.8,
        daysOfStock: 38,
      },
    ],
  },
  {
    id: "5",
    sku: "PROD-005",
    name: 'iPad Pro 12.9"',
    category: "Electrónica",
    totalStock: 28,
    inventoryValue: 33600,
    turnoverRate: 7.5,
    lastMovement: new Date("2025-01-19"),
    status: "optimal",
    stores: [
      {
        storeId: "1",
        storeName: "Tienda Centro",
        quantity: 10,
        minStock: 8,
        maxStock: 18,
        lastRestock: new Date("2025-01-12"),
        turnover: 8.1,
        daysOfStock: 14,
      },
      {
        storeId: "2",
        storeName: "Tienda Norte",
        quantity: 12,
        minStock: 10,
        maxStock: 22,
        lastRestock: new Date("2025-01-15"),
        turnover: 7.3,
        daysOfStock: 16,
      },
      {
        storeId: "3",
        storeName: "Tienda Sur",
        quantity: 6,
        minStock: 6,
        maxStock: 15,
        lastRestock: new Date("2025-01-10"),
        turnover: 7.1,
        daysOfStock: 17,
      },
    ],
  },
  {
    id: "6",
    sku: "PROD-006",
    name: "Sony WH-1000XM5",
    category: "Audio",
    totalStock: 5,
    inventoryValue: 1750,
    turnoverRate: 9.8,
    lastMovement: new Date("2025-01-23"),
    status: "low",
    stores: [
      {
        storeId: "1",
        storeName: "Tienda Centro",
        quantity: 2,
        minStock: 8,
        maxStock: 20,
        lastRestock: new Date("2025-01-01"),
        turnover: 10.2,
        daysOfStock: 4,
      },
      {
        storeId: "2",
        storeName: "Tienda Norte",
        quantity: 3,
        minStock: 10,
        maxStock: 25,
        lastRestock: new Date("2025-01-03"),
        turnover: 9.5,
        daysOfStock: 5,
      },
      {
        storeId: "3",
        storeName: "Tienda Sur",
        quantity: 0,
        minStock: 6,
        maxStock: 15,
        lastRestock: new Date("2024-12-20"),
        turnover: 9.7,
        daysOfStock: 0,
      },
    ],
  },
]

export const mockStockAlerts: StockAlert[] = [
  {
    id: "alert-1",
    productId: "2",
    productName: "iPhone 15 Pro",
    storeId: "3",
    storeName: "Tienda Sur",
    type: "low_stock",
    severity: "critical",
    message: "Stock agotado - Producto de alta rotación",
    suggestedAction: "Transferir 10 unidades desde Tienda Norte o realizar pedido urgente",
    createdAt: new Date("2025-01-23"),
    resolved: false,
  },
  {
    id: "alert-2",
    productId: "2",
    productName: "iPhone 15 Pro",
    storeId: "1",
    storeName: "Tienda Centro",
    type: "low_stock",
    severity: "high",
    message: "Stock crítico - Por debajo del mínimo",
    suggestedAction: "Transferir 7 unidades desde Tienda Norte",
    createdAt: new Date("2025-01-23"),
    resolved: false,
  },
  {
    id: "alert-3",
    productId: "6",
    productName: "Sony WH-1000XM5",
    storeId: "3",
    storeName: "Tienda Sur",
    type: "low_stock",
    severity: "high",
    message: "Stock agotado - Producto popular",
    suggestedAction: "Transferir 6 unidades desde Tienda Norte",
    createdAt: new Date("2025-01-23"),
    resolved: false,
  },
  {
    id: "alert-4",
    productId: "6",
    productName: "Sony WH-1000XM5",
    storeId: "1",
    storeName: "Tienda Centro",
    type: "low_stock",
    severity: "medium",
    message: "Stock bajo - Por debajo del mínimo",
    suggestedAction: "Reabastecer 6 unidades",
    createdAt: new Date("2025-01-22"),
    resolved: false,
  },
  {
    id: "alert-5",
    productId: "4",
    productName: "MacBook Air M3",
    storeId: "1",
    storeName: "Tienda Centro",
    type: "overstock",
    severity: "medium",
    message: "Sobrestock - 175% por encima del máximo",
    suggestedAction: "Transferir 15 unidades a otras tiendas o promocionar",
    createdAt: new Date("2025-01-20"),
    resolved: false,
  },
  {
    id: "alert-6",
    productId: "4",
    productName: "MacBook Air M3",
    storeId: "2",
    storeName: "Tienda Norte",
    type: "no_movement",
    severity: "low",
    message: "Sin movimiento en 40 días",
    suggestedAction: "Considerar promoción o redistribución",
    createdAt: new Date("2025-01-18"),
    resolved: false,
  },
]

export function getConsolidatedInventoryData(): ConsolidatedInventory {
  const totalProducts = mockInventoryProducts.length
  const totalValue = mockInventoryProducts.reduce((sum, p) => sum + p.inventoryValue, 0)
  const totalStock = mockInventoryProducts.reduce((sum, p) => sum + p.totalStock, 0)
  const averageTurnover = mockInventoryProducts.reduce((sum, p) => sum + p.turnoverRate, 0) / totalProducts

  // Stock distribution by store
  const storeMap = new Map<string, { name: string; stock: number; value: number }>()
  mockInventoryProducts.forEach((product) => {
    product.stores.forEach((store) => {
      const existing = storeMap.get(store.storeId) || { name: store.storeName, stock: 0, value: 0 }
      existing.stock += store.quantity
      existing.value += (product.inventoryValue / product.totalStock) * store.quantity
      storeMap.set(store.storeId, existing)
    })
  })

  const stockDistribution = Array.from(storeMap.entries()).map(([storeId, data]) => ({
    storeId,
    storeName: data.name,
    totalStock: data.stock,
    value: Math.round(data.value),
  }))

  // Category breakdown
  const categoryMap = new Map<string, { stock: number; value: number }>()
  mockInventoryProducts.forEach((product) => {
    const existing = categoryMap.get(product.category) || { stock: 0, value: 0 }
    existing.stock += product.totalStock
    existing.value += product.inventoryValue
    categoryMap.set(product.category, existing)
  })

  const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    stock: data.stock,
    value: data.value,
  }))

  // Turnover trends (mock data for last 7 days)
  const turnoverTrends = [
    { date: "2025-01-17", turnover: 7.2 },
    { date: "2025-01-18", turnover: 7.5 },
    { date: "2025-01-19", turnover: 7.8 },
    { date: "2025-01-20", turnover: 7.4 },
    { date: "2025-01-21", turnover: 7.9 },
    { date: "2025-01-22", turnover: 8.1 },
    { date: "2025-01-23", turnover: 7.6 },
  ]

  return {
    totalProducts,
    totalValue,
    totalStock,
    averageTurnover,
    alerts: mockStockAlerts.filter((a) => !a.resolved),
    products: mockInventoryProducts,
    metrics: {
      stockDistribution,
      categoryBreakdown,
      turnoverTrends,
    },
  }
}

import type { Campaign, StoreGroup, CalendarEvent } from "./marketing-types"

// Mock campaigns data
export const campaigns: Campaign[] = [
  {
    id: "camp-001",
    name: "Black Friday 2024",
    type: "global",
    budget: 500000,
    stores: ["store-001", "store-002", "store-003", "store-004", "store-005"],
    groups: ["group-001"],
    dateRange: {
      start: new Date("2024-11-25"),
      end: new Date("2024-11-29"),
    },
    status: "active",
    description: "Campaña global de Black Friday con descuentos del 30-50%",
    metrics: {
      roi: 3.2,
      salesIncrease: 145,
      customerAcquisition: 2340,
      totalRevenue: 1600000,
      totalCost: 500000,
      storePerformance: {
        "store-001": {
          storeId: "store-001",
          storeName: "Tienda Centro",
          revenue: 450000,
          cost: 140000,
          roi: 3.2,
          salesIncrease: 156,
          customers: 890,
        },
        "store-002": {
          storeId: "store-002",
          storeName: "Tienda Norte",
          revenue: 380000,
          cost: 120000,
          roi: 3.2,
          salesIncrease: 142,
          customers: 720,
        },
      },
    },
    createdAt: new Date("2024-10-15"),
    updatedAt: new Date("2024-11-20"),
  },
  {
    id: "camp-002",
    name: "Cyber Monday Tech",
    type: "group",
    budget: 200000,
    stores: ["store-001", "store-003"],
    groups: ["group-002"],
    dateRange: {
      start: new Date("2024-12-02"),
      end: new Date("2024-12-02"),
    },
    status: "draft",
    description: "Promoción especial en productos tecnológicos",
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-15"),
  },
  {
    id: "camp-003",
    name: "Navidad Premium",
    type: "global",
    budget: 750000,
    stores: ["store-001", "store-002", "store-003", "store-004", "store-005", "store-006"],
    groups: ["group-001", "group-003"],
    dateRange: {
      start: new Date("2024-12-15"),
      end: new Date("2024-12-24"),
    },
    status: "draft",
    description: "Campaña navideña con regalos y descuentos especiales",
    createdAt: new Date("2024-11-10"),
    updatedAt: new Date("2024-11-18"),
  },
]

// Mock store groups
export const storeGroups: StoreGroup[] = [
  {
    id: "group-001",
    name: "Tiendas Premium",
    type: "performance",
    stores: ["store-001", "store-002", "store-003"],
    rules: [{ field: "performance", operator: "greater_than", value: 80 }],
    description: "Tiendas con mejor performance de ventas",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "group-002",
    name: "Región Norte",
    type: "region",
    stores: ["store-002", "store-004", "store-006"],
    rules: [{ field: "region", operator: "equals", value: "Norte" }],
    description: "Todas las tiendas de la región norte",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "group-003",
    name: "Tiendas Grandes",
    type: "region",
    stores: ["store-001", "store-003", "store-005"],
    rules: [{ field: "size", operator: "greater_than", value: 500 }],
    description: "Tiendas con más de 500m² de superficie",
    createdAt: new Date("2024-03-10"),
  },
]

// Mock calendar events
export const calendarEvents: CalendarEvent[] = [
  {
    id: "event-001",
    campaignId: "camp-001",
    title: "Black Friday 2024",
    start: new Date("2024-11-25"),
    end: new Date("2024-11-29"),
    type: "campaign",
    priority: "high",
    stores: ["store-001", "store-002", "store-003", "store-004", "store-005"],
  },
  {
    id: "event-002",
    campaignId: "camp-002",
    title: "Cyber Monday Tech",
    start: new Date("2024-12-02"),
    end: new Date("2024-12-02"),
    type: "campaign",
    priority: "medium",
    stores: ["store-001", "store-003"],
  },
  {
    id: "event-003",
    campaignId: "camp-003",
    title: "Navidad Premium",
    start: new Date("2024-12-15"),
    end: new Date("2024-12-24"),
    type: "campaign",
    priority: "high",
    stores: ["store-001", "store-002", "store-003", "store-004", "store-005", "store-006"],
  },
  {
    id: "event-004",
    campaignId: "camp-001",
    title: "Recordatorio: Preparar inventario Black Friday",
    start: new Date("2024-11-20"),
    end: new Date("2024-11-20"),
    type: "reminder",
    priority: "high",
    stores: ["store-001", "store-002", "store-003", "store-004", "store-005"],
  },
]

// Helper functions
export function getCampaignById(id: string): Campaign | undefined {
  return campaigns.find((c) => c.id === id)
}

export function getGroupById(id: string): StoreGroup | undefined {
  return storeGroups.find((g) => g.id === id)
}

export function getCampaignsByStatus(status: Campaign["status"]): Campaign[] {
  return campaigns.filter((c) => c.status === status)
}

export function getEventsByCampaign(campaignId: string): CalendarEvent[] {
  return calendarEvents.filter((e) => e.campaignId === campaignId)
}

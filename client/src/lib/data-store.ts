export interface Store {
  id: number
  name: string
  region: string
  status: "active" | "inactive" | "maintenance"
  sales: number
  employees: number
  lastUpdated: string
  address?: string
  phone?: string
  email?: string
  manager?: string
  hours?: string
  categories?: string[]
}

export const regions = ["Norte", "Sur", "Este", "Oeste", "Centro"]
export const statusOptions = ["active", "inactive", "maintenance"] as const
export const storeTemplates = ["Retail Standard", "Premium Store", "Outlet Model"]

// Predefined stores data
export const stores: Store[] = [
  {
    id: 1,
    name: "Flagship Downtown",
    region: "Norte",
    status: "active",
    sales: 154820,
    employees: 12,
    lastUpdated: "2024-01-15",
    address: "Av. Principal 123",
    phone: "+1 234-567-8901",
    email: "downtown@micomercio.com",
    manager: "Ana García",
    hours: "9:00 - 21:00",
    categories: ["Electrónica", "Ropa", "Hogar"],
  },
  {
    id: 2,
    name: "Mall Plaza Store",
    region: "Sur",
    status: "active",
    sales: 98450,
    employees: 8,
    lastUpdated: "2024-01-14",
    address: "Centro Comercial Plaza, Local 45",
    phone: "+1 234-567-8902",
    email: "plaza@micomercio.com",
    manager: "Carlos Ruiz",
    hours: "10:00 - 22:00",
    categories: ["Ropa", "Accesorios"],
  },
  {
    id: 3,
    name: "Outlet Center",
    region: "Este",
    status: "maintenance",
    sales: 67230,
    employees: 6,
    lastUpdated: "2024-01-13",
    address: "Zona Industrial Este, Bodega 12",
    phone: "+1 234-567-8903",
    email: "outlet@micomercio.com",
    manager: "María López",
    hours: "9:00 - 18:00",
    categories: ["Outlet", "Liquidación"],
  },
  {
    id: 4,
    name: "Premium Boutique",
    region: "Oeste",
    status: "active",
    sales: 203450,
    employees: 15,
    lastUpdated: "2024-01-15",
    address: "Distrito Financiero, Torre A",
    phone: "+1 234-567-8904",
    email: "premium@micomercio.com",
    manager: "Roberto Sánchez",
    hours: "10:00 - 20:00",
    categories: ["Premium", "Lujo", "Exclusivo"],
  },
  {
    id: 5,
    name: "Neighborhood Market",
    region: "Centro",
    status: "active",
    sales: 45670,
    employees: 5,
    lastUpdated: "2024-01-14",
    address: "Calle Comercio 456",
    phone: "+1 234-567-8905",
    email: "market@micomercio.com",
    manager: "Laura Martínez",
    hours: "8:00 - 20:00",
    categories: ["Alimentación", "Básicos"],
  },
  {
    id: 6,
    name: "Tech Hub Store",
    region: "Norte",
    status: "active",
    sales: 187920,
    employees: 10,
    lastUpdated: "2024-01-15",
    address: "Parque Tecnológico, Edificio 3",
    phone: "+1 234-567-8906",
    email: "tech@micomercio.com",
    manager: "Diego Torres",
    hours: "9:00 - 21:00",
    categories: ["Electrónica", "Tecnología", "Gaming"],
  },
  {
    id: 7,
    name: "Express Store",
    region: "Sur",
    status: "inactive",
    sales: 23450,
    employees: 3,
    lastUpdated: "2024-01-10",
    address: "Estación Central, Local 8",
    phone: "+1 234-567-8907",
    email: "express@micomercio.com",
    manager: "Patricia Vega",
    hours: "7:00 - 23:00",
    categories: ["Conveniencia", "Express"],
  },
  {
    id: 8,
    name: "Family Megastore",
    region: "Este",
    status: "active",
    sales: 134560,
    employees: 18,
    lastUpdated: "2024-01-15",
    address: "Av. Familias 789",
    phone: "+1 234-567-8908",
    email: "family@micomercio.com",
    manager: "Fernando Díaz",
    hours: "9:00 - 22:00",
    categories: ["Familia", "Juguetes", "Ropa", "Hogar"],
  },
]

// Status labels and colors
export const statusConfig = {
  active: { label: "Activo", color: "bg-green-500" },
  inactive: { label: "Inactivo", color: "bg-gray-500" },
  maintenance: { label: "Mantenimiento", color: "bg-yellow-500" },
}

// Interfaces TypeScript para el sistema de usuarios
export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  stores: string[]
  status: UserStatus
  lastAccess: string
  avatar?: string
  phone?: string
  createdAt: string
}

export type UserRole = "super_admin" | "regional_manager" | "store_manager" | "employee"
export type UserStatus = "active" | "inactive" | "pending" | "suspended"

export interface Role {
  id: string
  name: string
  description: string
  type: "predefined" | "custom"
  permissions: Record<string, Permission[]>
  usersCount: number
  createdAt: string
  updatedAt: string
  createdBy?: string
}

export type Permission = "view" | "create" | "read" | "update" | "delete" | "export" | "generate"

export interface PermissionModule {
  id: string
  name: string
  description: string
  permissions: Permission[]
}

export interface RoleHistory {
  id: number
  roleId: string
  action: "created" | "updated" | "deleted"
  changes: string
  timestamp: string
  userId: number
  userName: string
}

// Datos mock de usuarios
export const users: User[] = [
  {
    id: 1,
    name: "María González",
    email: "maria.gonzalez@empresa.com",
    role: "store_manager",
    stores: ["Flagship Downtown", "Galería Mall"],
    status: "active",
    lastAccess: "2024-01-20T14:30:00Z",
    avatar: "/diverse-woman-portrait.png",
    phone: "+34 612 345 678",
    createdAt: "2023-06-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@empresa.com",
    role: "regional_manager",
    stores: ["Flagship Downtown", "Galería Mall", "Centro Comercial Este", "Plaza Oeste"],
    status: "active",
    lastAccess: "2024-01-20T16:45:00Z",
    avatar: "/man.jpg",
    phone: "+34 623 456 789",
    createdAt: "2023-03-10T09:00:00Z",
  },
  {
    id: 3,
    name: "Ana Martínez",
    email: "ana.martinez@empresa.com",
    role: "employee",
    stores: ["Centro Comercial Este"],
    status: "active",
    lastAccess: "2024-01-20T13:20:00Z",
    avatar: "/professional-woman.png",
    phone: "+34 634 567 890",
    createdAt: "2023-09-01T08:00:00Z",
  },
  {
    id: 4,
    name: "Luis Fernández",
    email: "luis.fernandez@empresa.com",
    role: "super_admin",
    stores: ["Flagship Downtown", "Galería Mall", "Centro Comercial Este", "Plaza Oeste"],
    status: "active",
    lastAccess: "2024-01-20T17:00:00Z",
    avatar: "/man-executive.jpg",
    phone: "+34 645 678 901",
    createdAt: "2023-01-05T07:00:00Z",
  },
  {
    id: 5,
    name: "Elena Torres",
    email: "elena.torres@empresa.com",
    role: "store_manager",
    stores: ["Plaza Oeste"],
    status: "inactive",
    lastAccess: "2024-01-15T10:30:00Z",
    avatar: "/woman-manager.jpg",
    phone: "+34 656 789 012",
    createdAt: "2023-07-20T11:00:00Z",
  },
  {
    id: 6,
    name: "Pedro Sánchez",
    email: "pedro.sanchez@empresa.com",
    role: "employee",
    stores: ["Galería Mall"],
    status: "pending",
    lastAccess: "2024-01-18T09:15:00Z",
    avatar: "/man-young.jpg",
    phone: "+34 667 890 123",
    createdAt: "2024-01-10T14:00:00Z",
  },
]

// Módulos de permisos disponibles
export const permissionModules: PermissionModule[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Acceso al panel principal y métricas",
    permissions: ["view", "export"],
  },
  {
    id: "stores",
    name: "Tiendas",
    description: "Gestión de tiendas y configuración",
    permissions: ["create", "read", "update", "delete"],
  },
  {
    id: "users",
    name: "Usuarios",
    description: "Administración de usuarios y permisos",
    permissions: ["read", "update", "delete"],
  },
  {
    id: "reports",
    name: "Reportes",
    description: "Generación y exportación de reportes",
    permissions: ["view", "generate", "export"],
  },
  {
    id: "inventory",
    name: "Inventario",
    description: "Control de stock y productos",
    permissions: ["view", "create", "update", "delete"],
  },
  {
    id: "sales",
    name: "Ventas",
    description: "Registro y seguimiento de ventas",
    permissions: ["view", "create", "update"],
  },
]

// Roles predefinidos con permisos
export const roles: Role[] = [
  {
    id: "super_admin",
    name: "Super Admin",
    description: "Acceso completo a todas las funcionalidades del sistema",
    type: "predefined",
    permissions: {
      dashboard: ["view", "export"],
      stores: ["create", "read", "update", "delete"],
      users: ["read", "update", "delete"],
      reports: ["view", "generate", "export"],
      inventory: ["view", "create", "update", "delete"],
      sales: ["view", "create", "update"],
    },
    usersCount: 1,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "regional_manager",
    name: "Gerente Regional",
    description: "Gestión de múltiples tiendas y supervisión de equipos",
    type: "predefined",
    permissions: {
      dashboard: ["view", "export"],
      stores: ["read", "update"],
      users: ["read", "update"],
      reports: ["view", "generate", "export"],
      inventory: ["view", "update"],
      sales: ["view", "create", "update"],
    },
    usersCount: 1,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "store_manager",
    name: "Administrador de Tienda",
    description: "Gestión completa de una o más tiendas asignadas",
    type: "predefined",
    permissions: {
      dashboard: ["view"],
      stores: ["read", "update"],
      users: ["read"],
      reports: ["view", "generate"],
      inventory: ["view", "create", "update"],
      sales: ["view", "create", "update"],
    },
    usersCount: 2,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "employee",
    name: "Empleado",
    description: "Acceso básico para operaciones diarias",
    type: "predefined",
    permissions: {
      dashboard: ["view"],
      stores: ["read"],
      users: [],
      reports: ["view"],
      inventory: ["view"],
      sales: ["view", "create"],
    },
    usersCount: 2,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "custom_analyst",
    name: "Analista de Datos",
    description: "Rol personalizado para análisis y reportes",
    type: "custom",
    permissions: {
      dashboard: ["view", "export"],
      stores: ["read"],
      users: [],
      reports: ["view", "generate", "export"],
      inventory: ["view"],
      sales: ["view"],
    },
    usersCount: 0,
    createdAt: "2023-08-15T10:00:00Z",
    updatedAt: "2023-08-15T10:00:00Z",
    createdBy: "Luis Fernández",
  },
]

// Historial de cambios en roles
export const roleHistory: RoleHistory[] = [
  {
    id: 1,
    roleId: "custom_analyst",
    action: "created",
    changes: "Rol personalizado creado con permisos de análisis",
    timestamp: "2023-08-15T10:00:00Z",
    userId: 4,
    userName: "Luis Fernández",
  },
  {
    id: 2,
    roleId: "store_manager",
    action: "updated",
    changes: "Agregado permiso de exportación de reportes",
    timestamp: "2023-09-20T14:30:00Z",
    userId: 4,
    userName: "Luis Fernández",
  },
  {
    id: 3,
    roleId: "regional_manager",
    action: "updated",
    changes: "Actualizado permiso de gestión de usuarios",
    timestamp: "2023-11-10T09:15:00Z",
    userId: 4,
    userName: "Luis Fernández",
  },
]

// Tiendas disponibles para asignación
export const availableStores = ["Flagship Downtown", "Galería Mall", "Centro Comercial Este", "Plaza Oeste"]

// Utilidades para formateo
export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    super_admin: "Super Admin",
    regional_manager: "Gerente Regional",
    store_manager: "Admin. Tienda",
    employee: "Empleado",
  }
  return labels[role]
}

export const getStatusColor = (status: UserStatus): string => {
  const colors: Record<UserStatus, string> = {
    active: "bg-green-500",
    inactive: "bg-gray-400",
    pending: "bg-yellow-500",
    suspended: "bg-red-500",
  }
  return colors[status]
}

export const getStatusLabel = (status: UserStatus): string => {
  const labels: Record<UserStatus, string> = {
    active: "Activo",
    inactive: "Inactivo",
    pending: "Pendiente",
    suspended: "Suspendido",
  }
  return labels[status]
}

export const getPermissionLabel = (permission: Permission): string => {
  const labels: Record<Permission, string> = {
    view: "Ver",
    create: "Crear",
    read: "Leer",
    update: "Actualizar",
    delete: "Eliminar",
    export: "Exportar",
    generate: "Generar",
  }
  return labels[permission]
}

// Función para calcular tiempo desde último acceso
export const getLastAccessLabel = (lastAccess: string): string => {
  const now = new Date()
  const accessDate = new Date(lastAccess)
  const diffMs = now.getTime() - accessDate.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours}h`
  return `Hace ${diffDays}d`
}

"use server"

import { revalidatePath } from "next/cache"
import type { ActionState, InventoryFilters, OptimizationStrategy, PriorityLevel } from "@/lib/inventory-types"
import { getConsolidatedInventoryData, mockInventoryProducts, mockStockAlerts } from "@/lib/data-inventory"

// Server Action: Get consolidated inventory with filters
export async function getConsolidatedInventory(filters: InventoryFilters) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const data = getConsolidatedInventoryData()

  // Apply filters
  let filteredProducts = data.products

  if (filters.category) {
    filteredProducts = filteredProducts.filter((p) => p.category === filters.category)
  }

  if (filters.status) {
    filteredProducts = filteredProducts.filter((p) => p.status === filters.status)
  }

  if (filters.search) {
    const search = filters.search.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (p) => p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search),
    )
  }

  if (filters.storeId) {
    filteredProducts = filteredProducts.filter((p) => p.stores.some((s) => s.storeId === filters.storeId))
  }

  return {
    ...data,
    products: filteredProducts,
  }
}

// Server Action: Get product stock details
export async function getProductStock(sku: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const product = mockInventoryProducts.find((p) => p.sku === sku)
  if (!product) {
    throw new Error("Producto no encontrado")
  }

  return product
}

// Server Action: Update stock levels with useActionState
export async function updateStockLevels(prevState: ActionState, formData: FormData): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const productId = formData.get("productId") as string
  const storeId = formData.get("storeId") as string
  const quantity = Number.parseInt(formData.get("quantity") as string)

  // Validation
  if (!productId || !storeId || isNaN(quantity)) {
    return {
      success: false,
      message: "Datos inválidos",
      errors: {
        form: ["Por favor complete todos los campos correctamente"],
      },
    }
  }

  if (quantity < 0) {
    return {
      success: false,
      message: "La cantidad no puede ser negativa",
      errors: {
        quantity: ["La cantidad debe ser mayor o igual a 0"],
      },
    }
  }

  // Simulate update
  console.log("[v0] Updating stock:", { productId, storeId, quantity })

  revalidatePath("/inventory")

  return {
    success: true,
    message: `Stock actualizado exitosamente a ${quantity} unidades`,
  }
}

// Server Action: Resolve alert
export async function resolveAlert(alertId: string): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const alert = mockStockAlerts.find((a) => a.id === alertId)
  if (!alert) {
    return {
      success: false,
      message: "Alerta no encontrada",
    }
  }

  alert.resolved = true
  revalidatePath("/inventory")

  return {
    success: true,
    message: "Alerta resuelta exitosamente",
  }
}

// Server Action: Calculate redistribution suggestions
export async function calculateRedistribution(productIds: string[], strategy: OptimizationStrategy) {
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // Simulate optimization algorithm
  const suggestions = productIds.flatMap((productId) => {
    const product = mockInventoryProducts.find((p) => p.id === productId)
    if (!product) return []

    // Find overstock and understock stores
    const overstocked = product.stores.filter((s) => s.quantity > s.maxStock)
    const understocked = product.stores.filter((s) => s.quantity < s.minStock)

    return overstocked.flatMap((from) =>
      understocked.map((to) => ({
        id: `suggestion-${productId}-${from.storeId}-${to.storeId}`,
        productId: product.id,
        productName: product.name,
        fromStore: from.storeName,
        toStore: to.storeName,
        quantity: Math.min(from.quantity - from.maxStock, to.minStock - to.quantity),
        reason: `Balancear stock entre tiendas`,
        priority: (to.quantity === 0 ? "high" : "medium") as PriorityLevel,
        estimatedImpact: {
          costSavings: 150,
          turnoverImprovement: 1.2,
        },
      })),
    )
  })

  return suggestions
}

// Server Action: Execute auto redistribution
export async function executeAutoRedistribution(suggestionIds: string[]): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  console.log("[v0] Executing redistribution for:", suggestionIds)

  revalidatePath("/inventory")

  return {
    success: true,
    message: `${suggestionIds.length} transferencias programadas exitosamente`,
  }
}

// Server Action: Refresh inventory data (on-demand revalidation)
export async function refreshInventoryData() {
  revalidatePath("/inventory")
  return { success: true }
}

"use server"

import { revalidatePath } from "next/cache"
import type { CampaignFormState, Campaign, StoreGroup, PerformanceAnalysis } from "@/lib/marketing-types"
import { campaigns, storeGroups } from "@/lib/data-marketing"

// Campaign Actions
export async function createCampaign(prevState: CampaignFormState, formData: FormData): Promise<CampaignFormState> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const name = formData.get("name") as string
    const type = formData.get("type") as Campaign["type"]
    const budget = Number.parseFloat(formData.get("budget") as string)
    const startDate = formData.get("startDate") as string
    const endDate = formData.get("endDate") as string
    const description = formData.get("description") as string

    // Validation
    if (!name || name.length < 3) {
      return {
        success: false,
        message: "El nombre debe tener al menos 3 caracteres",
        errors: { name: ["Nombre muy corto"] },
      }
    }

    if (!budget || budget < 1000) {
      return {
        success: false,
        message: "El presupuesto mínimo es $1,000",
        errors: { budget: ["Presupuesto insuficiente"] },
      }
    }

    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      name,
      type,
      budget,
      stores: [],
      groups: [],
      dateRange: {
        start: new Date(startDate),
        end: new Date(endDate),
      },
      status: "draft",
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    campaigns.push(newCampaign)
    revalidatePath("/marketing")

    return {
      success: true,
      message: "Campaña creada exitosamente",
      campaign: newCampaign,
    }
  } catch (error) {
    return {
      success: false,
      message: "Error al crear la campaña",
    }
  }
}

export async function updateCampaignStatus(
  campaignId: string,
  status: Campaign["status"],
): Promise<{ success: boolean; message: string }> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const campaign = campaigns.find((c) => c.id === campaignId)
    if (!campaign) {
      return { success: false, message: "Campaña no encontrada" }
    }

    campaign.status = status
    campaign.updatedAt = new Date()
    revalidatePath("/marketing")

    return {
      success: true,
      message: `Campaña ${status === "active" ? "activada" : status === "paused" ? "pausada" : "completada"} exitosamente`,
    }
  } catch (error) {
    return { success: false, message: "Error al actualizar el estado" }
  }
}

export async function allocateBudget(
  campaignId: string,
  allocations: Record<string, number>,
): Promise<{ success: boolean; message: string }> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const campaign = campaigns.find((c) => c.id === campaignId)
    if (!campaign) {
      return { success: false, message: "Campaña no encontrada" }
    }

    // Validate total allocation doesn't exceed budget
    const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0)
    if (totalAllocated > campaign.budget) {
      return { success: false, message: "La asignación total excede el presupuesto" }
    }

    revalidatePath("/marketing")
    return { success: true, message: "Presupuesto asignado exitosamente" }
  } catch (error) {
    return { success: false, message: "Error al asignar presupuesto" }
  }
}

// Group Actions
export async function createStoreGroup(
  name: string,
  type: StoreGroup["type"],
  storeIds: string[],
): Promise<{ success: boolean; message: string; group?: StoreGroup }> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 600))

    const newGroup: StoreGroup = {
      id: `group-${Date.now()}`,
      name,
      type,
      stores: storeIds,
      rules: [],
      createdAt: new Date(),
    }

    storeGroups.push(newGroup)
    revalidatePath("/marketing")

    return {
      success: true,
      message: "Grupo creado exitosamente",
      group: newGroup,
    }
  } catch (error) {
    return { success: false, message: "Error al crear el grupo" }
  }
}

export async function updateStoreGroup(
  groupId: string,
  storeIds: string[],
): Promise<{ success: boolean; message: string }> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const group = storeGroups.find((g) => g.id === groupId)
    if (!group) {
      return { success: false, message: "Grupo no encontrado" }
    }

    group.stores = storeIds
    revalidatePath("/marketing")

    return { success: true, message: "Grupo actualizado exitosamente" }
  } catch (error) {
    return { success: false, message: "Error al actualizar el grupo" }
  }
}

// Analytics Actions
export async function analyzeCampaignPerformance(
  campaignId: string,
  dateRange: { start: Date; end: Date },
): Promise<PerformanceAnalysis | null> {
  try {
    // Simulate heavy calculation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const campaign = campaigns.find((c) => c.id === campaignId)
    if (!campaign || !campaign.metrics) {
      return null
    }

    const storePerformances = Object.values(campaign.metrics.storePerformance)

    return {
      campaignId,
      dateRange,
      overallROI: campaign.metrics.roi,
      topStores: storePerformances.sort((a, b) => b.roi - a.roi).slice(0, 5),
      bottomStores: storePerformances.sort((a, b) => a.roi - b.roi).slice(0, 5),
      regionalBreakdown: [
        {
          region: "Norte",
          stores: 3,
          revenue: 850000,
          roi: 3.1,
          salesIncrease: 138,
        },
        {
          region: "Sur",
          stores: 2,
          revenue: 750000,
          roi: 3.3,
          salesIncrease: 152,
        },
      ],
      productPerformance: [
        {
          productId: "prod-001",
          productName: "Laptop Gaming",
          campaigns: 2,
          revenue: 450000,
          unitsSold: 150,
          avgDiscount: 25,
        },
        {
          productId: "prod-002",
          productName: "Smartphone Pro",
          campaigns: 3,
          revenue: 380000,
          unitsSold: 190,
          avgDiscount: 20,
        },
      ],
    }
  } catch (error) {
    return null
  }
}

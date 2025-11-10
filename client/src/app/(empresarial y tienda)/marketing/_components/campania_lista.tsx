"use client"

import { useOptimistic, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { updateCampaignStatus } from "../actions"
import type { Campaign } from "@/lib/marketing-types"
import { Play, Pause, CheckCircle2, Calendar, DollarSign } from "lucide-react"
import { toast } from "sonner"

interface CampaignsListProps {
    campaigns: Campaign[]
}

export function CampaignsList({ campaigns }: CampaignsListProps) {
    const [optimisticCampaigns, setOptimisticCampaigns] = useOptimistic(campaigns)
    const [isPending, startTransition] = useTransition()


    const handleStatusChange = (campaignId: string, newStatus: Campaign["status"]) => {
        startTransition(async () => {
            // Optimistic update
            setOptimisticCampaigns(optimisticCampaigns.map((c) => (c.id === campaignId ? { ...c, status: newStatus } : c)))

            const result = await updateCampaignStatus(campaignId, newStatus)

            if (result.success) {
                toast(result.message)
            } else {
                toast(`Error ${result.message}`)
            }
        })
    }

    const getStatusBadge = (status: Campaign["status"]) => {
        const variants = {
            draft: "secondary",
            active: "default",
            paused: "outline",
            completed: "secondary",
        } as const

        return (
            <Badge variant={variants[status]}>
                {status === "draft"
                    ? "Borrador"
                    : status === "active"
                        ? "Activa"
                        : status === "paused"
                            ? "Pausada"
                            : "Completada"}
            </Badge>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {optimisticCampaigns.map((campaign) => (
                <Card key={campaign.id}>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-lg">{campaign.name}</CardTitle>
                                <CardDescription className="line-clamp-2">{campaign.description || "Sin descripción"}</CardDescription>
                            </div>
                            {getStatusBadge(campaign.status)}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                <span>Presupuesto: ${campaign.budget.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {new Date(campaign.dateRange.start).toLocaleDateString()} -{" "}
                                    {new Date(campaign.dateRange.end).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="text-muted-foreground">{campaign.stores.length} tiendas</div>
                        </div>

                        {campaign.metrics && (
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                                <div>
                                    <p className="text-xs text-muted-foreground">ROI</p>
                                    <p className="text-lg font-semibold">{campaign.metrics.roi.toFixed(1)}x</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Aumento</p>
                                    <p className="text-lg font-semibold text-green-600">+{campaign.metrics.salesIncrease}%</p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2">
                            {campaign.status === "draft" && (
                                <Button
                                    size="sm"
                                    onClick={() => handleStatusChange(campaign.id, "active")}
                                    disabled={isPending}
                                    className="flex-1"
                                >
                                    <Play className="mr-1 h-3 w-3" />
                                    Activar
                                </Button>
                            )}
                            {campaign.status === "active" && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleStatusChange(campaign.id, "paused")}
                                        disabled={isPending}
                                        className="flex-1"
                                    >
                                        <Pause className="mr-1 h-3 w-3" />
                                        Pausar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleStatusChange(campaign.id, "completed")}
                                        disabled={isPending}
                                        className="flex-1"
                                    >
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                        Completar
                                    </Button>
                                </>
                            )}
                            {campaign.status === "paused" && (
                                <Button
                                    size="sm"
                                    onClick={() => handleStatusChange(campaign.id, "active")}
                                    disabled={isPending}
                                    className="flex-1"
                                >
                                    <Play className="mr-1 h-3 w-3" />
                                    Reanudar
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

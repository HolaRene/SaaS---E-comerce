"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react"
import type { StockAlert } from "@/lib/inventory-types"
import { useOptimistic, useTransition } from "react"
import { toast } from "sonner"
import { resolveAlert } from "../actions"

interface GlobalAlertsPanelProps {
    alerts: StockAlert[]
}

const severityConfig = {
    critical: { color: "destructive", icon: XCircle, label: "Crítica" },
    high: { color: "destructive", icon: AlertTriangle, label: "Alta" },
    medium: { color: "default", icon: Clock, label: "Media" },
    low: { color: "secondary", icon: Clock, label: "Baja" },
} as const

export function GlobalAlertsPanel({ alerts }: GlobalAlertsPanelProps) {
    const [isPending, startTransition] = useTransition()
    const [optimisticAlerts, setOptimisticAlerts] = useOptimistic(alerts, (state, alertId: string) =>
        state.filter((a) => a.id !== alertId),
    )

    const handleResolve = (alertId: string) => {
        startTransition(async () => {
            setOptimisticAlerts(alertId)

            const result = await resolveAlert(alertId)

            if (result.success) {
                toast(result.message)
            } else {
                toast(`ha ocurrio un error: ${result.message}`,)
            }
        })
    }

    // Group alerts by severity
    const groupedAlerts = optimisticAlerts.reduce(
        (acc, alert) => {
            if (!acc[alert.severity]) acc[alert.severity] = []
            acc[alert.severity].push(alert)
            return acc
        },
        {} as Record<string, StockAlert[]>,
    )

    const sortedSeverities = ["critical", "high", "medium", "low"] as const

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Alertas Globales
                </CardTitle>
                <CardDescription>{optimisticAlerts.length} alertas activas requieren atención</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {optimisticAlerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
                        <p className="text-sm font-medium">No hay alertas activas</p>
                        <p className="text-xs text-muted-foreground">Todos los productos están en niveles óptimos</p>
                    </div>
                ) : (
                    sortedSeverities.map((severity) => {
                        const severityAlerts = groupedAlerts[severity]
                        if (!severityAlerts || severityAlerts.length === 0) return null

                        const config = severityConfig[severity]
                        const Icon = config.icon

                        return (
                            <div key={severity} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    <h4 className="text-sm font-semibold">{config.label}</h4>
                                    <Badge variant={config.color as any} className="ml-auto">
                                        {severityAlerts.length}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    {severityAlerts.map((alert) => (
                                        <div key={alert.id} className="rounded-lg border bg-card p-3 text-sm space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="space-y-1 flex-1">
                                                    <p className="font-medium">{alert.productName}</p>
                                                    <p className="text-xs text-muted-foreground">{alert.storeName}</p>
                                                    <p className="text-xs">{alert.message}</p>
                                                    <p className="text-xs text-primary">💡 {alert.suggestedAction}</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleResolve(alert.id)}
                                                    disabled={isPending}
                                                >
                                                    Resolver
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })
                )}
            </CardContent>
        </Card>
    )
}

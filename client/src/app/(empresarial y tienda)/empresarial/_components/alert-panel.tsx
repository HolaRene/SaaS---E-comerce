"use client"

import { AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert } from "@/lib/datos.empresarial"

/**
 * AlertsPanel Component
 * Displays critical alerts and notifications from all stores
 * Categorizes alerts by severity with appropriate icons and colors
 */

interface AlertsPanelProps {
    alerts: Alert[]
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
    // Format timestamp for display
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp)
        return date.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    // Get icon and styling based on alert type
    const getAlertIcon = (type: string) => {
        switch (type) {
            case "critical":
                return <AlertCircle className="h-5 w-5 text-chart-5" />
            case "warning":
                return <AlertTriangle className="h-5 w-5 text-chart-4" />
            case "info":
                return <Info className="h-5 w-5 text-chart-2" />
            default:
                return <Info className="h-5 w-5" />
        }
    }

    const getAlertBadge = (type: string) => {
        switch (type) {
            case "critical":
                return <Badge variant="destructive">Crítico</Badge>
            case "warning":
                return <Badge className="bg-chart-4 text-white">Advertencia</Badge>
            case "info":
                return <Badge variant="secondary">Info</Badge>
            default:
                return <Badge variant="outline">{type}</Badge>
        }
    }

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Alertas del Sistema</CardTitle>
                <CardDescription>Notificaciones críticas y advertencias activas</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                        >
                            <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-medium leading-none">{alert.storeName}</p>
                                    {getAlertBadge(alert.type)}
                                </div>
                                <p className="text-sm text-muted-foreground">{alert.message}</p>
                                <p className="text-xs text-muted-foreground">{formatTime(alert.timestamp)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus } from "lucide-react"
import type { AlertConfig } from "@/lib/configuration-types"

interface NotificationAlertsProps {
    alerts: AlertConfig[]
}

export function NotificationAlerts({ alerts: initialAlerts }: NotificationAlertsProps) {
    const [alerts, setAlerts] = useState(initialAlerts)

    const toggleAlert = (id: string) => {
        setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, enabled: !alert.enabled } : alert)))
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Alertas Críticas</CardTitle>
                        <CardDescription>Configura alertas automáticas para eventos importantes</CardDescription>
                    </div>
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Alerta
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {alerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-medium">{alert.name}</h4>
                                    <Badge variant="outline">{alert.trigger}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">Canales: {alert.channels.join(", ")}</p>
                                <p className="text-sm text-muted-foreground">Destinatarios: {alert.recipients.length}</p>
                            </div>
                            <Switch checked={alert.enabled} onCheckedChange={() => toggleAlert(alert.id)} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

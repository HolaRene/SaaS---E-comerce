"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, XCircle, Clock } from "lucide-react"
import { mockStockAlerts } from "@/lib/data-inventory"
import { useOptimistic, useTransition } from "react"
import { resolveAlert } from "../actions"
import { toast } from "sonner"

export function AlertsTab() {
    const [isPending, startTransition] = useTransition()
    const [optimisticAlerts, setOptimisticAlerts] = useOptimistic(
        mockStockAlerts.filter((a) => !a.resolved),
        (state, alertId: string) => state.filter((a) => a.id !== alertId),
    )

    const handleResolve = (alertId: string) => {
        startTransition(async () => {
            setOptimisticAlerts(alertId)

            const result = await resolveAlert(alertId)

            if (result.success) {
                toast(result.message)
            }
        })
    }

    // Group alerts by type
    const lowStockAlerts = optimisticAlerts.filter((a) => a.type === "low_stock")
    const overstockAlerts = optimisticAlerts.filter((a) => a.type === "overstock")
    const noMovementAlerts = optimisticAlerts.filter((a) => a.type === "no_movement")

    // Group by store
    const alertsByStore = optimisticAlerts.reduce(
        (acc, alert) => {
            if (!acc[alert.storeName]) acc[alert.storeName] = []
            acc[alert.storeName].push(alert)
            return acc
        },
        {} as Record<string, typeof optimisticAlerts>,
    )

    const severityConfig = {
        critical: { color: "destructive", icon: XCircle, label: "Crítica" },
        high: { color: "destructive", icon: AlertTriangle, label: "Alta" },
        medium: { color: "default", icon: Clock, label: "Media" },
        low: { color: "secondary", icon: Clock, label: "Baja" },
    } as const

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lowStockAlerts.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {lowStockAlerts.filter((a) => a.severity === "critical").length} críticas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Sobrestock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overstockAlerts.length}</div>
                        <p className="text-xs text-muted-foreground">Requieren redistribución</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Sin Movimiento</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{noMovementAlerts.length}</div>
                        <p className="text-xs text-muted-foreground">Productos estancados</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">Todas ({optimisticAlerts.length})</TabsTrigger>
                    <TabsTrigger value="low_stock">Stock Bajo ({lowStockAlerts.length})</TabsTrigger>
                    <TabsTrigger value="overstock">Sobrestock ({overstockAlerts.length})</TabsTrigger>
                    <TabsTrigger value="by_store">Por Tienda</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    {optimisticAlerts.map((alert) => {
                        const config = severityConfig[alert.severity]
                        const Icon = config.icon
                        return (
                            <Card key={alert.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={config.color as any}>{config.label}</Badge>
                                                    <span className="text-sm font-medium">{alert.productName}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{alert.storeName}</p>
                                                <p className="text-sm">{alert.message}</p>
                                                <div className="rounded-md bg-muted p-3">
                                                    <p className="text-sm">
                                                        <span className="font-medium">💡 Sugerencia:</span> {alert.suggestedAction}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => handleResolve(alert.id)} disabled={isPending}>
                                            Resolver
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </TabsContent>

                <TabsContent value="low_stock" className="space-y-4">
                    {lowStockAlerts.map((alert) => {
                        const config = severityConfig[alert.severity]
                        return (
                            <Card key={alert.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={config.color as any}>{config.label}</Badge>
                                                <span className="text-sm font-medium">{alert.productName}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{alert.storeName}</p>
                                            <p className="text-sm">{alert.message}</p>
                                            <div className="rounded-md bg-muted p-3">
                                                <p className="text-sm">
                                                    <span className="font-medium">💡 Sugerencia:</span> {alert.suggestedAction}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => handleResolve(alert.id)} disabled={isPending}>
                                            Resolver
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </TabsContent>

                <TabsContent value="overstock" className="space-y-4">
                    {overstockAlerts.map((alert) => (
                        <Card key={alert.id}>
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="default">Sobrestock</Badge>
                                            <span className="text-sm font-medium">{alert.productName}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{alert.storeName}</p>
                                        <p className="text-sm">{alert.message}</p>
                                        <div className="rounded-md bg-muted p-3">
                                            <p className="text-sm">
                                                <span className="font-medium">💡 Sugerencia:</span> {alert.suggestedAction}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => handleResolve(alert.id)} disabled={isPending}>
                                        Resolver
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="by_store" className="space-y-4">
                    {Object.entries(alertsByStore).map(([storeName, alerts]) => (
                        <Card key={storeName}>
                            <CardHeader>
                                <CardTitle className="text-lg">{storeName}</CardTitle>
                                <CardDescription>{alerts.length} alertas activas</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {alerts.map((alert) => {
                                    const config = severityConfig[alert.severity]
                                    return (
                                        <div key={alert.id} className="flex items-start justify-between gap-4 rounded-lg border p-3">
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={config.color as any} className="text-xs">
                                                        {config.label}
                                                    </Badge>
                                                    <span className="text-sm font-medium">{alert.productName}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{alert.message}</p>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => handleResolve(alert.id)} disabled={isPending}>
                                                Resolver
                                            </Button>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    )
}

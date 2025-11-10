import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Package, DollarSign, AlertTriangle, Activity } from "lucide-react"
import type { ConsolidatedInventory } from "@/lib/inventory-types"

interface InventoryOverviewProps {
    data: ConsolidatedInventory
}

export function InventoryOverview({ data }: InventoryOverviewProps) {
    const criticalAlerts = data.alerts.filter((a) => a.severity === "critical").length
    const highAlerts = data.alerts.filter((a) => a.severity === "high").length

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${data.totalValue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">{data.totalProducts} productos</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.totalStock}</div>
                    <p className="text-xs text-muted-foreground">unidades en inventario</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rotación Promedio</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.averageTurnover.toFixed(1)}x</div>
                    <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        +0.8 vs mes anterior
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.alerts.length}</div>
                    <p className="text-xs text-muted-foreground">
                        {criticalAlerts} críticas, {highAlerts} altas
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

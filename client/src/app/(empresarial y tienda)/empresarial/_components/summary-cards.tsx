"use client"

import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

/**
 * SummaryCards Component
 * Displays key metrics in a responsive grid layout
 * Shows sales figures, growth rates, and alert counts with visual indicators
 */

interface SummaryCardsProps {
    period: string
    metrics: {
        sales: number
        growth: number
        orders: number
        alertCount: number
    }
}

export function SummaryCards({ period, metrics }: SummaryCardsProps) {
    // Format currency for display
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
        }).format(value)
    }

    const isPositiveGrowth = metrics.growth > 0

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Sales Card */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Ventas Totales</CardTitle>
                    <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(metrics.sales)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {period === "today" ? "Hoy" : period === "week" ? "Esta semana" : "Este mes"}
                    </p>
                </CardContent>
            </Card>

            {/* Growth Rate Card */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Crecimiento</CardTitle>
                    {isPositiveGrowth ? (
                        <TrendingUp className="h-4 w-4 text-chart-3" />
                    ) : (
                        <TrendingDown className="h-4 w-4 text-chart-5" />
                    )}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-2">
                        {isPositiveGrowth ? "+" : ""}
                        {metrics.growth}%
                        <Badge variant={isPositiveGrowth ? "default" : "destructive"} className="text-xs">
                            {isPositiveGrowth ? "Positivo" : "Negativo"}
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">vs. período anterior</p>
                </CardContent>
            </Card>

            {/* Orders Card */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.orders.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">Transacciones completadas</p>
                </CardContent>
            </Card>

            {/* Alerts Card */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Alertas Activas</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-chart-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-2">
                        {metrics.alertCount}
                        {metrics.alertCount > 0 && (
                            <Badge variant="outline" className="text-xs border-chart-4 text-chart-4">
                                Requiere atención
                            </Badge>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Notificaciones pendientes</p>
                </CardContent>
            </Card>
        </div>
    )
}

"use client"

import { MapPin, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

/**
 * ComparativeMetrics Component
 * Shows regional performance comparison with visual progress bars
 * Displays sales and growth metrics for each region
 */

interface RegionalMetric {
    region: string
    sales: number
    growth: number
    stores: number
}

interface ComparativeMetricsProps {
    metrics: RegionalMetric[]
}

export function ComparativeMetrics({ metrics }: ComparativeMetricsProps) {
    // Calculate max sales for progress bar scaling
    const maxSales = Math.max(...metrics.map((m) => m.sales))

    // Format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
        }).format(value)
    }

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Métricas Comparativas</CardTitle>
                <CardDescription>Análisis de rendimiento por región</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {metrics.map((metric) => {
                        const progressValue = (metric.sales / maxSales) * 100
                        const isPositiveGrowth = metric.growth > 0

                        return (
                            <div key={metric.region} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">{metric.region}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className={`h-4 w-4 ${isPositiveGrowth ? "text-chart-3" : "text-chart-5"}`} />
                                        <span className={`text-sm font-medium ${isPositiveGrowth ? "text-chart-3" : "text-chart-5"}`}>
                                            {isPositiveGrowth ? "+" : ""}
                                            {metric.growth}%
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Progress value={progressValue} className="h-2" />
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{formatCurrency(metric.sales)}</span>
                                        <span>
                                            {metric.stores} {metric.stores === 1 ? "tienda" : "tiendas"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

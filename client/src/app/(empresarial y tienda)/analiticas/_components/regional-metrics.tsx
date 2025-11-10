"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getRegionalMetrics } from "@/lib/analytics-data"
import { TrendingUp, TrendingDown, Store, DollarSign } from "lucide-react"

export function RegionalMetrics() {
    const metrics = getRegionalMetrics()

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((region) => (
                <Card key={region.region}>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">{region.region}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                            <Store className="h-4 w-4" />
                            {region.storeCount} {region.storeCount === 1 ? "tienda" : "tiendas"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Ventas Totales</span>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <p className="text-2xl font-bold">${(region.totalSales / 1000000).toFixed(1)}M</p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Promedio por Tienda</span>
                            </div>
                            <p className="text-lg font-semibold">${(region.averageSalesPerStore / 1000000).toFixed(2)}M</p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Crecimiento</span>
                                {region.growthRate > 0 ? (
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                )}
                            </div>
                            <p className={`text-lg font-semibold ${region.growthRate > 0 ? "text-green-600" : "text-red-600"}`}>
                                {region.growthRate > 0 ? "+" : ""}
                                {region.growthRate.toFixed(1)}%
                            </p>
                        </div>

                        <div>
                            <span className="text-sm text-muted-foreground">Participación de Mercado</span>
                            <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                                <div className="h-2 rounded-full bg-primary" style={{ width: `${region.marketShare}%` }} />
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{region.marketShare}%</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

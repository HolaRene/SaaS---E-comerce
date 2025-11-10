"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"
import type { ConsolidatedInventory } from "@/lib/inventory-types"

interface InventoryValueCardProps {
    data: ConsolidatedInventory
}

export function InventoryValueCard({ data }: InventoryValueCardProps) {
    const chartData = data.metrics.turnoverTrends

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tendencia de Rotación</CardTitle>
                <CardDescription>Rotación promedio en los últimos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <div className="text-3xl font-bold">{data.averageTurnover.toFixed(1)}x</div>
                    <div className="flex items-center text-sm text-green-600">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        +10.5% vs semana anterior
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="date"
                            className="text-xs"
                            tick={{ fill: "var(--muted-foreground)" }}
                            tickFormatter={(value) => new Date(value).toLocaleDateString("es", { month: "short", day: "numeric" })}
                        />
                        <YAxis className="text-xs" tick={{ fill: "var(--muted-foreground)" }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--background)",
                                border: "1px solid var(--border)",
                                borderRadius: "6px",
                            }}
                            labelFormatter={(value) => new Date(value).toLocaleDateString("es", { month: "long", day: "numeric" })}
                            formatter={(value: number) => [`${value}x`, "Rotación"]}
                        />
                        <Line
                            type="monotone"
                            dataKey="turnover"
                            stroke="var(--primary)"
                            strokeWidth={2}
                            dot={{ fill: "var(--primary)" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

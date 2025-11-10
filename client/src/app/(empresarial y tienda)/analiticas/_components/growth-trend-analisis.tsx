"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { SalesData } from "@/lib/analytics-types"

interface GrowthTrendAnalysisProps {
    data: SalesData[]
}

export function GrowthTrendAnalysis({ data }: GrowthTrendAnalysisProps) {
    // Group by month and calculate average growth
    const monthlyData = data.reduce(
        (acc, item) => {
            const monthKey = `${item.date.getFullYear()}-${String(item.date.getMonth() + 1).padStart(2, "0")}`

            if (!acc[monthKey]) {
                acc[monthKey] = {
                    month: monthKey,
                    totalSales: 0,
                    count: 0,
                    growthRate: 0,
                }
            }

            acc[monthKey].totalSales += item.totalSales
            acc[monthKey].growthRate += item.growthRate
            acc[monthKey].count += 1

            return acc
        },
        {} as Record<string, { month: string; totalSales: number; count: number; growthRate: number }>,
    )

    const chartData = Object.values(monthlyData)
        .map((item) => ({
            mes: item.month,
            ventas: Math.round(item.totalSales / 1000),
            crecimiento: (item.growthRate / item.count).toFixed(1),
        }))
        .sort((a, b) => a.mes.localeCompare(b.mes))
        .slice(-12) // Last 12 months

    return (
        <Card>
            <CardHeader>
                <CardTitle>Análisis de Tendencias de Crecimiento</CardTitle>
                <CardDescription>Evolución mensual de ventas y tasa de crecimiento</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis yAxisId="left" orientation="left" stroke="var(--primary)" />
                        <YAxis yAxisId="right" orientation="right" stroke="var(--chart-3)" />
                        <Tooltip
                            formatter={(value, name) => {
                                if (name === "Ventas (miles de C$)") {
                                    return [`C$ ${(value as number * 1000).toLocaleString("es-NI")}`, "Ventas"]
                                }
                                return [`${value}%`, "Crecimiento"]
                            }}
                        />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="ventas"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            name="Ventas (miles de C$)"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="crecimiento"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            name="Crecimiento (%)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

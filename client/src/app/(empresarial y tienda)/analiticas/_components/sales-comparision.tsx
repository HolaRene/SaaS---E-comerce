"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { SalesData } from "@/lib/analytics-types"

interface SalesComparisonProps {
    data: SalesData[]
}

export function SalesComparison({ data }: SalesComparisonProps) {
    // Aggregate by store
    const aggregated = data.reduce(
        (acc, item) => {
            const existing = acc.find((a) => a.storeId === item.storeId)
            if (existing) {
                existing.totalSales += item.totalSales
                existing.transactions += item.transactions
            } else {
                acc.push({
                    storeId: item.storeId,
                    storeName: item.storeName,
                    totalSales: item.totalSales,
                    transactions: item.transactions,
                })
            }
            return acc
        },
        [] as { storeId: string; storeName: string; totalSales: number; transactions: number }[],
    )

    const chartData = aggregated.map((item) => ({
        name: item.storeName,
        ventas: Math.round(item.totalSales / 1000),
        transacciones: item.transactions,
    }))

    return (
        <Card>
            <CardHeader>
                <CardTitle>Comparativa de Ventas por Tienda</CardTitle>
                <CardDescription>Ventas totales y transacciones del período seleccionado</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="var(--primary)" />
                        <YAxis yAxisId="right" orientation="right" stroke="var(--chart-2)" />
                        <Tooltip
                            formatter={(value, name) => {
                                if (name === "Ventas (miles de C$)") {
                                    return [`C$ ${(value as number * 1000).toLocaleString("es-NI")}`, "Ventas"]
                                }
                                return [value, name]
                            }}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="ventas" fill="#0ea5e9" name="Ventas (miles de C$)" />
                        <Bar yAxisId="right" dataKey="transacciones" fill="#f59e0b" name="Transacciones" />


                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    TooltipProps
} from "recharts"
import type { ConsolidatedInventory } from "@/lib/inventory-types"
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent"

interface StockDistributionChartProps {
    data: ConsolidatedInventory
}

export function StockDistributionChart({ data }: StockDistributionChartProps) {
    // Generamos los datos tipados
    const chartData = data.metrics.stockDistribution.map((store) => ({
        name: store.storeName,
        stock: store.totalStock,
        valor: store.value / 1000, // valor en miles
    }))

    // Tooltip personalizado con tipado estricto
    const CustomTooltip = ({
        active,
        payload,
        label,
    }: TooltipProps<ValueType, NameType>) => {
        if (!active || !payload?.length) return null

        return (
            <div
                style={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    padding: "8px",
                }}
            >
                <p className="font-medium">{label}</p>
                {payload.map((entry) => {
                    const name = entry.name as string
                    const value = entry.value as number
                    const color = entry.color
                    const formatted =
                        name === "Valor (miles)"
                            ? `C$${value.toLocaleString()}k`
                            : `${value.toLocaleString()} unidades`

                    return (
                        <p key={name} style={{ color }}>
                            {name}: {formatted}
                        </p>
                    )
                })}
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribución de Stock por Tienda</CardTitle>
                <CardDescription>Comparación de unidades y valor de inventario</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="name"
                            className="text-xs"
                            tick={{ fill: "var(--muted-foreground)" }}
                        />
                        <YAxis
                            className="text-xs"
                            tick={{ fill: "var(--muted-foreground)" }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="stock" fill="var(--primary)" name="Unidades" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="valor" fill="var(--chart-2)" name="Valor (miles)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

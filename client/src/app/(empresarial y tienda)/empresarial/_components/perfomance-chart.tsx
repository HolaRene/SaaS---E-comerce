"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useQuery } from "convex/react"
import { Id } from "../../../../../convex/_generated/dataModel"
import { api } from "../../../../../convex/_generated/api"

interface PerformanceChartProps {
    propietarioId: Id<"usuarios">
}

export function PerformanceChart({ propietarioId }: PerformanceChartProps) {
    // Obtener datos agregados de TODAS las tiendas
    const data = useQuery(api.tiendas.getVentasDiariasByPropietario, {
        propietarioId,
        dias: 7
    })

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
        }).format(value)
    }

    const chartData = data?.map((item) => ({
        date: item.date,
        ventas: item.sales,
        pedidos: item.orders,
    })) || []

    if (!data) {
        return (
            <Card className="col-span-full lg:col-span-2">
                <CardHeader>
                    <CardTitle>Rendimiento de Ventas</CardTitle>
                    <CardDescription>Cargando datos de todas tus tiendas...</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">Cargando gráfico...</div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-sm col-span-full lg:col-span-2">
            <CardHeader>
                <CardTitle>Rendimiento de Ventas</CardTitle>
                <CardDescription>Evolución diaria de ventas y pedidos - Últimos 7 días (Todas tus tiendas)</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={chartData} margin={{ top: 1, right: 0, left: 0, bottom: 1 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" tick={{ fill: "var(--muted-foreground)" }} />
                        <YAxis
                            yAxisId="left"
                            className="text-xs"
                            tick={{ fill: "var(--muted-foreground)" }}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            className="text-xs"
                            tick={{ fill: "var(--muted-foreground)" }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--card)",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                            }}
                            formatter={(value: number, name: string) => {
                                if (name === "ventas") {
                                    return [formatCurrency(value), "Ventas Totales"]
                                }
                                return [value.toLocaleString(), "Pedidos Totales"]
                            }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: "2px" }}
                            formatter={(value) => (value === "ventas" ? "Ventas" : "Pedidos")}
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="ventas"
                            stroke="var(--chart-1)"
                            strokeWidth={2}
                            dot={{ fill: "var(--chart-1)", r: 3 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="pedidos"
                            stroke="var(--chart-2)"
                            strokeWidth={2}
                            dot={{ fill: "var(--chart-2)", r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
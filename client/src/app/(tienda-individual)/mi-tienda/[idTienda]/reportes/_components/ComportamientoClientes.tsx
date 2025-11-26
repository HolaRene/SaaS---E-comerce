"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
} from "recharts"
import { TrendingUp, Users } from "lucide-react"
import { Id } from "../../../../../../../convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "../../../../../../../convex/_generated/api"
import * as React from "react"
import ClientesFrecuentesTable from "./ClientesFrecuentesTable"

const defaultColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"]

type CreditosStats = {
    totalCreditosActivos?: number
    creditosVencidos?: number
    totalAdeudado?: number
}

const ComportamientoClientes = ({ idTienda }: { idTienda: Id<"tiendas"> }) => {
    const id = idTienda

    // Queries Convex
    const clientesQuery = useQuery(api.clientes.getClientesByTienda, { tiendaId: id })
    const ventasQuery = useQuery(api.ventas.getVentasByTienda, { tiendaId: id, limit: 1000 })
    const creditosStats = useQuery(api.creditos.getEstadisticasCreditos, { tiendaId: id }) as CreditosStats | null

    // Top clientes: ordenar por cantidadCompras o totalCompras
    const topClientes = React.useMemo(() => {
        const clientes = (clientesQuery ?? []) as any[]
        return clientes
            .slice()
            .sort((a, b) => (b.cantidadCompras || 0) - (a.cantidadCompras || 0))
            .slice(0, 5)
            .map((c) => ({ nombre: c.nombre, compras: c.cantidadCompras || 0, promedioMensual: Math.round((c.totalCompras || 0) / Math.max(1, (new Date().getMonth() + 1))), ultimaCompra: c.ultimaCompra }))
    }, [clientesQuery])

    // Patrones por día: contar ventas por día de la semana
    const patronesPorDia = React.useMemo(() => {
        const ventas = (ventasQuery ?? []) as any[]
        const counts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
        for (const v of ventas) {
            try {
                const d = new Date(v.fecha)
                const dow = d.getDay()
                counts[dow] = (counts[dow] || 0) + 1
            } catch {
                // ignore
            }
        }
        const labels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
        return labels.map((lab, i) => ({ dia: lab, compras: counts[i] || 0 }))
    }, [ventasQuery])

    // Efectividad de fiados: usar stats de créditos
    const efectividadFiados = React.useMemo(() => {
        const stats = (creditosStats ?? {}) as CreditosStats
        const totalActivos = stats.totalCreditosActivos ?? 0
        const totalVencido = stats.creditosVencidos ?? 0
        // Distribución aproximada
        const pagados = Math.max(0, (totalActivos - totalVencido))
        const pendientes = Math.max(0, totalActivos - pagados)
        return [
            { estado: "Activos", valor: pagados, color: defaultColors[0] },
            { estado: "Vencidos", valor: totalVencido, color: defaultColors[1] },
            { estado: "Pendientes", valor: pendientes, color: defaultColors[2] },
        ]
    }, [creditosStats])
    return (
        <div className='space-y-3'>
            {/* Métricas clave de clientes */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Valor Promedio por Cliente</p>
                                <p className="text-3xl font-bold">C$1,850</p>
                            </div>
                            <Users className="h-10 w-10 text-primary" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Clientes Activos Este Mes</p>
                                <p className="text-3xl font-bold">120</p>
                            </div>
                            <TrendingUp className="h-10 w-10 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Clientes más frecuentes */}
            <Card>
                <CardHeader>
                    <CardTitle>Clientes Más Frecuentes</CardTitle>
                    <CardDescription>Top clientes por número de compras</CardDescription>
                </CardHeader>
                <CardContent>
                    <ClientesFrecuentesTable data={topClientes} />
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patrones de compra por día */}
                <Card>
                    <CardHeader>
                        <CardTitle>Patrones de Compra</CardTitle>
                        <CardDescription>Distribución de ventas por día de la semana</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                compras: {
                                    label: "Compras",
                                    color: "var(--chart-3)",
                                },
                            }}
                            className="h-[300px] w-full overflow-hidden"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={patronesPorDia}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="dia" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="compras" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                        <p className="text-sm text-muted-foreground mt-4 text-center">
                            Los viernes y sábados son los días de mayor venta
                        </p>
                    </CardContent>
                </Card>

                {/* Efectividad de fiados */}
                <Card>
                    <CardHeader>
                        <CardTitle>Efectividad de Fiados</CardTitle>
                        <CardDescription>Distribución de créditos otorgados</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                valor: {
                                    label: "Porcentaje",
                                },
                            }}
                            className="h-[300px] w-full overflow-hidden"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={efectividadFiados}
                                        dataKey="valor"
                                        nameKey="estado"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >
                                        {efectividadFiados.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium">Total de Cartera de Crédito</p>
                            <p className="text-2xl font-bold text-primary">C$5,430</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ComportamientoClientes
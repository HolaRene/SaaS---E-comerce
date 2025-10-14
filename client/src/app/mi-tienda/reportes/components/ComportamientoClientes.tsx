"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

// Clientes más frecuentes con historial de compras
const clientesFrecuentes = [
    { nombre: "Juan Pérez", compras: 26, promedioMensual: 9450, ultimaCompra: "05/10/2025" },
    { nombre: "Ana López", compras: 19, promedioMensual: 7320, ultimaCompra: "03/10/2025" },
    { nombre: "Carlos Gómez", compras: 15, promedioMensual: 5800, ultimaCompra: "04/10/2025" },
    { nombre: "María Sánchez", compras: 12, promedioMensual: 4200, ultimaCompra: "02/10/2025" },
]

// Patrones de compra por día de la semana
const patronesPorDia = [
    { dia: "Lun", compras: 60 },
    { dia: "Mar", compras: 75 },
    { dia: "Mié", compras: 80 },
    { dia: "Jue", compras: 85 },
    { dia: "Vie", compras: 130 },
    { dia: "Sáb", compras: 120 },
    { dia: "Dom", compras: 20 },
]

// Efectividad de fiados (créditos)
const efectividadFiados = [
    { estado: "Pagados", valor: 75, color: "var(--chart-1)" },
    { estado: "Pendientes", valor: 20, color: "var(--chart-2)" },
    { estado: "Vencidos", valor: 5, color: "var(--chart-3)" },
]

const ComportamientoClientes = () => {
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead className="text-center">Compras Totales</TableHead>
                                <TableHead className="text-right">Promedio Mensual</TableHead>
                                <TableHead className="text-right">Última Compra</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clientesFrecuentes.map((cliente) => (
                                <TableRow key={cliente.nombre}>
                                    <TableCell className="font-medium">{cliente.nombre}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge>{cliente.compras}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">C${cliente.promedioMensual.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">{cliente.ultimaCompra}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
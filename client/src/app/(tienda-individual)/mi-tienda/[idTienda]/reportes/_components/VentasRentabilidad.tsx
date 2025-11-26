"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
} from "recharts"
import { ArrowDownRight, ArrowUpRight, FileDown, TrendingUp } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Id } from "../../../../../../../convex/_generated/dataModel"

// Distribución de ventas por categoría para gráfico circular
const ventasPorCategoria = [
    { categoria: "Panadería", valor: 18500, color: "var(--chart-1)" },
    { categoria: "Bebidas", valor: 15200, color: "var(--chart-2)" },
    { categoria: "Granos", valor: 12800, color: "var(--chart-3)" },
    { categoria: "Lácteos", valor: 10500, color: "var(--chart-4)" },
    { categoria: "Otros", valor: 13500, color: "var(--chart-5)" },
]

// Datos mensuales de ventas para gráficos de barras y líneas
const ventasMensuales = [
    { mes: "Enero", ventas: 45000, costos: 28000 },
    { mes: "Febrero", ventas: 52000, costos: 32000 },
    { mes: "Marzo", ventas: 61000, costos: 38000 },
    { mes: "Abril", ventas: 59000, costos: 37000 },
    { mes: "Mayo", ventas: 70500, costos: 45200 },
]
// Productos más vendidos con participación porcentual
const productosMasVendidos = [
    { producto: "Pan Dulce", ventas: 12300, participacion: 18 },
    { producto: "Refresco 1L", ventas: 8450, participacion: 12 },
    { producto: "Café Tradicional", ventas: 6120, participacion: 9 },
    { producto: "Arroz 1kg", ventas: 5800, participacion: 8 },
    { producto: "Frijoles 1kg", ventas: 4900, participacion: 7 },
]

const VentasRentabilidad = ({ idTienda }: { idTienda: Id<"tiendas"> }) => {

    const [periodo, setPeriodo] = useState("mes")
    const [comercio, setComercio] = useState("todos")

    const ventasTotales = 70500
    const costosEstimados = 45200
    const gananciaNeta = ventasTotales - costosEstimados
    const margenGanancia = ((gananciaNeta / ventasTotales) * 100).toFixed(1)

    return (
        <div className='space-y-3'>
            {/* Filtros superiores */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <Label className="text-sm font-medium mb-2 block">Período</Label>
                            <Select value={periodo} onValueChange={setPeriodo}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hoy">Hoy</SelectItem>
                                    <SelectItem value="semana">Esta semana</SelectItem>
                                    <SelectItem value="mes">Este mes</SelectItem>
                                    <SelectItem value="personalizado">Personalizado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <Label className="text-sm font-medium mb-2 block">Comercio</Label>
                            <Select value={comercio} onValueChange={setComercio}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos los comercios</SelectItem>
                                    <SelectItem value="principal">Sucursal Principal</SelectItem>
                                    <SelectItem value="norte">Sucursal Norte</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button variant="outline">
                                <FileDown className="mr-2 h-4 w-4" />
                                Exportar PDF
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Resumen de margen de ganancia */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Ventas Totales</p>
                                <p className="text-2xl font-bold">C${ventasTotales.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Costos Estimados</p>
                                <p className="text-2xl font-bold">C${costosEstimados.toLocaleString()}</p>
                            </div>
                            <ArrowDownRight className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Ganancia Neta</p>
                                <p className="text-2xl font-bold text-primary">C${gananciaNeta.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">({margenGanancia}%)</p>
                            </div>
                            <ArrowUpRight className="h-8 w-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Gráficos de ventas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gráfico de barras: Ventas por período */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ventas Mensuales</CardTitle>
                        <CardDescription>Comparación de ventas por mes</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <ChartContainer
                            config={{
                                ventas: {
                                    label: "Ventas",
                                    color: "var(--chart-1)",
                                },
                            }}
                            className="h-[300px] w-full overflow-hidden"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={ventasMensuales}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="ventas" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Gráfico de líneas: Tendencia de ventas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tendencia de Ventas</CardTitle>
                        <CardDescription>Evolución mensual de ingresos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                ventas: {
                                    label: "Ventas",
                                    color: "var(--chart-2)",
                                },
                            }}
                            className="h-[300px] w-full overflow-hidden"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={ventasMensuales}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Line type="monotone" dataKey="ventas" stroke="var(--chart-2)" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Productos más vendidos y distribución por categoría */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tabla de productos más vendidos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Productos Más Vendidos</CardTitle>
                        <CardDescription>Top 5 productos del período</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead className="text-right">Ventas</TableHead>
                                    <TableHead className="text-right">Participación</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productosMasVendidos.map((item) => (
                                    <TableRow key={item.producto}>
                                        <TableCell className="font-medium">{item.producto}</TableCell>
                                        <TableCell className="text-right">C${item.ventas.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="secondary">{item.participacion}%</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Gráfico circular: Ventas por categoría */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ventas por Categoría</CardTitle>
                        <CardDescription>Distribución de ingresos por tipo de producto</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                valor: {
                                    label: "Valor",
                                },
                            }}
                            className="h-[300px] w-full overflow-hidden"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={ventasPorCategoria}
                                        dataKey="valor"
                                        nameKey="categoria"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >
                                        {ventasPorCategoria.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default VentasRentabilidad
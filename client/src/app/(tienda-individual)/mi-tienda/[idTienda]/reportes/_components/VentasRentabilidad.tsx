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
import { useQuery } from "convex/react"
import { api } from "../../../../../../../convex/_generated/api"

// Valores por defecto (se reemplazan por datos desde Convex)
const defaultColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
]


const VentasRentabilidad = ({ idTienda }: { idTienda: Id<"tiendas"> }) => {
    const id = idTienda


    const [periodo, setPeriodo] = useState("mes")
    const [comercio, setComercio] = useState("todos")

    // Queries Convex
    const ventasMensualesQuery = useQuery(api.ventas.getVentasMensualesByTienda, { tiendaId: id, meses: 6 })
    const topProductosQuery = useQuery(api.ventas.getTopProductosByTienda, { tiendaId: id, limit: 5 })
    const estadisticas = useQuery(api.ventas.getEstadisticasVentas, { tiendaId: id })

    const ventasMensuales = ventasMensualesQuery ?? []
    const productosMasVendidos = (topProductosQuery ?? []).map((p: any) => ({ producto: p.nombre, ventas: p.ventas, participacion: Math.round(p.participacion) }))

    // Ventas por categoría desde Convex
    const ventasPorCategoriaQuery = useQuery(api.ventas.getVentasPorCategoria, { tiendaId: id })
    const ventasPorCategoria = (ventasPorCategoriaQuery ?? []).map((v: any, i: number) => ({
        categoria: v.categoria,
        valor: v.valor,
        color: v.color ?? defaultColors[i % defaultColors.length],
    }))

    const ventasTotales = estadisticas?.totalVentas ?? ventasMensuales.reduce((s: number, v: any) => s + (v.ventas || 0), 0)
    const costosEstimados = ventasMensuales.reduce((s: number, v: any) => s + (v.costos || 0), 0)
    const gananciaNeta = ventasTotales - costosEstimados
    const margenGanancia = ventasTotales > 0 ? ((gananciaNeta / ventasTotales) * 100).toFixed(1) : "0.0"


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
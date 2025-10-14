"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
} from "recharts"

// Flujo de caja mensual (ingresos vs egresos)
const flujoCaja = [
    { mes: "Enero", ingresos: 45000, egresos: 30000 },
    { mes: "Febrero", ingresos: 52000, egresos: 31500 },
    { mes: "Marzo", ingresos: 61000, egresos: 40000 },
    { mes: "Abril", ingresos: 59000, egresos: 38000 },
    { mes: "Mayo", ingresos: 70500, egresos: 45200 },
]

// Cuentas por cobrar (fiados pendientes)
const cuentasPorCobrar = [
    { cliente: "Carlos López", monto: 350, fechaVencimiento: "07/10/2025", estado: "Pendiente" },
    { cliente: "María Rodríguez", monto: 420, fechaVencimiento: "10/10/2025", estado: "Por vencer" },
    { cliente: "Pedro Gómez", monto: 280, fechaVencimiento: "12/10/2025", estado: "Por vencer" },
    { cliente: "Ana Martínez", monto: 150, fechaVencimiento: "02/10/2025", estado: "Vencido" },
]

// Proyección de ventas para los próximos meses
const proyeccionVentas = [
    { mes: "Mayo", ventas: 70500, tipo: "real" },
    { mes: "Jun", ventas: 76000, tipo: "proyectado" },
    { mes: "Jul", ventas: 82000, tipo: "proyectado" },
    { mes: "Ago", ventas: 88500, tipo: "proyectado" },
]

const EstadoFinanciero = () => {
    return (
        <div className='space-y-3'>
            {/* Flujo de caja */}
            <Card>
                <CardHeader>
                    <CardTitle>Flujo de Caja</CardTitle>
                    <CardDescription>Comparación de ingresos vs egresos mensuales</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={{
                            ingresos: {
                                label: "Ingresos",
                                color: "var(--chart-1)",
                            },
                            egresos: {
                                label: "Egresos",
                                color: "var(--chart-2)",
                            },
                        }}
                        className="h-[350px] w-full overflow-hidden"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={flujoCaja}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Legend />
                                <Line type="monotone" dataKey="ingresos" stroke="var(--chart-1)" strokeWidth={2} />
                                <Line type="monotone" dataKey="egresos" stroke="var(--chart-2)" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cuentas por cobrar */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cuentas por Cobrar</CardTitle>
                        <CardDescription>Fiados pendientes y próximos vencimientos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead className="text-right">Monto</TableHead>
                                    <TableHead className="text-right">Vencimiento</TableHead>
                                    <TableHead className="text-right">Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cuentasPorCobrar.map((cuenta) => (
                                    <TableRow key={cuenta.cliente}>
                                        <TableCell className="font-medium">{cuenta.cliente}</TableCell>
                                        <TableCell className="text-right">C${cuenta.monto.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">{cuenta.fechaVencimiento}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge
                                                variant={
                                                    cuenta.estado === "Vencido"
                                                        ? "destructive"
                                                        : cuenta.estado === "Pendiente"
                                                            ? "secondary"
                                                            : "outline"
                                                }
                                            >
                                                {cuenta.estado}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Resumen de gastos vs ingresos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Gastos vs Ingresos</CardTitle>
                        <CardDescription>Balance del período actual</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-yellow-500/40 rounded-lg">
                                <span className="font-medium">Ingresos</span>
                                <span className="text-xl font-bold text-green-600">C$70,500</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-red-500/10 rounded-lg">
                                <span className="font-medium">Gastos</span>
                                <span className="text-xl font-bold text-red-600">C$45,200</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-green-200 rounded-lg border-2 border-primary">
                                <span className="font-medium">Resultado</span>
                                <span className="text-2xl font-bold text-primary">C$25,300</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Proyecciones */}
            <Card>
                <CardHeader>
                    <CardTitle>Proyecciones de Ventas</CardTitle>
                    <CardDescription>Estimación de crecimiento para los próximos meses</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={{
                            ventas: {
                                label: "Ventas",
                                color: "var(--chart-4)",
                            },
                        }}
                        className="h-[300px] w-full overflow-hidden"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={proyeccionVentas}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line
                                    type="monotone"
                                    dataKey="ventas"
                                    stroke="var(--chart-4)"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                            Si las ventas se mantienen, se espera un crecimiento del <strong>8%</strong> en el próximo
                            trimestre.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default EstadoFinanciero
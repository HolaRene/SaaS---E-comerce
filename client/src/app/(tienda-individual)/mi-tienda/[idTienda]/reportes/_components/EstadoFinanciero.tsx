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
import { Id } from "../../../../../../../convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "../../../../../../../convex/_generated/api"
import { Skeleton } from "@/components/ui/skeleton"

const EstadoFinanciero = ({ idTienda }: { idTienda: Id<"tiendas"> }) => {
    // Queries de Convex
    const flujoCaja = useQuery(api.finanzas.getFlujoCaja, { tiendaId: idTienda, meses: 5 })
    const cuentasPorCobrar = useQuery(api.finanzas.getCuentasPorCobrar, { tiendaId: idTienda })
    const resumenFinanciero = useQuery(api.finanzas.getResumenFinanciero, { tiendaId: idTienda })
    const proyeccionVentas = useQuery(api.finanzas.getProyeccionVentas, {
        tiendaId: idTienda,
        mesesHistoricos: 1,
        mesesProyectados: 3
    })

    // Loading states
    const isLoading = !flujoCaja || !cuentasPorCobrar || !resumenFinanciero || !proyeccionVentas

    return (
        <div className='space-y-3'>
            {/* Flujo de caja */}
            <Card>
                <CardHeader>
                    <CardTitle>Flujo de Caja</CardTitle>
                    <CardDescription>Comparación de ingresos vs egresos mensuales</CardDescription>
                </CardHeader>
                <CardContent>
                    {!flujoCaja ? (
                        <Skeleton className="h-[350px] w-full" />
                    ) : flujoCaja.length === 0 ? (
                        <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                            No hay datos de flujo de caja disponibles
                        </div>
                    ) : (
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
                    )}
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
                        {!cuentasPorCobrar ? (
                            <Skeleton className="h-[200px] w-full" />
                        ) : cuentasPorCobrar.length === 0 ? (
                            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                                No hay cuentas por cobrar pendientes
                            </div>
                        ) : (
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
                                    {cuentasPorCobrar.map((cuenta, index) => (
                                        <TableRow key={`${cuenta.cliente}-${index}`}>
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
                        )}
                    </CardContent>
                </Card>

                {/* Resumen de gastos vs ingresos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Gastos vs Ingresos</CardTitle>
                        <CardDescription>Balance del período actual (mes en curso)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!resumenFinanciero ? (
                            <Skeleton className="h-[200px] w-full" />
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-emerald-500/10 rounded-lg">
                                    <span className="font-medium text-emerald-700 dark:text-emerald-400">Ingresos</span>
                                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                        C${resumenFinanciero.ingresos.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-rose-500/10 rounded-lg">
                                    <span className="font-medium text-rose-700 dark:text-rose-400">Gastos</span>
                                    <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
                                        C${resumenFinanciero.egresos.toLocaleString()}
                                    </span>
                                </div>
                                <div className={`flex justify-between items-center p-4 rounded-lg border-2 ${resumenFinanciero.resultado >= 0
                                        ? "bg-primary/5 border-primary/20"
                                        : "bg-destructive/5 border-destructive/20"
                                    }`}>
                                    <span className="font-medium">Resultado</span>
                                    <span className={`text-2xl font-bold ${resumenFinanciero.resultado >= 0
                                            ? "text-primary"
                                            : "text-destructive"
                                        }`}>
                                        C${resumenFinanciero.resultado.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )}
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
                    {!proyeccionVentas ? (
                        <Skeleton className="h-[300px] w-full" />
                    ) : proyeccionVentas.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            No hay suficientes datos para generar proyecciones
                        </div>
                    ) : (
                        <>
                            <ChartContainer
                                config={{
                                    real: {
                                        label: "Ventas Reales",
                                        color: "var(--chart-1)",
                                    },
                                    proyectado: {
                                        label: "Proyección",
                                        color: "var(--chart-4)",
                                    },
                                }}
                                className="h-[300px] w-full overflow-hidden"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={proyeccionVentas.map((item, index, arr) => {
                                            // Logic to connect the lines:
                                            // The last "real" point should also be the start of "projected"
                                            const isLastReal = item.tipo === "real" && arr[index + 1]?.tipo === "proyectado";
                                            return {
                                                ...item,
                                                ventasReal: item.tipo === "real" ? item.ventas : null,
                                                ventasProyectado: item.tipo === "proyectado" || isLastReal ? item.ventas : null,
                                            };
                                        })}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="mes" />
                                        <YAxis />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="ventasReal"
                                            name="Ventas Reales"
                                            stroke="var(--chart-1)"
                                            strokeWidth={2}
                                            connectNulls={false}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="ventasProyectado"
                                            name="Proyección"
                                            stroke="var(--chart-4)"
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                            connectNulls={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                            <div className="mt-4 p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    Las proyecciones se basan en el análisis de tendencias históricas de ventas.
                                    Los valores proyectados se muestran con línea punteada.
                                </p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default EstadoFinanciero
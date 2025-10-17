"use client"


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Bell, Clock, FileDown, TrendingUp } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

interface Recordatorio {
    id: number
    clienteNombre: string
    fechaProgramada: string
    monto: number
    tipo: "cobro" | "recordatorio"
}

const morosos = [
    { nombre: "Carlos López", diasAtraso: 15, monto: 420 },
    { nombre: "Ana Martínez", diasAtraso: 7, monto: 280 },
    { nombre: "Pedro Gómez", diasAtraso: 22, monto: 470 },
]

const chartData = [
    { name: "Pagado", value: 65, color: "var(--chart-1)" },
    { name: "Pendiente", value: 25, color: "var(--chart-2)" },
    { name: "Vencido", value: 10, color: "var(--chart-3)" },
]

const chartConfig = {
    pagado: { label: "Pagado", color: "var(--chart-1)" },
    pendiente: { label: "Pendiente", color: "var(--chart-2)" },
    vencido: { label: "Vencido", color: "var(--chart-3)" },
}


const recordatorios: Recordatorio[] = [
    { id: 1, clienteNombre: "Juan Pérez", fechaProgramada: "06/10/2025", monto: 350, tipo: "cobro" },
    { id: 2, clienteNombre: "Carlos López", fechaProgramada: "07/10/2025", monto: 420, tipo: "cobro" },
    { id: 3, clienteNombre: "Ana López", fechaProgramada: "08/10/2025", monto: 320, tipo: "recordatorio" },
]

const RecordatoriosCobros = () => {

    const [notificacionesActivas, setNotificacionesActivas] = useState(true)

    const handleEnviarRecordatorio = () => {
        alert("envio flexi")
    }

    return (
        <div className='space-y-3'>
            {/* Notificaciones automáticas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notificaciones Automáticas
                    </CardTitle>
                    <CardDescription>Configura el envío automático de recordatorios de pago</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Activar recordatorios automáticos</Label>
                            <p className="text-muted-foreground text-sm">
                                Enviar mensaje automático 1 día antes del vencimiento
                            </p>
                        </div>
                        <Switch checked={notificacionesActivas} onCheckedChange={setNotificacionesActivas} />
                    </div>

                    <div className="bg-muted rounded-lg p-4">
                        <p className="mb-2 text-sm font-medium">Mensaje de ejemplo:</p>
                        <p className="text-muted-foreground text-sm italic">
                            Hola Juan Pérez, recuerda tu saldo pendiente de C$350. Puedes realizar tu pago en Pulpería San
                            José. ¡Gracias por tu preferencia!
                        </p>
                    </div>

                    <Button onClick={handleEnviarRecordatorio} className="w-full gap-2">
                        <Bell className="h-4 w-4" />
                        Enviar notificación de ejemplo
                    </Button>
                </CardContent>
            </Card>

            {/* Programación de cobros */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Programación de Cobros
                    </CardTitle>
                    <CardDescription>Cobros programados próximamente</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {recordatorios.map((rec) => (
                            <div key={rec.id} className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <p className="font-medium">{rec.clienteNombre}</p>
                                    <p className="text-muted-foreground text-sm">
                                        {rec.tipo === "cobro" ? "Cobro programado" : "Recordatorio"} - {rec.fechaProgramada}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">C${rec.monto.toLocaleString()}</p>
                                    <Badge variant="outline" className="mt-1">
                                        {rec.tipo}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" className="mt-4 w-full gap-2 bg-transparent">
                        <Clock className="h-4 w-4" />
                        Agregar programación
                    </Button>
                </CardContent>
            </Card>

            {/* Seguimiento de morosos */}
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Seguimiento de Morosos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 grid gap-4 md:grid-cols-2">
                        <div className="bg-destructive/10 rounded-lg p-4">
                            <p className="text-muted-foreground text-sm">Clientes morosos</p>
                            <p className="text-2xl font-bold text-destructive">{morosos.length}</p>
                        </div>
                        <div className="bg-destructive/10 rounded-lg p-4">
                            <p className="text-muted-foreground text-sm">Total vencido</p>
                            <p className="text-2xl font-bold text-destructive">
                                C${morosos.reduce((sum, m) => sum + m.monto, 0).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {morosos.map((moroso, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/10 p-3"
                            >
                                <div>
                                    <p className="font-medium">{moroso.nombre}</p>
                                    <p className="text-muted-foreground text-sm">{moroso.diasAtraso} días de atraso</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-destructive">C${moroso.monto.toLocaleString()}</p>
                                    <Badge variant="destructive" className="mt-1">
                                        Vencido
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Reportes de cartera */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Reportes de Cartera
                    </CardTitle>
                    <CardDescription>Distribución del estado de créditos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name} ${value}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    <div className="grid gap-2 md:grid-cols-3">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-1))" }} />
                            <span className="text-sm">Pagado 65%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-2))" }} />
                            <span className="text-sm">Pendiente 25%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-3))" }} />
                            <span className="text-sm">Vencido 10%</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full gap-2 bg-transparent">
                        <FileDown className="h-4 w-4" />
                        Exportar reporte PDF
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default RecordatoriosCobros
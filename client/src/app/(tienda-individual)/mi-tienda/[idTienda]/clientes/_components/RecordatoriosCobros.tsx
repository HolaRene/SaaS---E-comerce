"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../../../../convex/_generated/api"
import { Id } from "../../../../../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Bell, Clock, FileDown, TrendingUp, Loader2, Send, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const RecordatoriosCobros = ({ idTienda }: { idTienda: Id<"tiendas"> }) => {
    const [notificacionesActivas, setNotificacionesActivas] = useState(true)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [selectedClienteId, setSelectedClienteId] = useState<Id<"clientes"> | null>(null)
    const [recordatorioMonto, setRecordatorioMonto] = useState("")
    const [recordatorioFecha, setRecordatorioFecha] = useState("")
    const [recordatorioMensaje, setRecordatorioMensaje] = useState("")

    // Queries
    const recordatorios = useQuery(api.recordatorios.getRecordatoriosByTienda, {
        tiendaId: idTienda
    })

    const morosos = useQuery(api.recordatorios.getMorosos, {
        tiendaId: idTienda
    })

    const estadisticasCartera = useQuery(api.recordatorios.getEstadisticasCartera, {
        tiendaId: idTienda
    })

    // Usar la nueva query para obtener solo clientes con deuda
    const clientesConDeuda = useQuery(api.clientes.getClientesConDeuda, {
        tiendaId: idTienda
    })

    // Mutations
    const crearRecordatorio = useMutation(api.recordatorios.createRecordatorio)
    const enviarRecordatorio = useMutation(api.recordatorios.enviarRecordatorio)
    const eliminarRecordatorio = useMutation(api.recordatorios.deleteRecordatorio)

    // Preparar datos para el chart con colores más visibles
    const chartData = estadisticasCartera ? [
        { name: "Pagado", value: estadisticasCartera.pagado, color: "#22c55e" }, // Green-500
        { name: "Pendiente", value: estadisticasCartera.pendiente, color: "#3b82f6" }, // Blue-500
        { name: "Vencido", value: estadisticasCartera.vencido, color: "#ef4444" }, // Red-500
    ] : []

    const chartConfig = {
        pagado: { label: "Pagado", color: "#22c55e" },
        pendiente: { label: "Pendiente", color: "#3b82f6" },
        vencido: { label: "Vencido", color: "#ef4444" },
    }

    // Handlers
    const handleEnviarRecordatorio = async (recordatorioId: Id<"recordatorios">) => {
        try {
            await enviarRecordatorio({ recordatorioId })
            toast.success("Recordatorio enviado (integración WhatsApp pendiente)")
        } catch (error) {
            toast.error("Error al enviar recordatorio")
            console.error(error)
        }
    }

    const handleEliminarRecordatorio = async (recordatorioId: Id<"recordatorios">) => {
        try {
            await eliminarRecordatorio({ recordatorioId })
            toast.success("Recordatorio eliminado")
        } catch (error) {
            toast.error("Error al eliminar recordatorio")
            console.error(error)
        }
    }

    const handleCrearRecordatorio = async () => {
        if (!selectedClienteId || !recordatorioMonto || !recordatorioFecha) {
            toast.error("Completa todos los campos requeridos")
            return
        }

        // Encontrar el crédito del cliente seleccionado
        const clienteSeleccionado = clientesConDeuda?.find(c => c._id === selectedClienteId)
        const creditoId = clienteSeleccionado?.creditoId

        try {
            await crearRecordatorio({
                tiendaId: idTienda,
                clienteId: selectedClienteId,
                creditoId: creditoId, // Vincular con el crédito
                tipo: "cobro", // Asumimos cobro para que actualice fecha
                fechaProgramada: recordatorioFecha,
                monto: parseFloat(recordatorioMonto),
                mensaje: recordatorioMensaje || undefined,
                actualizarCredito: true // Flag para actualizar la fecha de vencimiento del crédito
            })

            toast.success("Recordatorio programado y fecha de vencimiento actualizada")
            setIsCreateDialogOpen(false)
            setSelectedClienteId(null)
            setRecordatorioMonto("")
            setRecordatorioFecha("")
            setRecordatorioMensaje("")
        } catch (error) {
            toast.error("Error al crear recordatorio")
            console.error(error)
        }
    }

    const handleEnviarNotificacionEjemplo = () => {
        toast.info("Integración con WhatsApp pendiente. Esta función enviará mensajes automáticos cuando esté configurada.")
    }

    // Efecto para pre-llenar el monto si se selecciona un cliente
    const handleClienteChange = (clienteId: Id<"clientes">) => {
        setSelectedClienteId(clienteId)
        const cliente = clientesConDeuda?.find(c => c._id === clienteId)
        if (cliente && cliente.saldoActual) {
            setRecordatorioMonto(cliente.saldoActual.toString())
        }
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
                            Hola [Cliente], recuerda tu saldo pendiente de C$[Monto]. Puedes realizar tu pago en [Tienda].
                            ¡Gracias por tu preferencia!
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Nota:</strong> La integración con WhatsApp está pendiente. Una vez configurada, los mensajes se enviarán automáticamente.
                        </p>
                    </div>

                    <Button onClick={handleEnviarNotificacionEjemplo} className="w-full gap-2" variant="outline">
                        <Bell className="h-4 w-4" />
                        Vista previa de notificación
                    </Button>
                </CardContent>
            </Card>

            {/* Programación de cobros */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Programación de Cobros
                            </CardTitle>
                            <CardDescription>Cobros programados próximamente</CardDescription>
                        </div>
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Bell className="h-4 w-4 mr-2" />
                                    Nuevo Recordatorio
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Programar Recordatorio</DialogTitle>
                                    <DialogDescription>Crea un recordatorio de pago para un cliente</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Cliente *</Label>
                                        <select
                                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                                            value={selectedClienteId || ""}
                                            onChange={(e) => handleClienteChange(e.target.value as Id<"clientes">)}
                                        >
                                            <option value="">Selecciona un cliente con deuda</option>
                                            {clientesConDeuda?.map((cliente) => (
                                                <option key={cliente._id} value={cliente._id}>
                                                    {cliente.nombre} - Saldo: C${cliente.saldoActual?.toLocaleString()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Monto *</Label>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={recordatorioMonto}
                                            onChange={(e) => setRecordatorioMonto(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Fecha programada *</Label>
                                        <Input
                                            type="date"
                                            value={recordatorioFecha}
                                            onChange={(e) => setRecordatorioFecha(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Mensaje personalizado (opcional)</Label>
                                        <Textarea
                                            placeholder="Mensaje adicional para el cliente..."
                                            value={recordatorioMensaje}
                                            onChange={(e) => setRecordatorioMensaje(e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                    <Button className="w-full" onClick={handleCrearRecordatorio}>
                                        Programar Recordatorio
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    {recordatorios === undefined ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : recordatorios.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No hay recordatorios programados
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recordatorios.map((recordatorio) => (
                                <div
                                    key={recordatorio._id}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div>
                                        <div className="font-medium">{recordatorio.clienteNombre}</div>
                                        <div className="text-muted-foreground text-sm">
                                            {new Date(recordatorio.fechaProgramada).toLocaleDateString('es-NI')} • C${recordatorio.monto.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={recordatorio.estado === "pendiente" ? "secondary" : "default"}>
                                            {recordatorio.estado}
                                        </Badge>
                                        {recordatorio.estado === "pendiente" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEnviarRecordatorio(recordatorio._id)}
                                            >
                                                <Send className="h-4 w-4 mr-1" />
                                                Enviar
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-destructive hover:text-destructive/90"
                                            onClick={() => handleEliminarRecordatorio(recordatorio._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Clientes morosos */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Clientes Morosos
                    </CardTitle>
                    <CardDescription>Clientes con pagos vencidos que requieren seguimiento</CardDescription>
                </CardHeader>
                <CardContent>
                    {morosos === undefined ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : morosos.length === 0 ? (
                        <div className="text-center py-8 text-green-600">
                            ¡Excelente! No hay clientes morosos
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {morosos.map((moroso, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/10 p-3"
                                >
                                    <div>
                                        <div className="font-medium">{moroso.nombre}</div>
                                        <div className="text-muted-foreground text-sm">
                                            {moroso.diasAtraso} días de atraso • C${moroso.monto.toLocaleString()}
                                        </div>
                                    </div>
                                    <Badge variant="destructive">{moroso.diasAtraso} días</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Distribución de cartera */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Distribución de Cartera
                    </CardTitle>
                    <CardDescription>Estado actual de los créditos</CardDescription>
                </CardHeader>
                <CardContent>
                    {estadisticasCartera === undefined ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Chart más grande */}
                            <ChartContainer config={chartConfig} className="mx-auto h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={120}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                            formatter={(value: number) => `${value}%`}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>

                            {/* Estadísticas detalladas */}
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <p className="text-muted-foreground text-sm">Total Créditos</p>
                                    <p className="text-2xl font-bold">{estadisticasCartera.totalCreditos}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-muted-foreground text-sm">Pagados</p>
                                    <p className="text-2xl font-bold text-green-600">{estadisticasCartera.pagado}%</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-muted-foreground text-sm">Vencidos</p>
                                    <p className="text-2xl font-bold text-destructive">{estadisticasCartera.vencido}%</p>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full gap-2">
                                <FileDown className="h-4 w-4" />
                                Exportar Reporte de Cartera
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default RecordatoriosCobros
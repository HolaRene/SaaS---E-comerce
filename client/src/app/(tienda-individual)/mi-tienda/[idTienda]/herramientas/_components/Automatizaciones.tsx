"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Clock, Download, FileText, Send, Settings2 } from "lucide-react"
import { toast } from "react-toastify"

interface LogAutomatizacion {
    fecha: string
    accion: string
    estado: "completado" | "error"
}

const logsAutomatizacion: LogAutomatizacion[] = [
    { fecha: "05/10/2025 14:30", accion: "Backup completado", estado: "completado" },
    { fecha: "04/10/2025 08:00", accion: "Reporte semanal enviado", estado: "completado" },
    { fecha: "03/10/2025 16:45", accion: "Alerta de stock: Pan Dulce", estado: "completado" },
    { fecha: "02/10/2025 09:00", accion: "Recordatorio de fiado enviado", estado: "completado" },
    { fecha: "01/10/2025 07:30", accion: "Backup completado", estado: "completado" },
]

const Automatizaciones = () => {
    const [alertasStockActivo, setAlertasStockActivo] = useState(true)
    const [recordatoriosFiadosActivo, setRecordatoriosFiadosActivo] = useState(true)
    const [reportesAutomaticosActivo, setReportesAutomaticosActivo] = useState(true)
    const [backupsActivo, setBackupsActivo] = useState(true)
    const [limiteStock, setLimiteStock] = useState(5)
    const [frecuenciaReporte, setFrecuenciaReporte] = useState("semanal")


    const handleEnviarReporte = () => {
        toast.success("El reporte ha sido enviado a tu WhatsApp.")
    }

    const handleDescargarBackup = () => {
        toast.success("Descargando backup")
    }
    const handleProbarNotificacion = () => {
        toast.success("Se ha enviado una notificación de prueba a tu WhatsApp.")
    }



    return (
        <div className='space-y-3'>
            <div className="grid gap-6 md:grid-cols-2">
                {/* Alertas de Stock */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Alertas de Stock
                        </CardTitle>
                        <CardDescription>Recibe avisos cuando el inventario esté bajo</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Enviar aviso automático cuando un producto tenga menos de {limiteStock} unidades.
                        </p>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="alertas-stock">Activar alertas</Label>
                            <Switch id="alertas-stock" checked={alertasStockActivo} onCheckedChange={setAlertasStockActivo} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="limite-stock">Límite mínimo</Label>
                            <Input
                                id="limite-stock"
                                type="number"
                                value={limiteStock}
                                onChange={(e) => setLimiteStock(Number(e.target.value))}
                                disabled={!alertasStockActivo}
                            />
                        </div>
                        {alertasStockActivo && (
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                    <CheckCircle className="h-4 w-4 inline mr-1" />
                                    Alertas activas
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recordatorios de Fiados */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Recordatorios de Fiados
                        </CardTitle>
                        <CardDescription>Notifica a clientes sobre créditos pendientes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Enviar mensaje automático 1 día antes del vencimiento del crédito.
                        </p>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="recordatorios-fiados">Activar recordatorios</Label>
                            <Switch
                                id="recordatorios-fiados"
                                checked={recordatoriosFiadosActivo}
                                onCheckedChange={setRecordatoriosFiadosActivo}
                            />
                        </div>
                        <Button
                            onClick={handleProbarNotificacion}
                            variant="outline"
                            className="w-full bg-transparent"
                            disabled={!recordatoriosFiadosActivo}
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Probar notificación
                        </Button>
                        {recordatoriosFiadosActivo && (
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                    <CheckCircle className="h-4 w-4 inline mr-1" />
                                    Recordatorios activos
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Reportes Automáticos */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Reportes Automáticos
                        </CardTitle>
                        <CardDescription>Recibe reportes de ventas periódicamente</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="reportes-automaticos">Activar reportes</Label>
                            <Switch
                                id="reportes-automaticos"
                                checked={reportesAutomaticosActivo}
                                onCheckedChange={setReportesAutomaticosActivo}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="frecuencia-reporte">Frecuencia</Label>
                            <Select
                                value={frecuenciaReporte}
                                onValueChange={setFrecuenciaReporte}
                                disabled={!reportesAutomaticosActivo}
                            >
                                <SelectTrigger id="frecuencia-reporte">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="diario">Diario</SelectItem>
                                    <SelectItem value="semanal">Semanal</SelectItem>
                                    <SelectItem value="mensual">Mensual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={handleEnviarReporte}
                            variant="outline"
                            className="w-full bg-transparent"
                            disabled={!reportesAutomaticosActivo}
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Enviar reporte ahora
                        </Button>
                        <div className="p-3 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground">
                                Reporte de ventas del día enviado a WhatsApp +505 8888-8888
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Backups Programados */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="h-5 w-5" />
                            Backups Programados
                        </CardTitle>
                        <CardDescription>Guarda copias de seguridad automáticas</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">Guardar copia de seguridad automática cada semana.</p>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="backups">Activar backups</Label>
                            <Switch id="backups" checked={backupsActivo} onCheckedChange={setBackupsActivo} />
                        </div>
                        <Button
                            onClick={handleDescargarBackup}
                            variant="outline"
                            className="w-full bg-transparent"
                            disabled={!backupsActivo}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Descargar backup manual
                        </Button>
                        {backupsActivo && (
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                    <CheckCircle className="h-4 w-4 inline mr-1" />
                                    Backups automáticos activos
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Logs de Automatizaciones */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings2 className="h-5 w-5" />
                        Registro de Actividad
                    </CardTitle>
                    <CardDescription>Historial de automatizaciones ejecutadas</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha y Hora</TableHead>
                                <TableHead>Acción</TableHead>
                                <TableHead>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logsAutomatizacion.map((log, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-mono text-sm">{log.fecha}</TableCell>
                                    <TableCell>{log.accion}</TableCell>
                                    <TableCell>
                                        {log.estado === "completado" ? (
                                            <Badge variant="default" className="bg-emerald-600">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Completado
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive">
                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                Error
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default Automatizaciones
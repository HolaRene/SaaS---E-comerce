"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Download, FileText } from "lucide-react"
import { exportAnalyticsData } from "../actions"

import { generateSalesData } from "@/lib/analytics-data"
import { toast } from "sonner"

export function ReportBuilder() {
    const [isPending, startTransition] = useTransition()
    const [reportName, setReportName] = useState("")
    const [format, setFormat] = useState<"excel" | "csv" | "pdf">("excel")
    const [includeCharts, setIncludeCharts] = useState(true)

    const handleExport = () => {
        if (!reportName) {
            toast("Por favor ingresa un nombre para el reporte")
            return
        }

        startTransition(async () => {
            const data = generateSalesData().slice(0, 100) // Sample data
            const result = await exportAnalyticsData({
                format,
                data,
                fileName: reportName,
                includeCharts,
            })

            if (result.success) {
                toast(result.message)
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Constructor de Reportes Personalizados</CardTitle>
                <CardDescription>Crea y exporta reportes con tus métricas seleccionadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reportName">Nombre del Reporte</Label>
                        <Input
                            id="reportName"
                            placeholder="Ej: Reporte Mensual de Ventas"
                            value={reportName}
                            onChange={(e) => setReportName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="format">Formato de Exportación</Label>
                        <Select value={format} onValueChange={(value) => setFormat(value as any)}>
                            <SelectTrigger id="format">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="excel">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Excel (.xlsx)
                                    </div>
                                </SelectItem>
                                <SelectItem value="csv">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        CSV (.csv)
                                    </div>
                                </SelectItem>
                                <SelectItem value="pdf">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        PDF (.pdf)
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="includeCharts"
                            checked={includeCharts}
                            onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                        />
                        <Label htmlFor="includeCharts" className="text-sm font-normal">
                            Incluir gráficos y visualizaciones
                        </Label>
                    </div>
                </div>

                <Button onClick={handleExport} disabled={isPending} className="w-full">
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generando reporte...
                        </>
                    ) : (
                        <>
                            <Download className="mr-2 h-4 w-4" />
                            Exportar Reporte
                        </>
                    )}
                </Button>

                <div className="rounded-lg border border-dashed p-4">
                    <h4 className="mb-2 text-sm font-medium">Templates Predefinidos</h4>
                    <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                            <FileText className="mr-2 h-4 w-4" />
                            Reporte Ejecutivo Mensual
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                            <FileText className="mr-2 h-4 w-4" />
                            Análisis de Performance por Tienda
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                            <FileText className="mr-2 h-4 w-4" />
                            Segmentación de Clientes
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

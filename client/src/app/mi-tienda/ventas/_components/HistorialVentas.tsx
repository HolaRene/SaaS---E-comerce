"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileDown, Printer } from "lucide-react"
import { useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"


interface Venta {
    id: string
    fecha: string
    cliente: string
    monto: number
    metodoPago: string
}


const HistorialVentas = () => {

    const [ventaSeleccionada, setVentaSeleccionada] = useState<Venta | null>(null)

    const ventas: Venta[] = [
        { id: "000145", fecha: "05/10/2025", cliente: "Juan Pérez", monto: 420.0, metodoPago: "Efectivo" },
        { id: "000146", fecha: "04/10/2025", cliente: "Ana López", monto: 275.0, metodoPago: "Tarjeta" },
        { id: "000147", fecha: "04/10/2025", cliente: "Carlos Gómez", monto: 180.0, metodoPago: "Transferencia" },
        { id: "000148", fecha: "03/10/2025", cliente: "María Sánchez", monto: 350.0, metodoPago: "Efectivo" },
    ]
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <CardTitle>Historial de Ventas</CardTitle>
                        <CardDescription>Consulta y exporta ventas pasadas</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 md:flex-row">
                        <Input type="date" className="w-auto" />
                        <Button variant="outline">
                            <FileDown className="mr-2 h-4 w-4" />
                            Exportar PDF
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-2 grid-cols-1">
                    <Card>
                        <CardContent className="pt-2">
                            <div className="text-2xl font-bold">C$12,450</div>
                            <p className="text-sm text-muted-foreground">Ventas totales</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-2">
                            <div className="text-2xl font-bold">45</div>
                            <p className="text-sm text-muted-foreground">Clientes atendidos</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-2">
                            <div className="text-2xl font-bold">C$276</div>
                            <p className="text-sm text-muted-foreground">Promedio de venta</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID Venta</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Monto</TableHead>
                                <TableHead>Método de Pago</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ventas.map((venta) => (
                                <TableRow key={venta.id}>
                                    <TableCell className="font-medium">#{venta.id}</TableCell>
                                    <TableCell>{venta.fecha}</TableCell>
                                    <TableCell>{venta.cliente}</TableCell>
                                    <TableCell>C${venta.monto.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{venta.metodoPago}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => setVentaSeleccionada(venta)}>
                                            Ver detalle
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            <Dialog open={!!ventaSeleccionada} onOpenChange={() => setVentaSeleccionada(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalle de Venta #{ventaSeleccionada?.id}</DialogTitle>
                        <DialogDescription>Información completa de la transacción</DialogDescription>
                    </DialogHeader>

                    {ventaSeleccionada && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Cliente:</span>
                                    <p className="font-medium">{ventaSeleccionada.cliente}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Fecha:</span>
                                    <p className="font-medium">{ventaSeleccionada.fecha}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Método de Pago:</span>
                                    <p className="font-medium">{ventaSeleccionada.metodoPago}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Total:</span>
                                    <p className="font-medium text-primary">C${ventaSeleccionada.monto.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Dialog: Detalle de Venta */}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setVentaSeleccionada(null)}>
                            Cerrar
                        </Button>
                        <Button>
                            <Printer className="mr-2 h-4 w-4" />
                            Reimprimir factura
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default HistorialVentas
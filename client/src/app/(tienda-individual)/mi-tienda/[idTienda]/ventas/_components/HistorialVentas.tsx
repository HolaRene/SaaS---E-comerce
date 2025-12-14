"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileDown, Printer } from "lucide-react"
import { useState, useMemo } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Id } from "../../../../../../../convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "../../../../../../../convex/_generated/api"
import { DataTableVentas } from "./TablaDatodVentas"
import { getColumnsVentas } from "./columnsVentas"

interface Permisos {
    canSell: boolean;
    role: string;
}

interface HistorialVentasProps {
    idTienda: Id<"tiendas">;
    permisos: Permisos;
}

const HistorialVentas = ({ idTienda, permisos }: HistorialVentasProps) => {
    // State para el diálogo de detalle
    const [ventaIdSeleccionada, setVentaIdSeleccionada] = useState<Id<"ventas"> | null>(null)

    // Queries de Convex (estas se mantienen aquí por paginación y especificidad)
    const ventas = useQuery(api.ventas.getVentasByTienda, { tiendaId: idTienda, limit: 50 })
    const estadisticas = useQuery(api.ventas.getEstadisticasVentas, { tiendaId: idTienda })

    // Solo fetching detalle si hay uno seleccionado
    const detalleVenta = useQuery(
        api.ventas.getDetalleVenta,
        ventaIdSeleccionada ? { ventaId: ventaIdSeleccionada } : "skip"
    )

    const columns = useMemo(() => getColumnsVentas(setVentaIdSeleccionada), [])

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
                            <div className="text-2xl font-bold">
                                C${estadisticas?.totalVentas.toFixed(2) || "0.00"}
                            </div>
                            <p className="text-sm text-muted-foreground">Ventas totales</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-2">
                            <div className="text-2xl font-bold">
                                {estadisticas?.clientesAtendidos || 0}
                            </div>
                            <p className="text-sm text-muted-foreground">Clientes atendidos</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-2">
                            <div className="text-2xl font-bold">
                                C${estadisticas?.promedioVenta.toFixed(2) || "0.00"}
                            </div>
                            <p className="text-sm text-muted-foreground">Promedio de venta</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="border rounded-lg p-4">
                    <DataTableVentas columns={columns} data={ventas || []} />
                </div>
            </CardContent>

            <Dialog open={!!ventaIdSeleccionada} onOpenChange={() => setVentaIdSeleccionada(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            Detalles de Venta #{ventaIdSeleccionada?.slice(-6)}
                        </DialogTitle>
                        <DialogDescription>Información completa de la transacción</DialogDescription>
                    </DialogHeader>

                    {detalleVenta && (
                        <div className="space-y-4">
                            {/* Información General */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Cliente:</span>
                                    <p className="font-medium">{detalleVenta.cliente?.nombre || "Cliente General"}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Fecha:</span>
                                    <p className="font-medium">
                                        {new Date(detalleVenta.fecha).toLocaleString('es-ES')}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Cajero:</span>
                                    <p className="font-medium">{detalleVenta.cajero || "N/A"}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Método de Pago:</span>
                                    <p className="font-medium capitalize">{detalleVenta.metodoPago}</p>
                                </div>
                            </div>

                            {/* Lista de Productos */}
                            <div>
                                <h4 className="font-semibold mb-2">Productos:</h4>
                                <div className="border rounded-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Producto</TableHead>
                                                <TableHead className="text-center">Cant.</TableHead>
                                                <TableHead className="text-right">Precio</TableHead>
                                                <TableHead className="text-right">Subtotal</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {detalleVenta.detalles.map((detalle) => (
                                                <TableRow key={detalle._id}>
                                                    <TableCell className="font-medium">
                                                        {detalle.nombreProducto}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {detalle.cantidad}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        C${detalle.precioUnitario.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        C${detalle.subtotal.toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Totales */}
                            <div className="space-y-2 pt-4 border-t">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal:</span>
                                    <span>C${detalleVenta.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Impuesto:</span>
                                    <span>C${detalleVenta.impuesto.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                    <span>Total:</span>
                                    <span className="text-primary">C${detalleVenta.total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Notas si existen */}
                            {detalleVenta.notas && (
                                <div className="pt-2">
                                    <span className="text-sm text-muted-foreground">Notas:</span>
                                    <p className="text-sm mt-1 p-2 bg-muted rounded">{detalleVenta.notas}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setVentaIdSeleccionada(null)}>
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
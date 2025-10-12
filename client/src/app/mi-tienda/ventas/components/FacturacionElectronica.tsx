"use client"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"


const facturas = [
    { id: "F-00124", cliente: "Juan Pérez", monto: 420.0, fecha: "05/10/2025", estado: "enviada" },
    { id: "F-00125", cliente: "Ana López", monto: 275.0, fecha: "05/10/2025", estado: "pendiente" },
]

const FacturacionElectronica = () => {

    return (
        <div className=''>
            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Generar Factura</CardTitle>
                        <CardDescription>Crea documentos fiscales para tus ventas</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium mb-2 block">Cliente</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="juan">Juan Pérez</SelectItem>
                                    <SelectItem value="ana">Ana López</SelectItem>
                                    <SelectItem value="carlos">Carlos Gómez</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="text-sm font-medium mb-2 block">Tipo de Documento</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ccf">CCF - Crédito Fiscal</SelectItem>
                                    <SelectItem value="consumidor">Factura Consumidor Final</SelectItem>
                                    <SelectItem value="nota">Nota de Crédito</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="text-sm font-medium mb-2 block">Método de Pago</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar método" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="efectivo">Efectivo</SelectItem>
                                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                    <SelectItem value="transferencia">Transferencia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className="w-full">
                            <Printer className="mr-2 h-4 w-4" />
                            Generar Factura
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Formato DGI Nicaragua</CardTitle>
                        <CardDescription>Vista previa del comprobante fiscal</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border-2 border-dashed rounded-lg p-6 space-y-4 bg-muted/30">
                            <div className="text-center border-b pb-4">
                                <h3 className="font-bold text-lg">Pulpería San José</h3>
                                <p className="text-sm text-muted-foreground">RUC: J0310000000000</p>
                                <p className="text-sm text-muted-foreground">Managua, Nicaragua</p>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Factura:</span>
                                    <span className="font-medium">001-001-00000145</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Fecha:</span>
                                    <span>05/10/2025</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Cliente:</span>
                                    <span>Juan Pérez</span>
                                </div>
                            </div>

                            <div className="border-t pt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Pan Dulce x2</span>
                                    <span>C$50.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Refresco 1L x1</span>
                                    <span>C$35.00</span>
                                </div>
                            </div>

                            <div className="border-t pt-4 space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal:</span>
                                    <span>C$85.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>IVA (15%):</span>
                                    <span>C$12.75</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2">
                                    <span>Total:</span>
                                    <span>C$97.75</span>
                                </div>
                            </div>

                            <div className="text-center text-sm text-muted-foreground border-t pt-4">
                                ¡Gracias por su compra!
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Historial Fiscal</CardTitle>
                    <CardDescription>Facturas generadas y su estado de envío</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {facturas.map((factura) => (
                                    <TableRow key={factura.id}>
                                        <TableCell className="font-medium">{factura.id}</TableCell>
                                        <TableCell>{factura.cliente}</TableCell>
                                        <TableCell>C${factura.monto.toFixed(2)}</TableCell>
                                        <TableCell>{factura.fecha}</TableCell>
                                        <TableCell>
                                            {factura.estado === "enviada" ? (
                                                <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">✅ Enviada</Badge>
                                            ) : (
                                                <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                                                    ⏳ Pendiente
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-green-600 hover:text-green-700 bg-transparent"
                                                onClick={() => alert(`se ha enviado al whatsaap la factura ${factura.id}`)}

                                            >
                                                <MessageCircle className="mr-2 h-4 w-4" />
                                                WhatsApp
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default FacturacionElectronica
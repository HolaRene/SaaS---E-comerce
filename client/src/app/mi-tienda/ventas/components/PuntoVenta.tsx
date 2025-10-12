"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Minus, Plus, Printer, Search, UserPlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface ProductoVenta {
    id: number
    nombre: string
    cantidad: number
    precioUnitario: number
}


const PuntoVenta = () => {

    const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoVenta[]>([
        { id: 1, nombre: "Pan Dulce", cantidad: 2, precioUnitario: 25.0 },
        { id: 2, nombre: "Refresco 1L", cantidad: 1, precioUnitario: 35.0 },
    ])

    const [metodoPago, setMetodoPago] = useState("efectivo")
    const [mostrarTicket, setMostrarTicket] = useState(false)

    const calcularSubtotal = () => {
        return productosSeleccionados.reduce((acc, prod) => acc + prod.cantidad * prod.precioUnitario, 0)
    }

    const calcularImpuesto = () => {
        return calcularSubtotal() * 0.05
    }

    const calcularTotal = () => {
        return calcularSubtotal() + calcularImpuesto()
    }

    const registrarVenta = () => {
        setMostrarTicket(true)
    }


    return (
        <div className="grid lg:grid-cols-3 gap-4 grid-cols-1">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Nueva Venta</CardTitle>
                        <CardDescription>Registra productos y completa la transacción</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Buscar producto..." className="pl-9" />
                            </div>
                            <Button variant="outline">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Nuevo cliente
                            </Button>
                        </div>

                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead className="text-center">Cantidad</TableHead>
                                        <TableHead className="text-right">Precio Unit.</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {productosSeleccionados.map((producto) => (
                                        <TableRow key={producto.id}>
                                            <TableCell className="font-medium">{producto.nombre}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-7 w-7 bg-transparent"
                                                        onClick={() => {
                                                            setProductosSeleccionados(
                                                                productosSeleccionados.map((p) =>
                                                                    p.id === producto.id ? { ...p, cantidad: Math.max(1, p.cantidad - 1) } : p,
                                                                ),
                                                            )
                                                        }}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center">{producto.cantidad}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-7 w-7 bg-transparent"
                                                        onClick={() => {
                                                            setProductosSeleccionados(
                                                                productosSeleccionados.map((p) =>
                                                                    p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p,
                                                                ),
                                                            )
                                                        }}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">C${producto.precioUnitario.toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                C${(producto.cantidad * producto.precioUnitario).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => {
                                                        setProductosSeleccionados(
                                                            productosSeleccionados.filter((p) => p.id !== producto.id),
                                                        )
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
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

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Resumen de Venta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium mb-2 block">Método de Pago</Label>
                            <Select value={metodoPago} onValueChange={setMetodoPago}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="efectivo">Efectivo</SelectItem>
                                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                    <SelectItem value="transferencia">Transferencia</SelectItem>
                                    <SelectItem value="fiado">Fiado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 pt-4 border-t">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <span>C${calcularSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Impuesto (5%):</span>
                                <span>C${calcularImpuesto().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                <span>Total:</span>
                                <span className="text-primary">C${calcularTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="space-y-2 pt-4">
                            <Button className="w-full" size="lg" onClick={registrarVenta}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Registrar Venta
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full bg-transparent"
                                onClick={() => setMostrarTicket(true)}
                            >
                                <Printer className="mr-2 h-4 w-4" />
                                Imprimir Ticket
                            </Button>
                            <Button variant="destructive" className="w-full">
                                Cancelar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Dialog open={mostrarTicket} onOpenChange={setMostrarTicket}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Ticket de Venta</DialogTitle>
                        <DialogDescription>Vista previa del comprobante</DialogDescription>
                    </DialogHeader>

                    <div className="border-2 border-dashed rounded-lg p-6 space-y-4 bg-muted/30">
                        <div className="text-center border-b pb-4">
                            <h3 className="font-bold text-lg">Pulpería San José</h3>
                            <p className="text-sm text-muted-foreground">Managua, Nicaragua</p>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Fecha:</span>
                                <span>05/10/2025</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Cajero:</span>
                                <span>José Espinoza</span>
                            </div>
                        </div>

                        <div className="border-t pt-4 space-y-2 text-sm">
                            {productosSeleccionados.map((prod) => (
                                <div key={prod.id} className="flex justify-between">
                                    <span>
                                        {prod.nombre} x{prod.cantidad}
                                    </span>
                                    <span>C${(prod.cantidad * prod.precioUnitario).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-1">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal:</span>
                                <span>C${calcularSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Impuesto:</span>
                                <span>C${calcularImpuesto().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Total:</span>
                                <span>C${calcularTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="text-center text-sm text-muted-foreground border-t pt-4">¡Gracias por su compra!</div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setMostrarTicket(false)}>
                            Cerrar
                        </Button>
                        <Button>
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PuntoVenta
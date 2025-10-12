"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock, Truck } from "lucide-react"
import { useState } from "react"

interface Pedido {
    id: string
    cliente: string
    monto: number
    fecha: string
    estado: "pendiente" | "preparacion" | "entrega"
    productos: { nombre: string; cantidad: number }[]
}

// datos

const pedidos: Pedido[] = [
    {
        id: "00124",
        cliente: "María López",
        monto: 350.0,
        fecha: "05/10/2025",
        estado: "pendiente",
        productos: [
            { nombre: "Arroz 1kg", cantidad: 2 },
            { nombre: "Frijoles 1kg", cantidad: 1 },
            { nombre: "Aceite 1L", cantidad: 1 },
        ],
    },
    {
        id: "00125",
        cliente: "Carlos Martínez",
        monto: 180.0,
        fecha: "05/10/2025",
        estado: "preparacion",
        productos: [
            { nombre: "Pan Dulce", cantidad: 5 },
            { nombre: "Leche 1L", cantidad: 2 },
        ],
    },
    {
        id: "00126",
        cliente: "Ana Rodríguez",
        monto: 520.0,
        fecha: "05/10/2025",
        estado: "entrega",
        productos: [
            { nombre: "Azúcar 2kg", cantidad: 3 },
            { nombre: "Café 500g", cantidad: 2 },
        ],
    },
]

const PedidosActivos = () => {
    const [filtroEstado, setFiltroEstado] = useState("todos")


    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null)



    const getEstadoBadge = (estado: string) => {
        const variants = {
            pendiente: "default",
            preparacion: "secondary",
            entrega: "outline",
        }
        const colors = {
            pendiente: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
            preparacion: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
            entrega: "bg-green-500/10 text-green-700 dark:text-green-400",
        }
        return { variant: variants[estado as keyof typeof variants], color: colors[estado as keyof typeof colors] }
    }

    const pedidosFiltrados = filtroEstado === "todos" ? pedidos : pedidos.filter((p) => p.estado === filtroEstado)
    return (
        <div className=''>
            <div className="flex flex-col md:flex-row gap-2 mb-6 ">
                <Button
                    variant={filtroEstado === "todos" ? "default" : "outline"}
                    onClick={() => setFiltroEstado("todos")}
                >
                    Todos
                </Button>
                <Button
                    variant={filtroEstado === "pendiente" ? "default" : "outline"}
                    onClick={() => setFiltroEstado("pendiente")}
                >
                    Pendientes
                </Button>
                <Button
                    variant={filtroEstado === "preparacion" ? "default" : "outline"}
                    onClick={() => setFiltroEstado("preparacion")}
                >
                    En preparación
                </Button>
                <Button
                    variant={filtroEstado === "entrega" ? "default" : "outline"}
                    onClick={() => setFiltroEstado("entrega")}
                >
                    Para entregar
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pedidosFiltrados.map((pedido) => {
                    const estadoBadge = getEstadoBadge(pedido.estado)
                    return (
                        <Card key={pedido.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">Pedido #{pedido.id}</CardTitle>
                                        <CardDescription className="mt-1">{pedido.cliente}</CardDescription>
                                    </div>
                                    <Badge className={estadoBadge.color}>
                                        {pedido.estado === "pendiente" && <Clock className="mr-1 h-3 w-3" />}
                                        {pedido.estado === "preparacion" && "👨‍🍳"}
                                        {pedido.estado === "entrega" && <Truck className="mr-1 h-3 w-3" />}
                                        {pedido.estado === "pendiente" && "Pendiente"}
                                        {pedido.estado === "preparacion" && "En preparación"}
                                        {pedido.estado === "entrega" && "Para entregar"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Monto:</span>
                                        <span className="font-semibold">C${pedido.monto.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Fecha:</span>
                                        <span>{pedido.fecha}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="flex-1 bg-transparent">
                                                Actualizar estado
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem >
                                                Pendiente
                                            </DropdownMenuItem>
                                            <DropdownMenuItem >
                                                En preparación
                                            </DropdownMenuItem>
                                            <DropdownMenuItem >
                                                Para entregar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button variant="outline" onClick={() => setPedidoSeleccionado(pedido)}>
                                        Ver detalle
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
            {/* Dialog: Detalle de Pedido */}
            <Dialog open={!!pedidoSeleccionado} onOpenChange={() => setPedidoSeleccionado(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalle del Pedido #{pedidoSeleccionado?.id}</DialogTitle>
                        <DialogDescription>Información completa del pedido</DialogDescription>
                    </DialogHeader>

                    {pedidoSeleccionado && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Cliente:</span>
                                    <p className="font-medium">{pedidoSeleccionado.cliente}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Fecha:</span>
                                    <p className="font-medium">{pedidoSeleccionado.fecha}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Productos:</h4>
                                <div className="space-y-2">
                                    {pedidoSeleccionado.productos.map((prod) => (
                                        <div key={prod.nombre} className="flex justify-between text-sm border-b pb-2">
                                            <span>{prod.nombre}</span>
                                            <span className="text-muted-foreground">x{prod.cantidad}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span className="text-primary">C${pedidoSeleccionado.monto.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPedidoSeleccionado(null)}>
                            Cerrar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PedidosActivos
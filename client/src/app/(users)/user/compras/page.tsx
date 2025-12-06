"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, Truck, ShoppingBag, Printer, FileDown } from "lucide-react"
import StatsCompras from "./_components/StatsCompras"
import { DataTableCompras } from "./_components/tablaCompras"
import { getColumnsCompras } from "./_components/columns-compras"
import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from "react"
import { Id } from "../../../../../convex/_generated/dataModel"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PurchasesTab() {
    // State para el diálogo de detalle
    const [compraIdSeleccionada, setCompraIdSeleccionada] = useState<Id<"compras"> | null>(null)

    // Obtener el usuario actual
    const { user: clerkUser, isLoaded } = useUser();

    // Obtener usuario de Convex
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    );

    // Obtener compras del usuario
    const compras = useQuery(
        api.compras.getComprasByUsuario,
        usuario?._id ? { usuarioId: usuario._id } : "skip"
    );

    // Obtener detalles de la compra seleccionada
    const detalleCompra = useQuery(
        api.compras.getDetallesCompra,
        compraIdSeleccionada ? { compraId: compraIdSeleccionada } : "skip"
    );

    // Obtener la compra seleccionada para mostrar info general en el modal
    const compraSeleccionadaInfo = compras?.find(c => c._id === compraIdSeleccionada);

    const columns = useMemo(() => getColumnsCompras((id) => setCompraIdSeleccionada(id as Id<"compras">)), []);

    // Estado de carga
    if (!isLoaded || !clerkUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner className="h-16 w-16" />
            </div>
        );
    }

    if (!usuario) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Cargando usuario...</p>
            </div>
        );
    }

    // Transformar datos de Convex al formato esperado por la tabla
    const ordersData = compras?.map((compra) => {
        // Determinar el ícono según el estado
        let icon = Clock;
        let statusColor = "warning";

        if (compra.estado === "entregado") {
            icon = CheckCircle;
            statusColor = "default";
        } else if (compra.estado === "enviado") {
            icon = Truck;
            statusColor = "secondary";
        }

        // Formatear la fecha
        const fecha = new Date(compra.fecha);
        const fechaFormateada = fecha.toLocaleDateString("es-NI", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        // Mapear estado a texto en español
        const estadoTexto: Record<string, string> = {
            pendiente: "Pendiente",
            en_preparacion: "En preparación",
            enviado: "Enviado",
            entregado: "Entregado",
            cancelado: "Cancelado",
        };

        return {
            id: compra.numeroOrden,
            realId: compra._id, // ID real para el click
            store: compra.nombreTienda,
            date: fechaFormateada,
            total: `C$${compra.total.toFixed(2)}`,
            status: estadoTexto[compra.estado] || compra.estado,
            statusColor,
            icon,
            items: [], // Los items se cargan en el modal
            subtotal: `C$${compra.subtotal.toFixed(2)}`,
            shipping: `C$${compra.costoEnvio.toFixed(2)}`,
        };
    }) || [];


    // Estado vacío
    if (compras && compras.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Mis compras</h2>
                    <p className="text-muted-foreground">Historial completo de tus pedidos</p>
                </div>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No tienes compras aún</h3>
                        <p className="text-muted-foreground text-center mb-6">
                            Explora nuestros productos y realiza tu primera compra
                        </p>
                        <Button>Explorar productos</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }


    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Mis compras</h2>
                <p className="text-muted-foreground">Historial completo de tus pedidos</p>
            </div>
            {/* Stats */}
            <StatsCompras />
            {/* Orders Table */}
            <Card>
                <CardContent className="p-0">
                    <DataTableCompras columns={columns} data={ordersData} />
                </CardContent>
            </Card>

            {/* Dialog de Detalles */}
            <Dialog open={!!compraIdSeleccionada} onOpenChange={() => setCompraIdSeleccionada(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            Detalle de Compra #{compraSeleccionadaInfo?.numeroOrden}
                        </DialogTitle>
                        <DialogDescription>Información completa de tu pedido</DialogDescription>
                    </DialogHeader>

                    {compraSeleccionadaInfo && detalleCompra && (
                        <div className="space-y-4">
                            {/* Información General */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Tienda:</span>
                                    <p className="font-medium">{compraSeleccionadaInfo.nombreTienda}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Fecha:</span>
                                    <p className="font-medium">
                                        {new Date(compraSeleccionadaInfo.fecha).toLocaleString('es-NI')}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Método de Pago:</span>
                                    <p className="font-medium capitalize">{compraSeleccionadaInfo.metodoPago}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Estado:</span>
                                    <p className="font-medium capitalize">{compraSeleccionadaInfo.estado.replace('_', ' ')}</p>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-muted-foreground">Dirección de Entrega:</span>
                                    <p className="font-medium">{compraSeleccionadaInfo.direccionEntrega}</p>
                                </div>
                            </div>

                            {/* Lista de Productos */}
                            <div>
                                <h4 className="font-semibold mb-2">Productos:</h4>
                                <div className="border rounded-lg max-h-[300px] overflow-y-auto">
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
                                            {detalleCompra.map((detalle) => (
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
                                    <span>C${compraSeleccionadaInfo.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Envío:</span>
                                    <span>C${compraSeleccionadaInfo.costoEnvio.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                    <span>Total:</span>
                                    <span className="text-primary">C${compraSeleccionadaInfo.total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Notas si existen */}
                            {compraSeleccionadaInfo.notas && (
                                <div className="pt-2">
                                    <span className="text-sm text-muted-foreground">Notas:</span>
                                    <p className="text-sm mt-1 p-2 bg-muted rounded">{compraSeleccionadaInfo.notas}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCompraIdSeleccionada(null)}>
                            Cerrar
                        </Button>
                        {/* <Button>
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimir
                        </Button> */}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

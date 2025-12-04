"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, Truck, ShoppingBag } from "lucide-react"
import StatsCompras from "./_components/StatsCompras"
import { DataTableCompras } from "./_components/tablaCompras"
import { columnsCompras } from "./_components/columns-compras"
import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

export default function PurchasesTab() {
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
            store: compra.nombreTienda,
            date: fechaFormateada,
            total: `C$${compra.total.toFixed(2)}`,
            status: estadoTexto[compra.estado] || compra.estado,
            statusColor,
            icon,
            items: [], // Los items se cargarían en un detalle expandido
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
                    <DataTableCompras columns={columnsCompras}
                        data={ordersData} />
                </CardContent>
            </Card>
        </div>
    )
}

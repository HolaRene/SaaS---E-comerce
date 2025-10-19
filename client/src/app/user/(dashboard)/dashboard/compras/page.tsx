"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, Truck } from "lucide-react"
import StatsCompras from "./_components/StatsCompras"
import { DataTableCompras } from "./_components/tablaCompras"
import { columnsCompras } from "./_components/columns-compras"



const orders = [
    {
        id: "00125",
        store: "Pulpería San José",
        date: "05/10/2025",
        total: "C$420",
        status: "En preparación",
        statusColor: "warning",
        icon: Clock,
        items: [
            { name: "Pan Dulce", quantity: 2, price: "C$50" },
            { name: "Café Tradicional", quantity: 1, price: "C$120" },
            { name: "Refresco 1L", quantity: 3, price: "C$105" },
            { name: "Arroz Premium 1lb", quantity: 5, price: "C$140" },
        ],
        subtotal: "C$415",
        shipping: "C$5",
    },
    {
        id: "00124",
        store: "Tienda La Esperanza",
        date: "04/10/2025",
        total: "C$180",
        status: "Entregado",
        statusColor: "default",
        icon: CheckCircle,
        items: [
            { name: "Frijoles Rojos 1lb", quantity: 3, price: "C$96" },
            { name: "Aceite Vegetal 1L", quantity: 1, price: "C$85" },
        ],
        subtotal: "C$181",
        shipping: "C$0",
    },
    {
        id: "00123",
        store: "Pulpería La Bendición",
        date: "03/10/2025",
        total: "C$95",
        status: "Entregado",
        statusColor: "default",
        icon: CheckCircle,
        items: [
            { name: "Pan Dulce", quantity: 3, price: "C$75" },
            { name: "Rosquillas", quantity: 1, price: "C$50" },
        ],
        subtotal: "C$125",
        shipping: "C$0",
    },
    {
        id: "00122",
        store: "Comercial Doña María",
        date: "02/10/2025",
        total: "C$340",
        status: "Entregado",
        statusColor: "default",
        icon: CheckCircle,
        items: [
            { name: "Detergente 1kg", quantity: 2, price: "C$180" },
            { name: "Jabón de baño", quantity: 4, price: "C$160" },
        ],
        subtotal: "C$340",
        shipping: "C$0",
    },
    {
        id: "00121",
        store: "Tienda El Buen Precio",
        date: "01/10/2025",
        total: "C$215",
        status: "Enviado",
        statusColor: "secondary",
        icon: Truck,
        items: [
            { name: "Refresco 2L", quantity: 4, price: "C$140" },
            { name: "Galletas", quantity: 3, price: "C$75" },
        ],
        subtotal: "C$215",
        shipping: "C$0",
    },
]

export default function PurchasesTab() {
    const [statusFilter, setStatusFilter] = useState("all")

    const filteredOrders = orders.filter((order) => {
        if (statusFilter === "all") return true
        return order.status.toLowerCase() === statusFilter.toLowerCase()
    })

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
                        data={filteredOrders} />
                </CardContent>
            </Card>
        </div>
    )
}

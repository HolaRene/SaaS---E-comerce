"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Clock } from "lucide-react"

const activeOrders = [
    {
        id: "00125",
        store: "Pulpería San José",
        status: "En preparación",
        total: "C$420",
        statusColor: "warning",
        icon: Clock,
    },
    {
        id: "00126",
        store: "Tienda La Esperanza",
        status: "Pendiente",
        total: "C$180",
        statusColor: "default",
        icon: AlertCircle,
    },
]

const OrdenesActivas = () => {
    return (
        <div className=''>
            {/* Active Orders */}
            <div>
                <h3 className="mb-4 text-xl font-semibold">Pedidos en curso</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    {activeOrders.map((order) => (
                        <Card key={order.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-base">Pedido #{order.id}</CardTitle>
                                        <CardDescription>{order.store}</CardDescription>
                                    </div>
                                    <Badge variant={order.statusColor as any} className="gap-1">
                                        <order.icon className="h-3 w-3" />
                                        {order.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold">{order.total}</span>
                                    <Button size="sm">Ver detalles</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OrdenesActivas
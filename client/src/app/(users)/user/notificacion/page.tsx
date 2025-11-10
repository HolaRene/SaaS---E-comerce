"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle2, Package, Tag, Settings, Search, Bell, BellOff, Store, TrendingDown, Truck } from "lucide-react"
import NotificacionOder from "./_components/notificacion-order"
import Notificacionpromocion from "./_components/notificacion-promocion"
import Notificacionprecios from "./_components/notificacion-precios"
import NotificacionSistema from "./_components/notificacion-sistema"

interface Notification {
    id: string
    type: "order" | "promotion" | "price" | "system"
    title: string
    message: string
    time: string
    read: boolean
    icon: React.ReactNode
}

export default function NotificationsTab() {
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "1",
            type: "order",
            title: "Pedido entregado",
            message: "Tu pedido #00125 fue entregado con éxito en tu dirección.",
            time: "Hace 2 horas",
            read: false,
            icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
        },
        {
            id: "2",
            type: "promotion",
            title: "Nueva promoción en Tienda San José",
            message: "2x1 en Refrescos Coca-Cola 1L. Válido hasta el domingo.",
            time: "Hace 5 horas",
            read: false,
            icon: <Tag className="h-5 w-5 text-amber-600" />,
        },
        {
            id: "3",
            type: "price",
            title: "Bajó de precio",
            message: "Café Presto Tradicional 500g ahora está a C$ 185.00 (antes C$ 210.00)",
            time: "Hace 1 día",
            read: false,
            icon: <TrendingDown className="h-5 w-5 text-blue-600" />,
        },
        {
            id: "4",
            type: "order",
            title: "Pedido en camino",
            message: "Tu pedido #00124 está en camino. Llegará en aproximadamente 30 minutos.",
            time: "Hace 1 día",
            read: true,
            icon: <Truck className="h-5 w-5 text-primary" />,
        },
        {
            id: "5",
            type: "promotion",
            title: "Descuento especial",
            message: "Panadería La Esperanza: 15% de descuento en pan dulce hoy.",
            time: "Hace 2 días",
            read: true,
            icon: <Tag className="h-5 w-5 text-amber-600" />,
        },
        {
            id: "6",
            type: "system",
            title: "Actualización del sistema",
            message: "Mantenimiento programado el 15/10 a las 2:00 AM. Duración estimada: 1 hora.",
            time: "Hace 3 días",
            read: true,
            icon: <Settings className="h-5 w-5 text-muted-foreground" />,
        },
        {
            id: "7",
            type: "order",
            title: "Pedido confirmado",
            message: "Tu pedido #00123 ha sido confirmado por Pulpería San José.",
            time: "Hace 4 días",
            read: true,
            icon: <Package className="h-5 w-5 text-primary" />,
        },
        {
            id: "8",
            type: "promotion",
            title: "Nueva tienda disponible",
            message: "Tienda El Ahorro ahora está disponible en tu zona. ¡Descubre sus productos!",
            time: "Hace 5 días",
            read: true,
            icon: <Store className="h-5 w-5 text-amber-600" />,
        },
    ])

    const markAsRead = (id: string) => {
        setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
    }

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
    }

    const filterNotifications = (type?: string) => {
        let filtered = notifications
        if (type && type !== "all") {
            filtered = filtered.filter((n) => n.type === type)
        }
        if (searchQuery) {
            filtered = filtered.filter(
                (n) =>
                    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    n.message.toLowerCase().includes(searchQuery.toLowerCase()),
            )
        }
        return filtered
    }

    const unreadCount = notifications.filter((n) => !n.read).length

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex gap-4 p-4 border rounded-lg">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    const NotificationCard = ({ notification }: { notification: Notification }) => (
        <div
            className={`flex gap-4 p-4 rounded-lg border transition-all duration-300 ${notification.read ? "bg-card" : "bg-accent/50 border-primary/20"
                } hover:bg-accent cursor-pointer`}
            onClick={() => markAsRead(notification.id)}
        >
            <div className="flex-shrink-0">{notification.icon}</div>
            <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-foreground">{notification.title}</h4>
                    {!notification.read && (
                        <Badge variant="default" className="h-5 px-2 text-xs">
                            Nuevo
                        </Badge>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
            </div>
        </div>
    )

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex  justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Centro de Notificaciones
                        </CardTitle>
                        <CardDescription>
                            {unreadCount > 0 ? `Tienes ${unreadCount} notificaciones sin leer` : "Todas las notificaciones leídas"}
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                        <BellOff className="h-4 w-4 mr-2" />
                        Marcar todas como leídas
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar notificaciones..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="all">Todas</TabsTrigger>
                        <TabsTrigger value="order">Pedidos</TabsTrigger>
                        <TabsTrigger value="promotion">Promociones</TabsTrigger>
                        <TabsTrigger value="price">Precios</TabsTrigger>
                        <TabsTrigger value="system">Sistema</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-6">
                        <ScrollArea className="h-[600px] pr-4">
                            <div className="space-y-3">
                                {filterNotifications().length > 0 ? (
                                    filterNotifications().map((notification) => (
                                        <NotificationCard key={notification.id} notification={notification} />
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">No se encontraron notificaciones</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="order" className="mt-6">
                        <NotificacionOder />
                    </TabsContent>

                    <TabsContent value="promotion" className="mt-6">
                        <Notificacionpromocion />
                    </TabsContent>

                    <TabsContent value="price" className="mt-6">
                        <Notificacionprecios />
                    </TabsContent>

                    <TabsContent value="system" className="mt-6">
                        <NotificacionSistema />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

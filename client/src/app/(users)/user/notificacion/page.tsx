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
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
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
    const [searchQuery, setSearchQuery] = useState("")
    const unreadCount = useQuery(api.notificaciones.getUnreadCount) ?? 0
    const rawNotifications = useQuery(api.notificaciones.getMisNotificaciones)

    const marcarLeido = useMutation(api.notificaciones.marcarLeido)
    const marcarTodas = useMutation(api.notificaciones.marcarTodasLeidas)

    const notifications: Notification[] = (rawNotifications || []).map((n) => {
        let icon = <Bell className="h-5 w-5 text-gray-500" />
        if (n.tipo === "nuevo_producto" || n.tipo === "producto_actualizado") icon = <Tag className="h-5 w-5 text-amber-600" />
        if (n.tipo === "precio_bajado") icon = <TrendingDown className="h-5 w-5 text-blue-600" />
        if (n.tipo === "tienda_datos_actualizados" || n.tipo === "tienda_nombre_cambiado") icon = <Store className="h-5 w-5 text-primary" />
        if (n.tipo === "sistema") icon = <Settings className="h-5 w-5 text-muted-foreground" />

        return {
            id: n._id,
            type: n.tipo === "precio_bajado" || n.tipo === "precio_subido" ? "price" :
                n.tipo === "nuevo_producto" ? "promotion" :
                    n.tipo === "sistema" ? "system" : "order", // Fallback mapping
            title: n.titulo,
            message: n.mensaje,
            time: new Date(n._creationTime).toLocaleDateString(), // Format as needed, maybe use a relative time lib
            read: n.leido,
            icon: icon,
        }
    })

    const markAsRead = async (id: string) => {
        // Optimistic update or just wait for Convex reactivity
        // For simplicity, we just call mutation. Convex updates the UI automatically.
        await marcarLeido({ id: id as any })
    }

    const markAllAsRead = async () => {
        await marcarTodas({})
    }

    const filterNotifications = (type?: string) => {
        let filtered = notifications
        if (type && type !== "all") {
            // Simplified mapping for the tabs
            if (type === "price") filtered = filtered.filter(n => n.type === "price")
            if (type === "promotion") filtered = filtered.filter(n => n.type === "promotion")
            if (type === "system") filtered = filtered.filter(n => n.type === "system")
            if (type === "order") filtered = filtered.filter(n => n.type === "order")
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

    if (rawNotifications === undefined) { // Loading state
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
            onClick={() => !notification.read && markAsRead(notification.id)}
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

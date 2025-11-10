"use client"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Sparkles, TrendingDown } from "lucide-react"

const notifications = [
    {
        type: "price-drop",
        message: 'Tu producto favorito "Café Tradicional" bajó de precio',
        product: "Café Tradicional",
        oldPrice: "C$140.00",
        newPrice: "C$120.00",
        icon: TrendingDown,
    },
    {
        type: "promotion",
        message: "Nueva promoción disponible en Pulpería San José",
        details: "3x2 en productos seleccionados",
        icon: Sparkles,
    },
    {
        type: "stock",
        message: 'El producto "Pan Dulce" está disponible nuevamente',
        store: "Pulpería La Bendición",
        icon: Bell,
    },
]

const NotificacionFavoritos = () => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Notificaciones personalizadas</CardTitle>
                        <CardDescription>Alertas sobre tus productos y tiendas favoritas</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                        Marcar todas como leídas
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {notifications.map((notification, index) => (
                        <div key={index} className="flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
                            <div className="mt-0.5 rounded-full bg-primary/10 p-2">
                                <notification.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">{notification.message}</p>
                                {notification.type === "price-drop" && (
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-muted-foreground line-through">{notification.oldPrice}</span>
                                        <span className="font-semibold text-green-600">{notification.newPrice}</span>
                                    </div>
                                )}
                                {notification.details && <p className="text-xs text-muted-foreground">{notification.details}</p>}
                                {notification.store && <p className="text-xs text-muted-foreground">{notification.store}</p>}
                            </div>
                            <Button variant="ghost" size="sm">
                                Ver
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default NotificacionFavoritos
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Store, ShoppingBag } from "lucide-react"

const recentActivity = [
    { type: "purchase", text: "Compraste en Pulpería San José", amount: "C$280", date: "05/10/2025" },
    { type: "save", text: "Guardaste el producto Refresco 1L", date: "04/10/2025" },
    { type: "follow", text: "Seguiste el comercio Tienda El Buen Precio", date: "03/10/2025" },
    { type: "purchase", text: "Compraste en Tienda La Esperanza", amount: "C$180", date: "02/10/2025" },
]



const storeNews = [
    {
        store: "Tienda El Buen Precio",
        news: "Nueva promoción: 3x2 en Refrescos 1L",
        image: "https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg",
    },
    {
        store: "Pulpería La Bendición",
        news: "Pan recién horneado disponible",
        image: "https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg",
    },
    {
        store: "Comercial Doña María",
        news: "Llegaron productos de limpieza",
        image: "https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg",
    },
]

const ActividadesNovedades = () => {
    return (
        <div className=''>
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actividad reciente</CardTitle>
                        <CardDescription>Tus últimas acciones en la plataforma</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                                    <div className="mt-1">
                                        {activity.type === "purchase" && <ShoppingBag className="h-4 w-4 text-blue-600" />}
                                        {activity.type === "save" && <Heart className="h-4 w-4 text-red-600" />}
                                        {activity.type === "follow" && <Store className="h-4 w-4 text-green-600" />}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{activity.text}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{activity.date}</span>
                                            {activity.amount && (
                                                <>
                                                    <span>•</span>
                                                    <span className="font-semibold text-foreground">{activity.amount}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Store News */}
                <Card>
                    <CardHeader>
                        <CardTitle>Novedades de tus comercios</CardTitle>
                        <CardDescription>Promociones y productos nuevos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {storeNews.map((news, index) => (
                                <div key={index} className="flex gap-3 border-b pb-3 last:border-0 last:pb-0">
                                    <img
                                        src={news.image || "/placeholder.svg"}
                                        alt={news.store}
                                        className="h-16 w-16 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-semibold">{news.store}</p>
                                        <p className="text-sm text-muted-foreground">{news.news}</p>
                                        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                            Ver tienda →
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ActividadesNovedades
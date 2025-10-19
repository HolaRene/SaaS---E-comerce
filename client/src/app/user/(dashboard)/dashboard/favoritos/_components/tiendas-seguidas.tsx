"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Store, } from "lucide-react"
const followedStores = [
    {
        name: "Pulpería San José",
        type: "Abarrotes y bebidas",
        logo: "https://images.pexels.com/photos/34272325/pexels-photo-34272325.jpeg",
        promotions: 3,
        newProducts: 5,
    },
    {
        name: "Tienda El Buen Precio",
        type: "Productos de limpieza",
        logo: "https://images.pexels.com/photos/34046298/pexels-photo-34046298.jpeg",
        promotions: 2,
        newProducts: 0,
    },
    {
        name: "Pulpería La Bendición",
        type: "Panadería y abarrotes",
        logo: "https://images.pexels.com/photos/34272325/pexels-photo-34272325.jpeg",
        promotions: 1,
        newProducts: 8,
    },
    {
        name: "Comercial Doña María",
        type: "Productos variados",
        logo: "https://images.pexels.com/photos/34046298/pexels-photo-34046298.jpeg",
        promotions: 0,
        newProducts: 3,
    },
    {
        name: "Tienda La Esperanza",
        type: "Frutas y verduras",
        logo: "https://images.pexels.com/photos/34046298/pexels-photo-34046298.jpeg",
        promotions: 4,
        newProducts: 12,
    },
]

const TiendasSeguidas = () => {
    return (
        <div>
            <h3 className="mb-4 text-xl font-semibold">Comercios seguidos</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {followedStores.map((store) => (
                    <Card key={store.name}>
                        <CardHeader>
                            <div className="flex items-start gap-3">
                                <img
                                    src={store.logo || "/placeholder.svg"}
                                    alt={store.name}
                                    className="h-12 w-12 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <CardTitle className="text-base text-balance">{store.name}</CardTitle>
                                    <CardDescription className="text-xs">{store.type}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex gap-2">
                                {store.promotions > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                        {store.promotions} promociones
                                    </Badge>
                                )}
                                {store.newProducts > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                        {store.newProducts} nuevos
                                    </Badge>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" className="flex-1">
                                    <Store className="mr-1 h-3 w-3" />
                                    Visitar
                                </Button>
                                <Button size="sm" variant="outline">
                                    Dejar de seguir
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default TiendasSeguidas
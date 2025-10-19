'use client'

import { Card, CardContent, } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, } from "lucide-react"

const recommendations = [
    { name: "Café Tradicional", price: "C$120.00", image: "https://images.pexels.com/photos/8250717/pexels-photo-8250717.jpeg" },
    { name: "Rosquillas Doña Chepita", price: "C$50.00", image: "https://images.pexels.com/photos/8250717/pexels-photo-8250717.jpeg" },
    { name: "Refresco 1L", price: "C$35.00", image: "https://images.pexels.com/photos/8250717/pexels-photo-8250717.jpeg" },
    { name: "Arroz Premium 1lb", price: "C$28.00", image: "https://images.pexels.com/photos/8250717/pexels-photo-8250717.jpeg" },
]

const Recomendaciones = () => {
    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold">Recomendaciones para ti</h3>
                    <p className="text-sm text-muted-foreground">Productos que podrían interesarte</p>
                </div>
                <Button variant="outline" size="sm">
                    Ver más
                </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {recommendations.map((product) => (
                    <Card key={product.name} className="overflow-hidden">
                        <img src={product.image || "/placeholder.svg"} alt={product.name} className="h-40 w-full object-cover" />
                        <CardContent className="p-4">
                            <h4 className="font-semibold text-balance">{product.name}</h4>
                            <p className="mt-2 text-lg font-bold text-primary">{product.price}</p>
                            <div className="mt-3 flex gap-2">
                                <Button size="sm" className="flex-1">
                                    Agregar
                                </Button>
                                <Button size="sm" variant="outline">
                                    <Heart className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Recomendaciones
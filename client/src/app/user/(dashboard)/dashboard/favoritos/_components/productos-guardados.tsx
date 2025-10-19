"use client"


import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"



const savedProducts = [
    {
        name: "Pan Dulce",
        price: "C$25.00",
        store: "Pulpería La Bendición",
        image: "https://images.pexels.com/photos/6617833/pexels-photo-6617833.jpeg",
    },
    {
        name: "Café Tradicional",
        price: "C$120.00",
        store: "Pulpería San José",
        image: "https://images.pexels.com/photos/8212187/pexels-photo-8212187.jpeg",
    },
    {
        name: "Refresco 1L",
        price: "C$35.00",
        store: "Tienda El Buen Precio",
        image: "https://images.pexels.com/photos/6617833/pexels-photo-6617833.jpeg",
    },
    {
        name: "Arroz Premium 1lb",
        price: "C$28.00",
        store: "Comercial Doña María",
        image: "https://images.pexels.com/photos/6617833/pexels-photo-6617833.jpeg",
    },
    {
        name: "Frijoles Rojos 1lb",
        price: "C$32.00",
        store: "Pulpería San José",
        image: "https://images.pexels.com/photos/8212187/pexels-photo-8212187.jpeg",
    },
    {
        name: "Aceite Vegetal 1L",
        price: "C$85.00",
        store: "Tienda La Esperanza",
        image: "https://images.pexels.com/photos/6617833/pexels-photo-6617833.jpeg",
    },
]



const ProductosGuardados = () => {
    return (
        <div>
            <h3 className="mb-4 text-xl font-semibold">Productos guardados</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {savedProducts.map((product) => (
                    <Card key={product.name} className="overflow-hidden">
                        <img src={product.image || "/placeholder.svg"} alt={product.name} className="h-48 w-full object-cover" />
                        <CardContent className="p-4">
                            <h4 className="font-semibold text-balance">{product.name}</h4>
                            <p className="text-xs text-muted-foreground">{product.store}</p>
                            <p className="mt-2 text-lg font-bold text-primary">{product.price}</p>
                            <div className="mt-3 flex gap-2">
                                <Button size="sm" className="flex-1">
                                    <ShoppingCart className="mr-1 h-3 w-3" />
                                    Agregar
                                </Button>
                                <Button size="sm" variant="outline">
                                    <Heart className="h-4 w-4 fill-current text-red-600" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default ProductosGuardados
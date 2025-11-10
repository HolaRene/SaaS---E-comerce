"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import CartItems from "./_components/CartItems"
import OrdernesSuma from "./_components/OrdernesSuma"
import { ShoppingBag } from "lucide-react"

interface CartItem {
    id: string
    name: string
    image: string
    price: number
    quantity: number
    store: string
    storeId: string
}

export default function CartTab() {
    const [isLoading, setIsLoading] = useState(false)
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: "1",
            name: "Café Presto Tradicional 500g",
            image: "/nicaraguan-coffee.jpg",
            price: 185.0,
            quantity: 2,
            store: "Pulpería San José",
            storeId: "store-1",
        },
        {
            id: "2",
            name: "Pan Dulce Artesanal (6 unidades)",
            image: "/fresh-bread-bakery.jpg",
            price: 45.0,
            quantity: 1,
            store: "Panadería La Esperanza",
            storeId: "store-2",
        },
        {
            id: "3",
            name: "Refresco Coca-Cola 1L",
            image: "/classic-coca-cola.png",
            price: 35.0,
            quantity: 3,
            store: "Pulpería San José",
            storeId: "store-1",
        },
        {
            id: "4",
            name: "Arroz Premium 1 libra",
            image: "/white-rice-bag.jpg",
            price: 28.0,
            quantity: 2,
            store: "Pulpería San José",
            storeId: "store-1",
        },
        {
            id: "5",
            name: "Detergente Ace 500g",
            image: "/assorted-cleaning-products.png",
            price: 65.0,
            quantity: 1,
            store: "Tienda El Ahorro",
            storeId: "store-3",
        },
    ])


    if (isLoading) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="h-24 w-24 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-8 w-32" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (cartItems.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Tu carrito está vacío</h3>
                    <p className="text-muted-foreground text-center mb-6">
                        Agrega productos de tus comercios favoritos para comenzar tu compra
                    </p>
                    <Button>Explorar productos</Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            {/* Cart Items */}
            <CartItems />
            {/* Order Summary */}
            <OrdernesSuma />
        </div>
    )
}

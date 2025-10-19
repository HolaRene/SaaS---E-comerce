"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface CartItem {
    id: string
    name: string
    image: string
    price: number
    quantity: number
    store: string
    storeId: string
}

const OrdernesSuma = () => {

    const [selectedStore, setSelectedStore] = useState<string>("all")
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

    const stores = Array.from(new Set(cartItems.map((item) => item.store)))
    const hasMultipleStores = stores.length > 1

    const filteredItems = selectedStore === "all" ? cartItems : cartItems.filter((item) => item.store === selectedStore)

    const subtotal = filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = 20.0
    const total = subtotal + shipping

    return (
        <div className="lg:col-span-1">
            <Card className="sticky top-20">
                <CardHeader>
                    <CardTitle>Resumen del pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium">C$ {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Envío</span>
                            <span className="font-medium">C$ {shipping.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span className="text-primary">C$ {total.toFixed(2)}</span>
                        </div>
                    </div>

                    {hasMultipleStores && selectedStore === "all" && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                            <p className="text-xs text-amber-800 dark:text-amber-200">
                                Selecciona un comercio específico para proceder al pago
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button className="w-full" size="lg" disabled={hasMultipleStores && selectedStore === "all"}>
                        Proceder al pago
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                        Seguir comprando
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default OrdernesSuma
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ShoppingBag, Store } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface CartItem {
    id: string
    name: string
    image: string
    price: number
    quantity: number
    store: string
    storeId: string
}

const CartItems = () => {

    const [selectedStore, setSelectedStore] = useState<string>("all")
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: "1",
            name: "Café Presto Tradicional 500g",
            image: "https://images.pexels.com/photos/2638026/pexels-photo-2638026.jpeg",
            price: 185.0,
            quantity: 2,
            store: "Pulpería San José",
            storeId: "store-1",
        },
        {
            id: "2",
            name: "Pan Dulce Artesanal (6 unidades)",
            image: "https://images.pexels.com/photos/2638026/pexels-photo-2638026.jpeg",
            price: 45.0,
            quantity: 1,
            store: "Panadería La Esperanza",
            storeId: "store-2",
        },
        {
            id: "3",
            name: "Refresco Coca-Cola 1L",
            image: "https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg",
            price: 35.0,
            quantity: 3,
            store: "Pulpería San José",
            storeId: "store-1",
        },
        {
            id: "4",
            name: "Arroz Premium 1 libra",
            image: "https://images.pexels.com/photos/2638026/pexels-photo-2638026.jpeg",
            price: 28.0,
            quantity: 2,
            store: "Pulpería San José",
            storeId: "store-1",
        },
        {
            id: "5",
            name: "Detergente Ace 500g",
            image: "https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg",
            price: 65.0,
            quantity: 1,
            store: "Tienda El Ahorro",
            storeId: "store-3",
        },
    ])

    const updateQuantity = (id: string, delta: number) => {
        setCartItems((items) =>
            items.map((item) => {
                if (item.id === id) {
                    const newQuantity = Math.max(1, item.quantity + delta)
                    return { ...item, quantity: newQuantity }
                }
                return item
            }),
        )
    }

    const removeItem = (id: string) => {
        setCartItems((items) => items.filter((item) => item.id !== id))
    }

    const stores = Array.from(new Set(cartItems.map((item) => item.store)))
    const hasMultipleStores = stores.length > 1

    const filteredItems = selectedStore === "all" ? cartItems : cartItems.filter((item) => item.store === selectedStore)

    return (
        <div className="lg:col-span-2 col-span-1 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Mi Carrito
                    </CardTitle>
                    <CardDescription>
                        {cartItems.length} {cartItems.length === 1 ? "producto" : "productos"} en tu carrito
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Store Selector - Only show if multiple stores */}
                    {hasMultipleStores && (
                        <div className="flex flex-col md:flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                            <Store className="h-5 w-5 text-amber-600" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                    Productos de múltiples comercios
                                </p>
                                <p className="text-xs text-amber-700 dark:text-amber-300">
                                    Selecciona un comercio para proceder al pago
                                </p>
                            </div>
                            <Select value={selectedStore} onValueChange={setSelectedStore}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Seleccionar comercio" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los comercios</SelectItem>
                                    {stores.map((store) => (
                                        <SelectItem key={store} value={store}>
                                            {store}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Cart Items List */}
                    <div className="space-y-4">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col md:flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                            >
                                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div>
                                        <h4 className="font-semibold text-foreground">{item.name}</h4>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Store className="h-3 w-3" />
                                            {item.store}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 bg-transparent"
                                                onClick={() => updateQuantity(item.id, -1)}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 bg-transparent"
                                                onClick={() => updateQuantity(item.id, 1)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-4 md:flex-row flex-col">
                                            <div className="text-right flex flex-col">
                                                <p className="text-sm text-muted-foreground">C$ {item.price.toFixed(2)} c/u</p>
                                                <p className="font-semibold text-primary">C$ {(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CartItems
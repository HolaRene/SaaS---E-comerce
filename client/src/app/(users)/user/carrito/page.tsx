"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CartItems from "./_components/CartItems"
import OrdernesSuma from "./_components/OrdernesSuma"
import { ShoppingBag, Loader2 } from "lucide-react"
import { useQuery } from "convex/react"
import { useUser } from "@clerk/nextjs"
import { api } from "../../../../../convex/_generated/api"
import { useRouter } from "next/navigation"

export default function CartTab() {
    const [selectedStore, setSelectedStore] = useState<string>("all")
    const { user: clerkUser } = useUser()
    const router = useRouter()

    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : 'skip'
    )

    const carritoItems = useQuery(
        api.carrito.getCarritoByUsuario,
        usuario?._id ? { usuarioId: usuario._id } : 'skip'
    )

    if (carritoItems === undefined) {
        return (
            <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (carritoItems.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Tu carrito está vacío</h3>
                    <p className="text-muted-foreground text-center mb-6">
                        Agrega productos de tus comercios favoritos para comenzar tu compra
                    </p>
                    <Button onClick={() => router.push('/product')}>Explorar productos</Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            {/* Cart Items */}
            <CartItems
                items={carritoItems}
                selectedStore={selectedStore}
                onSelectStore={setSelectedStore}
            />
            {/* Order Summary */}
            <OrdernesSuma
                items={carritoItems}
                selectedStore={selectedStore}
            />
        </div>
    )
}

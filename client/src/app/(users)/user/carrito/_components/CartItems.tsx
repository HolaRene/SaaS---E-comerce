"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ShoppingBag, Store } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery, useMutation } from "convex/react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { api } from "../../../../../../convex/_generated/api"
import { Id } from "../../../../../../convex/_generated/dataModel"
import Link from "next/link"
const CartItems = () => {
    const [selectedStore, setSelectedStore] = useState<string>("all")
    const { user: clerkUser } = useUser()
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : 'skip'
    )
    const carritoItems = useQuery(
        api.carrito.getCarritoByUsuario,
        usuario?._id ? { usuarioId: usuario._id } : 'skip'
    )
    const actualizarCantidad = useMutation(api.carrito.actualizarCantidad)
    const eliminarDelCarrito = useMutation(api.carrito.eliminarDelCarrito)
    const handleUpdateQuantity = async (itemId: Id<"carrito">, newQuantity: number) => {
        try {
            await actualizarCantidad({ itemId, cantidad: newQuantity })
        } catch (error: any) {
            toast.error(error.message || 'Error al actualizar cantidad')
        }
    }
    const handleRemoveItem = async (itemId: Id<"carrito">) => {
        try {
            await eliminarDelCarrito({ itemId })
            toast.success('Producto eliminado del carrito')
        } catch (error: any) {
            toast.error(error.message || 'Error al eliminar producto')
        }
    }
    if (carritoItems === undefined) {
        return (
            <div className="lg:col-span-2 col-span-1 flex justify-center py-8">
                <Spinner className="h-8 w-8 text-primary" />
            </div>
        )
    }
    const stores = Array.from(new Set(carritoItems.map((item) => item.tienda?.nombre || 'Tienda')))
    const hasMultipleStores = stores.length > 1
    const filteredItems = selectedStore === "all"
        ? carritoItems
        : carritoItems.filter((item) => item.tienda?.nombre === selectedStore)
    return (
        <div className="lg:col-span-2 col-span-1 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Mi Carrito
                    </CardTitle>
                    <CardDescription>
                        {carritoItems.length} {carritoItems.length === 1 ? "producto" : "productos"} en tu carrito
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    <div className="space-y-4">
                        {filteredItems.map((item) => (
                            <div
                                key={item._id}
                                className="flex flex-col md:flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                            >
                                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                                    <Link href={`/user/productos/${item.producto?._id}`}>
                                        <Image
                                            src={item.producto?.imagen || "/icons/producto-64.png"}
                                            alt={item.producto?.nombre || "Producto"}
                                            fill
                                            className="object-cover"
                                        />
                                    </Link>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div>
                                        <h4 className="font-semibold text-foreground">{item.producto?.nombre}</h4>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Store className="h-3 w-3" />
                                            {item.tienda?.nombre}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 bg-transparent"
                                                onClick={() => handleUpdateQuantity(item._id, Math.max(1, item.cantidad - 1))}
                                                disabled={item.cantidad <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center font-medium">{item.cantidad}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 bg-transparent"
                                                onClick={() => handleUpdateQuantity(item._id, item.cantidad + 1)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-4 md:flex-row flex-col">
                                            <div className="text-right flex flex-col">
                                                <p className="text-sm text-muted-foreground">C$ {item.precioUnitario.toFixed(2)} c/u</p>
                                                <p className="font-semibold text-primary">C$ {(item.precioUnitario * item.cantidad).toFixed(2)}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                onClick={() => handleRemoveItem(item._id)}
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
"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"

interface OrdernesSumaProps {
    items: any[]
    selectedStore: string
}

const OrdernesSuma = ({ items, selectedStore }: OrdernesSumaProps) => {
    const ruta = useRouter()

    const stores = Array.from(new Set(items.map((item) => item.tienda?.nombre || 'Tienda')))
    const hasMultipleStores = stores.length > 1

    const filteredItems = selectedStore === "all"
        ? items
        : items.filter((item) => item.tienda?.nombre === selectedStore)

    const subtotal = filteredItems.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0)
    const shipping = 20.0 // Esto podría ser dinámico por tienda en el futuro
    const total = subtotal + shipping

    const canCheckout = !hasMultipleStores || selectedStore !== "all"

    return (
        <div className="lg:col-span-1">
            <Card className="sticky top-20">
                <CardHeader>
                    <CardTitle>Resumen del pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Lista de productos en el resumen */}
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">Productos ({filteredItems.length})</p>
                        <ScrollArea className="h-[200px] pr-4">
                            <div className="space-y-3">
                                {filteredItems.map((item) => (
                                    <div key={item._id} className="flex justify-between text-sm">
                                        <div className="flex-1 pr-4">
                                            <span className="line-clamp-1">{item.producto?.nombre}</span>
                                            <span className="text-xs text-muted-foreground">x{item.cantidad}</span>
                                        </div>
                                        <span className="font-medium">C$ {(item.precioUnitario * item.cantidad).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    <Separator />

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
                    <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        size="lg"
                        onClick={() => {
                            if (!canCheckout) return;
                            const tiendaFinal = (!hasMultipleStores && selectedStore === "all") ? stores[0] : selectedStore;
                            ruta.push(`/user/carrito/checar?tienda=${encodeURIComponent(tiendaFinal)}`);
                        }}
                        disabled={!canCheckout}
                    >
                        Proceder al pago
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" onClick={() => ruta.push('/user/productos')}>
                        Seguir comprando
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default OrdernesSuma
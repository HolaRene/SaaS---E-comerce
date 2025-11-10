"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductSearch } from "./product-search"
import { StockByStoreTable } from "./stock-by-store-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { InventoryProduct } from "@/lib/inventory-types"
import { Package, TrendingUp, DollarSign, Calendar } from "lucide-react"
import { mockInventoryProducts } from "@/lib/data-inventory"
import { getProductStock } from "../actions"

export function ProductDrilldownTab() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null)
    const [isPending, startTransition] = useTransition()

    // Filter products based on search
    const filteredProducts = mockInventoryProducts.filter(
        (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const handleSelectProduct = (sku: string) => {
        startTransition(async () => {
            const product = await getProductStock(sku)
            setSelectedProduct(product)
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "optimal":
                return "secondary"
            case "low":
                return "default"
            case "critical":
                return "destructive"
            case "overstock":
                return "default"
            default:
                return "secondary"
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Búsqueda de Productos</CardTitle>
                    <CardDescription>Busca productos por nombre o SKU para ver detalles de stock</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ProductSearch value={searchQuery} onChange={setSearchQuery} />

                    {searchQuery && (
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">{filteredProducts.length} productos encontrados</p>
                            <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                                {filteredProducts.map((product) => (
                                    <Button
                                        key={product.id}
                                        variant="outline"
                                        className="justify-start h-auto py-3 bg-transparent"
                                        onClick={() => handleSelectProduct(product.sku)}
                                        disabled={isPending}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="text-left">
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    SKU: {product.sku} • {product.category}
                                                </p>
                                            </div>
                                            <Badge variant={getStatusColor(product.status)}>{product.status}</Badge>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {selectedProduct && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle>{selectedProduct.name}</CardTitle>
                                    <CardDescription>SKU: {selectedProduct.sku}</CardDescription>
                                </div>
                                <Badge variant={getStatusColor(selectedProduct.status)}>{selectedProduct.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="flex items-center gap-3">
                                    <Package className="h-8 w-8 text-muted-foreground" />
                                    <div>
                                        <p className="text-2xl font-bold">{selectedProduct.totalStock}</p>
                                        <p className="text-xs text-muted-foreground">Stock Total</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                                    <div>
                                        <p className="text-2xl font-bold">${selectedProduct.inventoryValue.toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">Valor Inventario</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                                    <div>
                                        <p className="text-2xl font-bold">{selectedProduct.turnoverRate}x</p>
                                        <p className="text-xs text-muted-foreground">Rotación</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-8 w-8 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-bold">{selectedProduct.lastMovement.toLocaleDateString("es")}</p>
                                        <p className="text-xs text-muted-foreground">Último Movimiento</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Stock por Tienda</CardTitle>
                            <CardDescription>Distribución de inventario en {selectedProduct.stores.length} tiendas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StockByStoreTable product={selectedProduct} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sugerencias de Optimización</CardTitle>
                            <CardDescription>Recomendaciones basadas en análisis de stock y rotación</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {selectedProduct.status === "critical" && (
                                    <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                                        <p className="font-medium text-destructive">⚠️ Acción Urgente Requerida</p>
                                        <p className="text-sm mt-1">
                                            Stock crítico detectado. Realizar pedido urgente o transferir desde tiendas con exceso.
                                        </p>
                                    </div>
                                )}
                                {selectedProduct.status === "overstock" && (
                                    <div className="rounded-lg border bg-muted p-4">
                                        <p className="font-medium">💡 Oportunidad de Optimización</p>
                                        <p className="text-sm mt-1">
                                            Exceso de stock detectado. Considerar redistribución o promoción especial.
                                        </p>
                                    </div>
                                )}
                                {selectedProduct.status === "optimal" && (
                                    <div className="rounded-lg border border-green-500 bg-green-500/10 p-4">
                                        <p className="font-medium text-green-700">✓ Stock Óptimo</p>
                                        <p className="text-sm mt-1">Los niveles de inventario están balanceados en todas las tiendas.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

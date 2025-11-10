"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { InventoryProduct } from "@/lib/inventory-types"
import { Package, TrendingUp, Calendar } from "lucide-react"
import { useState } from "react"

interface StockByStoreTableProps {
    product: InventoryProduct
}

export function StockByStoreTable({ product }: StockByStoreTableProps) {
    const [sortBy, setSortBy] = useState<"quantity" | "turnover" | "daysOfStock">("quantity")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

    const sortedStores = [...product.stores].sort((a, b) => {
        const multiplier = sortOrder === "asc" ? 1 : -1
        return (a[sortBy] - b[sortBy]) * multiplier
    })

    const handleSort = (column: typeof sortBy) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortBy(column)
            setSortOrder("desc")
        }
    }

    const getStockStatus = (quantity: number, minStock: number, maxStock: number) => {
        if (quantity === 0) return { label: "Agotado", variant: "destructive" as const }
        if (quantity < minStock) return { label: "Bajo", variant: "destructive" as const }
        if (quantity > maxStock) return { label: "Exceso", variant: "default" as const }
        return { label: "Óptimo", variant: "secondary" as const }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tienda</TableHead>
                        <TableHead>
                            <Button variant="ghost" size="sm" onClick={() => handleSort("quantity")} className="h-8 px-2">
                                <Package className="mr-2 h-4 w-4" />
                                Stock
                            </Button>
                        </TableHead>
                        <TableHead>Rango</TableHead>
                        <TableHead>
                            <Button variant="ghost" size="sm" onClick={() => handleSort("turnover")} className="h-8 px-2">
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Rotación
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button variant="ghost" size="sm" onClick={() => handleSort("daysOfStock")} className="h-8 px-2">
                                <Calendar className="mr-2 h-4 w-4" />
                                Días Stock
                            </Button>
                        </TableHead>
                        <TableHead>Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedStores.map((store) => {
                        const status = getStockStatus(store.quantity, store.minStock, store.maxStock)
                        return (
                            <TableRow key={store.storeId}>
                                <TableCell className="font-medium">{store.storeName}</TableCell>
                                <TableCell className="text-2xl font-bold">{store.quantity}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {store.minStock} - {store.maxStock}
                                </TableCell>
                                <TableCell>{store.turnover.toFixed(1)}x</TableCell>
                                <TableCell>{store.daysOfStock} días</TableCell>
                                <TableCell>
                                    <Badge variant={status.variant}>{status.label}</Badge>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

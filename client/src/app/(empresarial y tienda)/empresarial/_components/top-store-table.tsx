"use client"

import { useState } from "react"
import { ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StorePerformance } from "@/lib/datos.empresarial"

/**
 * TopStoresTable Component
 * Displays top performing stores in a sortable table
 * Shows sales, growth, orders, and status with color-coded badges
 */

interface TopStoresTableProps {
    stores: StorePerformance[]
}

export function TopStoresTable({ stores }: TopStoresTableProps) {
    const [sortedStores, setSortedStores] = useState(stores)
    const [sortField, setSortField] = useState<"sales" | "growth" | "orders">("sales")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

    // Sort stores by selected field
    const handleSort = (field: "sales" | "growth" | "orders") => {
        const direction = sortField === field && sortDirection === "desc" ? "asc" : "desc"
        setSortField(field)
        setSortDirection(direction)

        const sorted = [...sortedStores].sort((a, b) => {
            if (direction === "desc") {
                return b[field] - a[field]
            }
            return a[field] - b[field]
        })

        setSortedStores(sorted)
    }

    // Format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
        }).format(value)
    }

    // Get badge variant based on status
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "excellent":
                return <Badge className="bg-chart-3 text-white">Excelente</Badge>
            case "good":
                return <Badge variant="secondary">Bueno</Badge>
            case "warning":
                return <Badge className="bg-chart-4 text-white">Atención</Badge>
            case "critical":
                return <Badge variant="destructive">Crítico</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <Card className="shadow-sm col-span-full lg:col-span-2">
            <CardHeader>
                <CardTitle>Top 5 Tiendas</CardTitle>
                <CardDescription>Rendimiento por tienda - Ordenable por métricas clave</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tienda</TableHead>
                            <TableHead>Región</TableHead>
                            <TableHead>
                                <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => handleSort("sales")}>
                                    Ventas
                                    <ArrowUpDown className="h-3 w-3" />
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => handleSort("growth")}>
                                    Crecimiento
                                    <ArrowUpDown className="h-3 w-3" />
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => handleSort("orders")}>
                                    Pedidos
                                    <ArrowUpDown className="h-3 w-3" />
                                </Button>
                            </TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedStores.map((store) => (
                            <TableRow key={store.storeId}>
                                <TableCell className="font-medium">{store.storeName}</TableCell>
                                <TableCell>{store.region}</TableCell>
                                <TableCell>{formatCurrency(store.sales)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        {store.growth > 0 ? (
                                            <TrendingUp className="h-4 w-4 text-chart-3" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4 text-chart-5" />
                                        )}
                                        <span className={store.growth > 0 ? "text-chart-3" : "text-chart-5"}>
                                            {store.growth > 0 ? "+" : ""}
                                            {store.growth}%
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>{store.orders.toLocaleString()}</TableCell>
                                <TableCell>{getStatusBadge(store.status)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

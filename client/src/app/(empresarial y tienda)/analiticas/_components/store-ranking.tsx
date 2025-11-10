"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Trophy, Medal, Award } from "lucide-react"
import { getPerformanceMetrics } from "@/lib/analytics-data"

type RankingCriteria = "sales" | "efficiency" | "growth" | "transactions"

export function StoreRanking() {
    const [criteria, setCriteria] = useState<RankingCriteria>("sales")
    const metrics = getPerformanceMetrics()

    const sortedMetrics = [...metrics].sort((a, b) => {
        switch (criteria) {
            case "sales":
                return b.actualSales - a.actualSales
            case "efficiency":
                return b.efficiency - a.efficiency
            case "growth":
                return b.trendPercentage - a.trendPercentage
            case "transactions":
                return b.transactions - a.transactions
            default:
                return 0
        }
    })

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
        if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
        if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
        return <span className="text-sm font-semibold text-muted-foreground">{rank}</span>
    }

    const getTrendIcon = (trend: string, percentage: number) => {
        if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />
        if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />
        return <Minus className="h-4 w-4 text-gray-500" />
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Ranking de Tiendas</CardTitle>
                        <CardDescription>Clasificación por diferentes criterios de desempeño</CardDescription>
                    </div>
                    <Select value={criteria} onValueChange={(value) => setCriteria(value as RankingCriteria)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sales">Ventas Totales</SelectItem>
                            <SelectItem value="efficiency">Eficiencia</SelectItem>
                            <SelectItem value="growth">Crecimiento</SelectItem>
                            <SelectItem value="transactions">Transacciones</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px]">Rank</TableHead>
                            <TableHead>Tienda</TableHead>
                            <TableHead>Región</TableHead>
                            <TableHead className="text-right">Ventas</TableHead>
                            <TableHead className="text-right">Eficiencia</TableHead>
                            <TableHead className="text-right">Tendencia</TableHead>
                            <TableHead className="text-right">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedMetrics.map((store, index) => (
                            <TableRow key={store.storeId}>
                                <TableCell className="flex items-center justify-center">{getRankIcon(index + 1)}</TableCell>
                                <TableCell className="font-medium">{store.storeName}</TableCell>
                                <TableCell>{store.region}</TableCell>
                                <TableCell className="text-right font-mono">${(store.actualSales / 1000000).toFixed(2)}M</TableCell>
                                <TableCell className="text-right">
                                    <Badge
                                        variant={store.efficiency >= 100 ? "default" : store.efficiency >= 90 ? "secondary" : "destructive"}
                                    >
                                        {store.efficiency.toFixed(1)}%
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {getTrendIcon(store.trend, store.trendPercentage)}
                                        <span
                                            className={`text-sm ${store.trend === "up" ? "text-green-600" : store.trend === "down" ? "text-red-600" : "text-gray-600"}`}
                                        >
                                            {store.trendPercentage > 0 ? "+" : ""}
                                            {store.trendPercentage.toFixed(1)}%
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    {store.gap >= 0 ? (
                                        <Badge variant="default" className="bg-green-500">
                                            Objetivo cumplido
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive">{store.gapPercentage.toFixed(1)}% bajo</Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

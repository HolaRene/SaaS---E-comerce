"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Package } from "lucide-react"


const orderStats = [
    { label: "Total de pedidos", value: "24", icon: Package },
    { label: "Pedidos pendientes", value: "2", icon: Clock },
    { label: "Total gastado", value: "C$12,450", icon: CheckCircle },
]

const StatsCompras = () => {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {orderStats.map((stat) => (
                <Card key={stat.label}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default StatsCompras
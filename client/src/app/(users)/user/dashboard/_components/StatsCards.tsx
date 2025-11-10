"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Package, Store } from "lucide-react"

const stats = [
    { label: "Pedidos activos", value: "2", icon: Package, color: "text-blue-600" },
    { label: "Productos guardados", value: "12", icon: Heart, color: "text-red-600" },
    { label: "Comercios seguidos", value: "5", icon: Store, color: "text-green-600" },
]

const StatsCards = () => {
    return (
        <div className=''>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default StatsCards
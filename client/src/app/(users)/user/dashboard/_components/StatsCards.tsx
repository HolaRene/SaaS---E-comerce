"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Package, Store } from "lucide-react"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"

const StatsCards = ({ idUser }: { idUser: Id<"usuarios"> }) => {
    // Fetch real data
    const estadisticasCompras = useQuery(api.compras.getEstadisticasCompras, { usuarioId: idUser });
    const favoritosProductos = useQuery(api.favoritos.getFavoritosProductosByUsuario, { usuarioId: idUser });
    const favoritosTiendas = useQuery(api.favoritos.getFavoritosTiendasByUsuario, { usuarioId: idUser });

    const stats = [
        {
            label: "Pedidos activos",
            value: estadisticasCompras?.comprasPendientes?.toString() || "0",
            icon: Package,
            color: "text-blue-600"
        },
        {
            label: "Productos guardados",
            value: favoritosProductos?.length?.toString() || "0",
            icon: Heart,
            color: "text-red-600"
        },
        {
            label: "Comercios seguidos",
            value: favoritosTiendas?.length?.toString() || "0",
            icon: Store,
            color: "text-green-600"
        },
    ]

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
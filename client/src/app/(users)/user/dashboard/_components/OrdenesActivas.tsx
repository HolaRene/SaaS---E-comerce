"use client"

import { useQuery } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from "./data-table"
import { columnsOrdenes, OrdenActiva } from "./columns-ordenes"


const OrdenesActivas = () => {
    const ordenes = useQuery(api.dashboard.getOrdenesActivas);

    if (ordenes === undefined) {
        return <div className="space-y-4">
            <h3 className="mb-4 text-xl font-semibold">Pedidos en curso</h3>
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-[150px] w-full" />
                <Skeleton className="h-[150px] w-full" />
            </div>
        </div>
    }

    if (ordenes.length === 0) {
        return null; // O un mensaje de "No tienes pedidos activos"
    }

    return (
        <div className=''>
            {/* Active Orders */}
            <div>
                <h3 className="mb-4 text-xl font-semibold">Pedidos en curso</h3>
                <DataTable columns={columnsOrdenes} data={ordenes as OrdenActiva[]} />
            </div>
        </div>
    )
}

export default OrdenesActivas

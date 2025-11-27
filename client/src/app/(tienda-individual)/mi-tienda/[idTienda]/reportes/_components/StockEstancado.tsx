"use client"

import { Id } from "../../../../../../../convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "../../../../../../../convex/_generated/api"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableCatalogo } from "./data-table"

type StalledItem = {
    productoId: any
    producto: string
    unidades: number
    diasSinVenta: number | null
    diasDesdeCreacion: number | null
}

const columns: ColumnDef<StalledItem, any>[] = [
    {
        accessorKey: "producto",
        header: "Producto",
        cell: info => info.getValue() as string,
    },
    {
        accessorKey: "unidades",
        header: "Unidades",
        cell: info => `C${info.getValue()}`,
    },
    {
        accessorKey: "diasSinVenta",
        header: "Días sin venta",
        cell: info => {
            const v = info.getValue() as number | null
            return v === null ? "—" : `${v} días`
        },
    },
    {
        accessorKey: "diasDesdeCreacion",
        header: "Días desde creación",
        cell: info => {
            const v = info.getValue() as number | null
            return v === null ? "—" : `${v} días`
        },
    },
]

export default function StockEstancado({ idTienda }: { idTienda: Id<"tiendas"> }) {
    const id = idTienda
    // usar umbral por defecto de 3 días para evitar listar productos nuevos
    const query = useQuery(api.productos.getStockEstancadoByTienda, { tiendaId: id, dias: 3, limit: 50 })
    const data = (query ?? []) as StalledItem[]

    return <DataTableCatalogo columns={columns} data={data} />
}

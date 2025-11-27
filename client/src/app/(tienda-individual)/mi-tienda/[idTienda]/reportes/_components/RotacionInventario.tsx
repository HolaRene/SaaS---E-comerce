"use client"

import { Id } from "../../../../../../../convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "../../../../../../../convex/_generated/api"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableCatalogo } from "./data-table"

type RotItem = {
    productoId: any
    producto: string
    entradas: number
    salidas: number
    stock: number
    diasEnInventario: number | null
    diasDesdeCreacion: number | null
}

const columns: ColumnDef<RotItem, any>[] = [
    {
        accessorKey: "producto",
        header: "Producto",
        cell: info => info.getValue() as string,
    },
    {
        accessorKey: "entradas",
        header: "Entradas",
        cell: info => info.getValue(),
    },
    {
        accessorKey: "salidas",
        header: "Salidas",
        cell: info => info.getValue(),
    },
    {
        accessorKey: "stock",
        header: "Stock",
        cell: info => info.getValue(),
    },
    {
        accessorKey: "diasEnInventario",
        header: "Días desde última venta",
        cell: info => {
            const v = info.getValue() as number | null
            return v === null ? "—" : `${v} días`
        }
    },
    {
        accessorKey: "diasDesdeCreacion",
        header: "Días desde creación",
        cell: info => {
            const v = info.getValue() as number | null
            return v === null ? "—" : `${v} días`
        }
    }
]

export default function RotacionInventario({ idTienda }: { idTienda: Id<"tiendas"> }) {
    const id = idTienda
    const query = useQuery(api.productos.getRotacionInventarioByTienda, { tiendaId: id, limit: 50 })
    const data = (query ?? []) as RotItem[]
    return <DataTableCatalogo columns={columns} data={data} />
}

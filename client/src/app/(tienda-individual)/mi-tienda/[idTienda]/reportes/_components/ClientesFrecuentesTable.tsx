"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableClientesFrecuentes } from "./data-tableClientesFrecientes"

type ClienteRow = {
    nombre: string
    compras: number
    promedioMensual?: number
    ultimaCompra?: string
}

const columns: ColumnDef<ClienteRow, any>[] = [
    {
        accessorKey: "nombre",
        header: "Nombre",
        cell: info => info.getValue() as string,
    },
    {
        accessorKey: "compras",
        header: "Compras Totales",
        cell: info => info.getValue(),
    },
    {
        accessorKey: "promedioMensual",
        header: "Promedio Mensual",
        cell: info => `C$${(info.getValue() as number || 0).toLocaleString()}`,
    },
    {
        accessorKey: "ultimaCompra",
        header: "Última Compra",
        cell: info => info.getValue() || "—",
    },
]

export default function ClientesFrecuentesTable({ data }: { data: ClienteRow[] }) {
    const rows = React.useMemo(() => data ?? [], [data])
    return <DataTableClientesFrecuentes columns={columns} data={rows} />
}

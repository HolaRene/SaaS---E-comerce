"use client";

import { ColumnDef } from "@tanstack/react-table";

import * as React from "react";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { Id } from "../../../../../../../convex/_generated/dataModel";



type MovimientosProps = {
    productoNombre: string;
    usuarioNombre: string;
    _id: Id<"movimientosInventario">;
    _creationTime: number;
    notas?: string | undefined;
    usuarioId: Id<"usuarios">;
    tipo: "ENTRADA" | "SALIDA" | "AJUSTE" | "TRANSFERENCIA";
    tiendaId: Id<"tiendas">;
    cantidad: number;
    fecha: string;
    productoId: Id<"productos">;
    stockAnterior: number;
    stockNuevo: number;
    razon: string;
}


export const columnsControlInventario: ColumnDef<MovimientosProps>[] = [
    {
        accessorKey: "fecha",
        header: "Fecha",
        cell: ({ row }) => <p className="text-sm">{new Date(row.original.fecha).toLocaleDateString()}</p>,
        filterFn: "includesString",
    },
    {
        accessorKey: "producto",
        header: "Producto",
        filterFn: "includesString",
        cell: ({ row }) => <p className="text-sm">{row.original.productoNombre}</p>
        ,
    },
    {
        accessorKey: "tipo",
        header: "Tipo",
        cell: ({ row }) => <p className="text-sm">{row.original.tipo}</p>
        ,
    },
    {
        accessorKey: "cantidad",
        header: "Cantidad",
        cell: ({ row }) => <p className=" text-sm">{row.original.tipo === 'ENTRADA' ? '+' : '-'}{row.original.cantidad}</p>
    },
    {
        accessorKey: "usuario",
        header: "Usuario",
        cell: ({ row }) => <p className="text-sm">{row.original.usuarioNombre}</p>
    },

];



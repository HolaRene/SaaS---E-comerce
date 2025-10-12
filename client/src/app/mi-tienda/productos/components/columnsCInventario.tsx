"use client";

import { ColumnDef } from "@tanstack/react-table";

import * as React from "react";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";


type MovimientosProps = { id: number; fecha: string; producto: string; tipo: string; cantidad: number; usuario: string; }


export const columnsControlInventario: ColumnDef<MovimientosProps>[] = [
    {
        accessorKey: "fecha",
        header: "Fecha",
        cell: ({ row }) => <p className="text-sm">{row.original.fecha}</p>,
        filterFn: "includesString",
    },
    {
        accessorKey: "producto",
        header: "Producto",
        filterFn: "includesString",
        cell: ({ row }) => <p className="text-sm">{row.original.producto}</p>
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
        cell: ({ row }) => <p className=" text-sm">{row.original.tipo === 'Entrada' ? '+' : '-'}{row.original.cantidad}</p>
    },
    {
        accessorKey: "usuario",
        header: "Usuario",
        cell: ({ row }) => <p className="text-sm">{row.original.usuario}</p>
    },

];



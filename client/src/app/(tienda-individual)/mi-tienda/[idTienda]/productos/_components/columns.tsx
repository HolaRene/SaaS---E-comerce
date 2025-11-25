"use client";

import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { Doc } from "../../../../../../../convex/_generated/dataModel";

// Tipo de producto de Convex
type ProductoConvex = Doc<"productos">;

export const columns: ColumnDef<ProductoConvex>[] = [
    {
        accessorKey: "imagenes",
        header: " Imagen",
        cell: ({ row }) => {
            const imagenes = row.original.imagenes;
            const imagenUrl = imagenes && imagenes.length > 0
                ? imagenes[0]
                : 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg';
            return <Image src={imagenUrl} alt={row.original.nombre} width={50} height={50} className="rounded-md" />
        },
        filterFn: "includesString",
    },
    {
        accessorKey: "nombre",
        header: "Nombre",
        filterFn: "includesString",
        cell: ({ row }) => <p className="font-medium">{row.original.nombre}</p>
        ,
    },
    {
        accessorKey: "categoria",
        header: "Categoría",
        cell: ({ row }) => <p className="font-medium">{row.original.categoria}</p>
        ,
    },
    {
        accessorKey: "precio",
        header: "Precio",
        cell: ({ row }) => <p className="font-medium">C${row.original.precio.toFixed(2)}</p>
    },
    {
        accessorKey: "cantidad",
        header: "Stock",
        cell: ({ row }) => <p className="font-medium">{row.original.cantidad}</p>
    },
    {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => {
            const estado = row.original.estado;
            const variant = estado === 'activo' ? 'default' : estado === 'agotado' ? 'destructive' : 'secondary';
            return <Badge variant={variant}>{estado}</Badge>
        }

    },
    {
        accessorKey: "",
        header: "Acciones",
        cell: () => <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />Ver Detalle</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500"><Trash className="mr-2 h-4 w-4" />Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    }

];

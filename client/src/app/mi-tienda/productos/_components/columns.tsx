"use client";

import { ColumnDef } from "@tanstack/react-table";

import * as React from "react";



export type Catalogo = {
    id: number;
    nombre: string;
    img: string;
    categoria: string;
    precio: number;
    stock: number;
    estado: string;
};

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";

export const columns: ColumnDef<Catalogo>[] = [
    {
        accessorKey: "img",
        header: " Imagen",
        cell: ({ row }) => <Image src={row.original.img} alt={row.original.nombre} width={50} height={50} className="rounded-md" />,
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
        accessorKey: "stock",
        header: "Estock",
        cell: ({ row }) => <p className="font-medium">{row.original.stock}</p>
    },
    {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => <Badge variant={row.original.estado === 'Disponible' ? 'default' : row.original.estado === 'Agotado' ? 'destructive' : 'secondary'}>{row.original.estado}</Badge>

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



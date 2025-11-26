"use client";

import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { toast } from "sonner";
import { Eye, MoreHorizontal, Trash } from "lucide-react";
import EditarProducto from "./EditarProducto";
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
        cell: ({ row }) => <ActionsMenu producto={row.original} />
    }

]

function ActionsMenu({ producto }: { producto: ProductoConvex }) {
    const eliminarProducto = useMutation(api.productos.eliminarProducto);

    const handleEliminar = async () => {
        const ok = confirm(`¿Eliminar producto "${producto.nombre}"? Esta acción no se puede deshacer.`)
        if (!ok) return
        try {
            await eliminarProducto({ productoId: producto._id })
            toast.success("Producto eliminado")
            // Convex actualizará las queries suscritas; no recargamos la página para mejor UX
        } catch (err) {
            console.error(err)
            toast.error("No se pudo eliminar el producto")
        }
    }

    return (
        <div className="flex items-center gap-2">
            <EditarProducto producto={producto} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => alert('Ver detalle no implementado aún')}><Eye className="mr-2 h-4 w-4" />Ver Detalle</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500" onSelect={handleEliminar}><Trash className="mr-2 h-4 w-4" />Eliminar</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )

};

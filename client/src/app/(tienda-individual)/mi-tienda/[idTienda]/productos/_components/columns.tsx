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
import { Eye, Lock, MoreHorizontal, Pencil, Trash } from "lucide-react";
import EditarProducto from "./EditarProducto";
import { Doc } from "../../../../../../../convex/_generated/dataModel";

// Tipo de producto de Convex
type ProductoConvex = Doc<"productos">;

interface Permisos {
    canManageProducts: boolean;
    canAdjustStock: boolean;
    role: string;
}

export const columns: ColumnDef<ProductoConvex>[] = [
    {
        accessorKey: "imagenes",
        header: " Imagen",
        cell: ({ row }) => {
            const imagenes = row.original.imagenes;
            const imagenUrl = imagenes && imagenes.length > 0
                ? imagenes[0]
                : '/icons/producto-nuevo-64.png';
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
        id: "acciones",
        header: "Acciones",
        cell: ({ row, table }) => {
            const meta = table.options.meta as { permisos?: Permisos } | undefined;
            const permisos = meta?.permisos;

            return <ActionsMenu producto={row.original} permisos={permisos} />
        }
    }

]

// Componente para las acciones
function ActionsMenu({ producto, permisos }: { producto: ProductoConvex, permisos?: Permisos }) {
    const eliminarProducto = useMutation(api.productos.eliminarProducto);

    // Si no hay permisos definidos, asumimos falso por seguridad, o true si era comportamiento default
    // En este caso, si no se pasan, asumimos que no tiene permisos de gestión.
    const canManage = permisos?.canManageProducts ?? false;

    const handleEliminar = async () => {
        if (!canManage) {
            toast.error("No tienes permiso para eliminar productos");
            return;
        }

        const ok = confirm(`¿Eliminar producto "${producto.nombre}"? Esta acción no se puede deshacer.`)
        if (!ok) return
        try {
            await eliminarProducto({ productoId: producto._id })
            toast.success("Producto eliminado")
        } catch (err) {
            console.error(err)
            toast.error("No se pudo eliminar el producto")
        }
    }

    return (
        <div className="flex items-center gap-2">
            {canManage ? (
                <EditarProducto producto={producto} />
            ) : (
                <Button variant="ghost" size="icon" disabled title="Solo lectura">
                    <Lock className="h-4 w-4 opacity-50" />
                </Button>
            )}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => alert('Ver detalle no implementado aún')}>
                        <Eye className="mr-2 h-4 w-4" />Ver Detalle
                    </DropdownMenuItem>

                    {canManage && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-500 hover:text-red-600 focus:text-red-600 focus:bg-red-50"
                                onSelect={handleEliminar}
                            >
                                <Trash className="mr-2 h-4 w-4" />Eliminar
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
};

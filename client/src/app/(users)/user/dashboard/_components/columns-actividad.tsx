"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Heart, Store, ShoppingBag } from "lucide-react";

// Estructura de los datos de actividad
export type Actividad = {
    id: string;
    tipo: "compra" | "favorito_tienda" | "favorito_producto";
    fecha: number;
    nombreTienda: string;
    nombreProducto?: string;
    monto?: number;
    estado?: string;
};

export const columnsActividad: ColumnDef<Actividad>[] = [
    {
        accessorKey: "tipo",
        header: "Tipo",
        cell: ({ row }) => {
            const tipo = row.getValue("tipo") as string;
            return (
                <div className="flex items-center">
                    {tipo === "compra" && <ShoppingBag className="h-4 w-4 text-blue-600" />}
                    {tipo === "favorito_tienda" && <Store className="h-4 w-4 text-green-600" />}
                    {tipo === "favorito_producto" && <Heart className="h-4 w-4 text-red-600" />}
                </div>
            );
        },
    },
    {
        accessorKey: "detalle", // Virtual column for description
        header: "Detalle",
        cell: ({ row }) => {
            const activity = row.original;
            return (
                <div>
                    <p className="font-medium text-sm">
                        {activity.tipo === "compra" ? `Compra en ${activity.nombreTienda || 'Tienda'}` :
                            activity.tipo === "favorito_tienda" ? `Seguiste a ${activity.nombreTienda || 'Tienda'}` :
                                `Te gustó ${activity.nombreProducto || 'un producto'}`}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: "fecha",
        header: "Fecha",
        cell: ({ row }) => {
            return <div className="text-sm text-muted-foreground">{new Date(row.getValue("fecha")).toLocaleDateString()}</div>;
        },
    },
    {
        accessorKey: "monto",
        header: "Monto",
        cell: ({ row }) => {
            const monto = row.getValue("monto");
            if (!monto) return <span className="text-muted-foreground">-</span>;
            return <div className="font-medium">C${monto as number}</div>;
        },
    },
    {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => {
            const estado = row.getValue("estado") as string;
            if (!estado) return <span className="text-muted-foreground">-</span>;
            return <div className="capitalize text-sm">{estado.replace("_", " ")}</div>;
        },
    },
];

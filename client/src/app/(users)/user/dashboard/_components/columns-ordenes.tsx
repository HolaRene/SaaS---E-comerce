"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Clock, AlertCircle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type OrdenActiva = {
    _id: string;
    numeroOrden: string;
    nombreTienda: string;
    total: number;
    estado: string;
    _creationTime: number;
};

const statusVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    entregada: "default",
    pendiente: "secondary",
    cancelada: "destructive",
    enviada: "outline",
    en_proceso: "secondary",
    en_preparacion: "secondary"
};

const statusIcons: Record<string, any> = {
    entregada: CheckCircle2,
    pendiente: AlertCircle,
    cancelada: AlertCircle,
    enviada: Package,
    en_proceso: Clock,
    en_preparacion: Clock
}

export const columnsOrdenes: ColumnDef<OrdenActiva>[] = [
    {
        accessorKey: "numeroOrden",
        header: "Orden",
        cell: ({ row }) => <span className="font-medium">#{row.getValue("numeroOrden")}</span>,
    },
    {
        accessorKey: "nombreTienda",
        header: "Tienda",
    },
    {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => {
            const estado = row.getValue("estado") as string;
            const Icon = statusIcons[estado] || AlertCircle;
            return (
                <Badge variant={statusVariants[estado] || "secondary"} className="gap-1 capitalize">
                    <Icon className="h-3 w-3" />
                    {estado.replace("_", " ")}
                </Badge>
            );
        },
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => <span className="font-bold">C${row.getValue("total")}</span>,
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <Link href="/user/compras">
                <Button size="sm" variant="ghost">Ver</Button>
            </Link>
        ),
    },
];

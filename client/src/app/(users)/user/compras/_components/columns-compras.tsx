"use client";

import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import {
    CheckCircle,
    Clock,
    Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type Compras = {
    id: string;
    realId: string; // ID real de Convex
    store: string;
    date: string;
    total: string;
    status: string;
    statusColor: string;
    icon: React.ForwardRefExoticComponent<
        Omit<React.SVGProps<SVGSVGElement>, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    items: {
        name: string;
        quantity: number;
        price: string;
    }[];
    subtotal: string;
    shipping: string;
};

const statusVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    Entregado: "default",
    Pendiente: "secondary",
    Cancelado: "destructive",
    Enviado: "outline",
};

// 🔹 Función para generar columnas con acción de ver detalles
export const getColumnsCompras = (
    onViewDetails: (id: string) => void
): ColumnDef<Compras>[] => [
        {
            accessorKey: "id",
            header: "ID Pedido",
            cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
        },
        {
            accessorKey: "store",
            header: "Tienda",
            cell: ({ row }) => <p>{row.original.store}</p>,
        },
        {
            accessorKey: "date",
            header: "Fecha",
            cell: ({ row }) => <p>{row.original.date}</p>,
        },
        {
            accessorKey: "total",
            header: "Total",
            cell: ({ row }) => <p className="font-medium">{row.original.total}</p>,
        },
        {
            accessorKey: "status",
            header: "Estado",
            cell: ({ row }) => (
                <Badge variant={statusVariants[row.original.statusColor] || "secondary"} className="gap-1">
                    <row.original.icon className="h-3 w-3" />
                    {row.original.status}
                </Badge>
            ),
        },
        {
            id: "acciones",
            header: "Acciones",
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(row.original.realId)}
                >
                    Ver detalles
                </Button>
            ),
        },
    ];
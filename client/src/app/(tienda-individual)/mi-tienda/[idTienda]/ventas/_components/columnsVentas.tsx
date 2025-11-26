"use client";

import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye } from "lucide-react";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export type VentasProps = {
    _id: Id<"ventas">;
    _creationTime: number;
    clienteNombre: string;
    cajeroNombre?: string;
    clienteId?: Id<"clientes">;
    notas?: string;
    estado?: "pendiente" | "completada" | "cancelada";
    usuarioId: Id<"usuarios">;
    tiendaId: Id<"tiendas">;
    fecha: string;
    subtotal: number;
    impuesto: number;
    total: number;
    metodoPago: "efectivo" | "tarjeta" | "transferencia" | "fiado";
}

export const getColumnsVentas = (onVerDetalle: (id: Id<"ventas">) => void): ColumnDef<VentasProps>[] => [
    {
        accessorKey: "_id",
        header: "ID Venta",
        cell: ({ row }) => <span className="font-medium">#{row.original._id.slice(-6)}</span>,
    },
    {
        accessorKey: "fecha",
        header: "Fecha",
        cell: ({ row }) => <p className="text-sm">{new Date(row.original.fecha).toLocaleDateString('es-ES')}</p>,
    },
    {
        accessorKey: "clienteNombre",
        header: "Cliente",
        filterFn: "includesString",
        cell: ({ row }) => <p className="text-sm">{row.original.clienteNombre}</p>,
    },
    {
        accessorKey: "total",
        header: "Monto",
        cell: ({ row }) => <p className="text-sm">C${row.original.total.toFixed(2)}</p>,
    },
    {
        accessorKey: "metodoPago",
        header: "Método de Pago",
        cell: ({ row }) => (
            <Badge variant="outline" className="capitalize">
                {row.original.metodoPago}
            </Badge>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const venta = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onVerDetalle(venta._id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalle
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as React from "react";



export type Horario = {
    aperturaEspecial?: string | undefined;
    cierreEspecial?: string | undefined;
    dia: string;
    apertura: string;
    cierre: string;
    cerrado: boolean;
};

import { Input } from "@/components/ui/input";

export const columns: ColumnDef<Horario>[] = [
    {
        accessorKey: "dia",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="px-0"
            >
                Día
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        filterFn: "includesString",
    },
    {
        accessorKey: "apertura",
        header: "Apertura",
        cell: ({ row }) => (
            <Input type="time" defaultValue={row.original.apertura} className="w-24" />
        ),
    },
    {
        accessorKey: "cierre",
        header: "Cierre",
        cell: ({ row }) => (
            <Input type="time" defaultValue={row.original.cierre} className="w-24" />
        ),
    },

    // Estado calculado (no existe en Convex)
    {
        id: "estado",
        header: "Estado",
        cell: ({ row }) => {
            const item = row.original;
            const abierto = item.cerrado

            return abierto ? (
                <Badge variant="destructive">Cerrado</Badge>
            ) : (
                <Badge variant="default">Abierto</Badge>
            );
        },
    },
];

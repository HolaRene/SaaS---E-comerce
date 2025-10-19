"use client";

import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    CheckCircle,
    Clock,
    Download,
    MessageCircle,
    RefreshCw,
    Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export type Compras = {
    id: string;
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


// 🔹 Componente que renderiza el dialog individual por pedido
function DialogCompras({ order }: { order: Compras }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    Ver detalles
                </Button>
            </DialogTrigger>
            <DialogContent
                className="max-w-2xl w-[95vw] sm:w-full max-h-[90vh] p-0 overflow-hidden"
            >
                {/* Encabezado fijo dentro del diálogo */}
                <DialogHeader className="p-4 border-b bg-background sticky top-0 z-10">
                    <DialogTitle>Detalle del pedido #{order.id}</DialogTitle>
                    <DialogDescription>
                        {order.store} • {order.date}
                    </DialogDescription>
                </DialogHeader>

                {/* Contenido con scroll */}
                <div className="overflow-y-auto p-4 space-y-4 max-h-[70vh] sm:max-h-[60vh]">
                    {/* Tabla de productos */}
                    <div className="rounded-lg border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead className="text-center">Cantidad</TableHead>
                                    <TableHead className="text-right">Precio</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell className="text-center">x{item.quantity}</TableCell>
                                        <TableCell className="text-right font-medium">
                                            {item.price}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Resumen del pedido */}
                    <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium">{order.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Envío</span>
                            <span className="font-medium">{order.shipping}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 text-base">
                            <span className="font-semibold">Total</span>
                            <span className="text-lg font-bold text-primary">{order.total}</span>
                        </div>
                    </div>

                    {/* Acciones */}

                    <div className="flex flex-col gap-2  ">
                        <Button className="flex gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Reordenar productos
                        </Button>
                        <Button variant="outline" className="flex gap-2 bg-transparent">
                            <MessageCircle className="h-4 w-4" />
                            Contactar por WhatsApp
                        </Button>
                        <Button variant="outline" className="gap-2 bg-transparent">
                            <Download className="h-4 w-4" />
                            Descargar PDF
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}


// 🔹 Columnas principales
export const columnsCompras: ColumnDef<Compras>[] = [
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
            <Badge variant={row.original.statusColor as any} className="gap-1">
                <row.original.icon className="h-3 w-3" />
                {row.original.status}
            </Badge>
        ),
    },
    {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => <DialogCompras order={row.original} />,
    },
];
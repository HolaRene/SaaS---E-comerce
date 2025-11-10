"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as React from "react";



export type Horario = {
    dia: string;
    apertura: string; // Formato "HH:MM"
    cierre: string;   // Formato "HH:MM"
};

import { Input } from "@/components/ui/input";


export const columns: ColumnDef<Horario>[] = [
    {
        accessorKey: "dia",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0">
                Nombre
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        filterFn: "includesString",
    },
    {
        accessorKey: "apertura",
        header: "Apertura",
        filterFn: "includesString",
        cell: ({ row }) =>
            <Input type="time" defaultValue={row.original.apertura} className="w-24" />
        ,
    },
    {
        accessorKey: "cierre",
        header: "Cierre",
        cell: ({ row }) =>
            <Input type="time" defaultValue={row.original.apertura} className="w-24" />
        ,
    },
    {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => {
            const item = row.original;
            return (<div>
                {item.apertura ? <Badge variant="default">Abierto</Badge> : <Badge variant="destructive">Cerrado</Badge>};
            </div>)
        },
    },
    // {
    //     id: "acciones",
    //     header: "",
    //     cell: ({ row }) => <ClienteActions cliente={row.original} />,
    //     enableSorting: false,
    //     enableColumnFilter: false,
    // },
];

// function ClienteActions({ cliente }: { cliente: Horario }) {
//     const [open, setOpen] = React.useState(false);

//     const desde = new Date(cliente.fechaRegistro);
//     const dias = Math.floor((Date.now() - desde.getTime()) / (1000 * 60 * 60 * 24));

//     return (
//         <>
//             <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="icon">
//                         <MoreHorizontal className="h-4 w-4" />
//                     </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                     <DropdownMenuLabel>Acciones</DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={() => setOpen(true)} className="gap-2">
//                         <Eye className="h-4 w-4" /> Ver detalle
//                     </DropdownMenuItem>
//                     <DropdownMenuItem className="gap-2">
//                         <Eye className="h-4 w-4" /> <Link href={'/user/1'}>Ver user</Link>
//                     </DropdownMenuItem>
//                 </DropdownMenuContent>
//             </DropdownMenu>

//             <Dialog open={open} onOpenChange={setOpen}>
//                 <DialogContent className="sm:max-w-lg">
//                     <DialogHeader>
//                         <DialogTitle>{cliente.nombre}</DialogTitle>
//                         <DialogDescription>Información del cliente</DialogDescription>
//                     </DialogHeader>

//                     <div className="space-y-2 text-sm">
//                         <div className="flex justify-between">
//                             <span className="text-muted-foreground">Email</span>
//                             <a className="underline-offset-2 hover:underline" href={`mailto:${cliente.email}`}>
//                                 {cliente.email}
//                             </a>
//                         </div>
//                         <div className="flex justify-between">
//                             <span className="text-muted-foreground">Teléfono</span>
//                             <span>{cliente.telefono}</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span className="text-muted-foreground">Registro</span>
//                             <span>{new Date(cliente.fechaRegistro).toLocaleString()}</span>
//                         </div>
//                         <div className="flex items-center justify-between border-t pt-2">
//                             <span className="font-medium">Total Compras</span>
//                             <span className="font-semibold text-green-600">{currency(cliente.totalCompras)}</span>
//                         </div>
//                         <div className="pt-1">
//                             {dias <= 30 ? (
//                                 <Badge variant="secondary">Cliente nuevo (≤ 30 días)</Badge>
//                             ) : (
//                                 <Badge variant="outline">Antigüedad: {dias} días</Badge>
//                             )}
//                         </div>
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// }

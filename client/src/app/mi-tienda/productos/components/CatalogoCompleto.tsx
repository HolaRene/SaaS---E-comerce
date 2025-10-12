"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,

} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Download, PlusCircle, Search, Upload } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { columns } from "./columns";
import { DataTableCatalogo } from "./data-table";

// --- Datos Simulados ---
const catalogoData = [
    { id: 1, img: "https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg", nombre: "Pan Dulce", categoria: "Panadería", precio: 25.00, stock: 50, estado: "Disponible" },
    { id: 2, img: "https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg", nombre: "Refresco 1L", categoria: "Bebidas", precio: 35.00, stock: 0, estado: "Agotado" },
    { id: 3, img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg", nombre: "Café Tradicional", categoria: "Abarrotes", precio: 120.00, stock: 12, estado: "Disponible" },
    { id: 4, img: "https://images.pexels.com/photos/5946968/pexels-photo-5946968.jpeg", nombre: "Arroz 5 Lbs", categoria: "Abarrotes", precio: 85.00, stock: 150, estado: "Disponible" },
    { id: 5, img: "https://images.pexels.com/photos/7624423/pexels-photo-7624423.jpeg", nombre: "Jabón de Baño", categoria: "Limpieza", precio: 40.00, stock: 8, estado: "Stock bajo" },
];

const CatalogoCompleto = () => {

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar producto..." className="pl-10" />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button><PlusCircle className="mr-2 h-4 w-4" />Agregar Producto</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <Input placeholder="Nombre del producto" />
                                    <Textarea placeholder="Descripción del producto" />
                                    <Select><SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger><SelectContent><SelectItem value="panaderia">Panadería</SelectItem></SelectContent></Select>
                                    <Input type="number" placeholder="Precio (C$)" />
                                    <Input type="number" placeholder="Stock inicial" />
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Guardar Producto</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline"><Upload className="mr-2 h-4 w-4" />Importar CSV</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Importar Productos desde CSV</DialogTitle>
                                </DialogHeader>
                                <div className="py-4 text-center">
                                    <p className="mb-4 text-sm text-muted-foreground">Sube un archivo CSV con tus productos. Asegúrate de que siga el formato de la plantilla.</p>
                                    <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Arrastra y suelta o haz clic para subir</p>
                                    </div>
                                </div>
                                <DialogFooter className="sm:justify-between">
                                    <Button variant="ghost"><Download className="mr-2 h-4 w-4" />Descargar Plantilla</Button>
                                    <Button>Importar Archivo</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Button variant="outline"><Download className="mr-2 h-4 w-4" />Exportar Excel</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DataTableCatalogo columns={columns} data={catalogoData} />
            </CardContent>

        </Card>
    )
}

export default CatalogoCompleto
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

import { columns } from "./columns";
import { DataTableCatalogo } from "./data-table";
import { productos } from "@/lib/tiendas-datos";
import AddProductPulperia from "./AgregarProducto";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label";

// --- Datos Simulados ---
// const catalogoData = [
//     { id: 1, img: "https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg", nombre: "Pan Dulce", categoria: "Panadería", precio: 25.00, stock: 50, estado: "Disponible" },
//     { id: 2, img: "https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg", nombre: "Refresco 1L", categoria: "Bebidas", precio: 35.00, stock: 0, estado: "Agotado" },
//     { id: 3, img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg", nombre: "Café Tradicional", categoria: "Abarrotes", precio: 120.00, stock: 12, estado: "Disponible" },
//     { id: 4, img: "https://images.pexels.com/photos/5946968/pexels-photo-5946968.jpeg", nombre: "Arroz 5 Lbs", categoria: "Abarrotes", precio: 85.00, stock: 150, estado: "Disponible" },
//     { id: 5, img: "https://images.pexels.com/photos/6962873/pexels-photo-6962873.jpeg", nombre: "Jabón de Baño", categoria: "Limpieza", precio: 40.00, stock: 8, estado: "Stock bajo" },
// ];

const products = productos

const CatalogoCompleto = () => {

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div className="flex gap-2 flex-wrap">

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />Agregar Producto
                                </Button>
                            </SheetTrigger>
                            <AddProductPulperia />
                        </Sheet>
                        <Button variant="outline"><Download className="mr-2 h-4 w-4" />Exportar Excel</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DataTableCatalogo columns={columns} data={products} />
            </CardContent>

        </Card>
    )
}

export default CatalogoCompleto
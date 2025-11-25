"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Download, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button";

import { columns } from "./columns";
import { DataTableCatalogo } from "./data-table";
import {
    Sheet,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Id } from "../../../../../../../convex/_generated/dataModel";
import AddProductPulperia from "./AgregarProducto";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";



const CatalogoCompleto = ({ idTienda }: { idTienda: Id<"tiendas"> }) => {

    const productsTienda = useQuery(api.productos.getProductosByTienda, { tiendaId: idTienda });

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
                            <AddProductPulperia idTienda={idTienda} />
                        </Sheet>
                        <Button variant="outline"><Download className="mr-2 h-4 w-4" />Exportar Excel</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {productsTienda === undefined ? (
                    <div className="text-center py-8 text-muted-foreground">
                        Cargando productos...
                    </div>
                ) : productsTienda.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No hay productos aún. ¡Agrega tu primer producto!
                    </div>
                ) : (
                    <DataTableCatalogo columns={columns} data={productsTienda} />
                )}
            </CardContent>

        </Card>
    )
}

export default CatalogoCompleto
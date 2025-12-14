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
import { Id, Doc } from "../../../../../../../convex/_generated/dataModel";
import AddProductPulperia from "./AgregarProducto";
import { toast } from "sonner";

interface Permisos {
    canManageProducts: boolean;
    canAdjustStock: boolean;
    role: string;
}

interface CatalogoCompletoProps {
    idTienda: Id<"tiendas">;
    productos: Doc<"productos">[];
    permisos: Permisos;
}

const CatalogoCompleto = ({ idTienda, productos, permisos }: CatalogoCompletoProps) => {

    const handleExport = () => {
        // Implementación futura o actual de exportación
        toast.info("Función de exportar próximamente");
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div className="flex gap-2 flex-wrap">
                        {permisos.canManageProducts && (
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button>
                                        <PlusCircle className="mr-2 h-4 w-4" />Agregar Producto
                                    </Button>
                                </SheetTrigger>
                                <AddProductPulperia idTienda={idTienda} />
                            </Sheet>
                        )}
                        <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Exportar Excel</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {productos.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        {permisos.canManageProducts
                            ? "No hay productos aún. ¡Agrega tu primer producto!"
                            : "No hay productos registrados en esta tienda."}
                    </div>
                ) : (
                    <DataTableCatalogo
                        columns={columns}
                        data={productos}
                        permisos={permisos}
                    />
                )}
            </CardContent>

        </Card>
    )
}

export default CatalogoCompleto
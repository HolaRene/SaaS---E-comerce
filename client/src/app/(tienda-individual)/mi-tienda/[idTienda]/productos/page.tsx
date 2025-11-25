import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Boxes, Package, Tags } from "lucide-react";
import CatalogoCompleto from "./_components/CatalogoCompleto";
import ControlInventario from "./_components/ControlInventario";
import CategoriasEtiquetas from "./_components/CategoriasEtiquetas";
import { Id } from "../../../../../../convex/_generated/dataModel";



const ProductosPage = async ({ params }: { params: { idTienda: Id<"tiendas"> } }) => {
    const idTienda = (await params).idTienda;
    return (
        <div className='flex flex-col gap-4'>
            {/* Header */}
            <header className="mt-2">
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Productos</h1>
                <p className="text-muted-foreground">Administra el inventario, categorías y catálogo de tu negocio.</p>
            </header>

            <Tabs defaultValue="catalogo">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="catalogo" >
                        <Boxes className="mr-2 h-4 w-4" />
                        Catálogo <span className="hidden md:block">Completo</span>
                    </TabsTrigger>
                    <TabsTrigger value="inventario"><Package className="mr-2 h-4 w-4" />Control <span className="hidden md:block">de Inventario</span></TabsTrigger>
                    <TabsTrigger value="categorias"><Tags className="mr-2 h-4 w-4" />Categorías <span className="hidden md:block">y Etiquetas</span></TabsTrigger>
                </TabsList>


                {/* 1. Catálogo Completo */}
                <TabsContent value="catalogo">
                    <CatalogoCompleto idTienda={idTienda} />
                </TabsContent>

                {/* 2. Control de Inventario */}
                <TabsContent value="inventario" >
                    <ControlInventario idTienda={idTienda} />
                </TabsContent>

                {/* 3. Categorías y Etiquetas */}
                <TabsContent value="categorias" >
                    <CategoriasEtiquetas idTienda={idTienda} />
                </TabsContent>


            </Tabs>
        </div>
    )
}

export default ProductosPage
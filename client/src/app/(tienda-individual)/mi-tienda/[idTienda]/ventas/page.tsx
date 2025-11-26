import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


import {
    ShoppingCart,
    Printer,
    Clock,

    FileDown,

} from "lucide-react"
import PuntoVenta from "./_components/PuntoVenta"
import PedidosActivos from "./_components/PedidosActivos"
import HistorialVentas from "./_components/HistorialVentas"
import FacturacionElectronica from "./_components/FacturacionElectronica"
import { Id } from "../../../../../../convex/_generated/dataModel"

export default async function VentasPage({ params }: { params: Promise<{ idTienda: Id<"tiendas"> }> }) {

    const { idTienda } = await params

    return (
        <div className="min-h-screen  p-4 md:p-8">
            <div className="container ">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Módulo de Ventas</h1>
                    <p className="text-muted-foreground">Gestiona ventas, pedidos y facturación de tu negocio</p>
                </header>

                <Tabs defaultValue="pos" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="pos">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Punto de Venta
                        </TabsTrigger>
                        {/* <TabsTrigger value="pedidos">
                            <Clock className="mr-2 h-4 w-4" />
                            Pedidos Activos
                        </TabsTrigger> */}
                        <TabsTrigger value="historial">
                            <FileDown className="mr-2 h-4 w-4" />
                            Historial
                        </TabsTrigger>
                        {/* <TabsTrigger value="facturacion">
                            <Printer className="mr-2 h-4 w-4" />
                            Facturación
                        </TabsTrigger> */}
                    </TabsList>

                    {/* Punto de Venta */}
                    <TabsContent value="pos" className="">
                        <PuntoVenta idTienda={idTienda} />
                    </TabsContent>

                    {/* Pedidos Activos */}
                    {/* <TabsContent value="pedidos" className="space-y-6">
                        <PedidosActivos />
                    </TabsContent> */}

                    {/* Historial de Ventas */}
                    <TabsContent value="historial" className="">
                        <HistorialVentas idTienda={idTienda} />
                    </TabsContent>

                    {/* Facturación Electrónica */}
                    {/* <TabsContent value="facturacion" className="">
                        <FacturacionElectronica />
                    </TabsContent> */}
                </Tabs>
            </div>
        </div>
    )
}

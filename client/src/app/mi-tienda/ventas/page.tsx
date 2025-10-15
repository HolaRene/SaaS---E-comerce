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

export default function VentasPage() {

    return (
        <div className="min-h-screen  p-4 md:p-8">
            <div className="container mx-auto max-w-7xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Módulo de Ventas</h1>
                    <p className="text-muted-foreground">Gestiona ventas, pedidos y facturación de tu negocio</p>
                </header>

                <Tabs defaultValue="pos" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                        <TabsTrigger value="pos">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Punto de Venta
                        </TabsTrigger>
                        <TabsTrigger value="pedidos">
                            <Clock className="mr-2 h-4 w-4" />
                            Pedidos Activos
                        </TabsTrigger>
                        <TabsTrigger value="historial">
                            <FileDown className="mr-2 h-4 w-4" />
                            Historial
                        </TabsTrigger>
                        <TabsTrigger value="facturacion">
                            <Printer className="mr-2 h-4 w-4" />
                            Facturación
                        </TabsTrigger>
                    </TabsList>

                    {/* Punto de Venta */}
                    <TabsContent value="pos" className="space-y-6">
                        <PuntoVenta />
                    </TabsContent>

                    {/* Pedidos Activos */}
                    <TabsContent value="pedidos" className="space-y-6">
                        <PedidosActivos />
                    </TabsContent>

                    {/* Historial de Ventas */}
                    <TabsContent value="historial" className="space-y-6">
                        <HistorialVentas />
                    </TabsContent>

                    {/* Facturación Electrónica */}
                    <TabsContent value="facturacion" className="space-y-6">
                        <FacturacionElectronica />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

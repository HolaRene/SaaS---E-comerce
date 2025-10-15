
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartLine, DollarSign, Package, Users } from "lucide-react"
import VentasRentabilidad from "./_components/VentasRentabilidad"
import DesenpenioProductos from "./_components/DesenpenioProductos"
import ComportamientoClientes from "./_components/ComportamientoClientes"
import EstadoFinanciero from "./_components/EstadoFinanciero"

const Reportes = () => {
    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="container mx-auto max-w-7xl">
                {/* ENCABEZADO DEL MÓDULO */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Reportes</h1>
                    <p className="text-muted-foreground">Análisis visual y estadístico de tu negocio</p>
                </div>
                {/* Navegación por tabs */}
                <Tabs defaultValue="ventas" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                        <TabsTrigger value="ventas">
                            <ChartLine className="mr-2 h-4 w-4" />
                            <span className="hidden md:block">Ventas y</span> Rentabilidad
                        </TabsTrigger>
                        <TabsTrigger value="productos">
                            <Package className="mr-2 h-4 w-4" />
                            Desempeño <span className="hidden md:block">de Productos</span>
                        </TabsTrigger>
                        <TabsTrigger value="clientes">
                            <Users className="mr-2 h-4 w-4" />
                            Comportamiento <span className="hidden md:block">de Clientes</span>
                        </TabsTrigger>
                        <TabsTrigger value="financiero">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Estado Financiero
                        </TabsTrigger>
                    </TabsList>
                    {/* Venta y rentabilidad */}
                    <TabsContent value="ventas">
                        <VentasRentabilidad />
                    </TabsContent>
                    {/* DESEMPEÑO DE PRODUCTOS Análisis de inventario y rotación */}
                    <TabsContent value="productos" className="space-y-6">
                        <DesenpenioProductos />
                    </TabsContent>
                    {/*  COMPORTAMIENTO DE CLIENTES
              Análisis de fidelidad y patrones de compra */}
                    <TabsContent value="clientes">
                        <ComportamientoClientes />
                    </TabsContent>
                    {/* ESTADO FINANCIERO
              Control de caja y resultados administrativos */}
                    <TabsContent value="financiero">
                        <EstadoFinanciero />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Reportes
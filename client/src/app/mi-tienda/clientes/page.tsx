import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, CreditCard, Users } from "lucide-react"
import BaseClientes from "./_components/BaseClientes"
import FiadosActivos from "./_components/FiadosActivos"
import RecordatoriosCobros from "./_components/RecordatoriosCobros"

const VentaPage = () => {
    return (
        <div className="min-h-screen p-4 md:p-5 space-y-3">

            {/* Header */}
            <header className="space-y-2">
                <h1 className="text-balance lg:text-4xl font-bold tracking-tight md:text-3xl text-2xl">Gestión de Clientes</h1>
                <p className="text-muted-foreground text-pretty">
                    Administra tu base de clientes, créditos y recordatorios de cobro
                </p>
            </header>
            {/* Tabs principales */}
            <Tabs defaultValue="base" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="base" className="gap-2">
                        <Users className="h-4 w-4" />
                        <span className="hidden md:block"> Base de</span> Clientes
                    </TabsTrigger>
                    <TabsTrigger value="fiados" className="gap-2">
                        <CreditCard className="h-4 w-4" />
                        Fiados <span className="hidden md:block">Activos</span>
                    </TabsTrigger>
                    <TabsTrigger value="recordatorios" className="gap-2">
                        <Bell className="h-4 w-4" />
                        Recordatorios
                    </TabsTrigger>
                </TabsList>
                {/* Tab 1: Base de Clientes */}
                <TabsContent value="base">
                    <BaseClientes />
                </TabsContent>
                {/* Tab 2: Fiados Activos */}
                <TabsContent value="fiados">
                    <FiadosActivos />
                </TabsContent>
                {/* Tab 3: Recordatorios y Cobros */}
                <TabsContent value="recordatorios" className="space-y-6">
                    <RecordatoriosCobros />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default VentaPage
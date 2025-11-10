import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FiscalDataForm } from "./_components/fiscal-data-form"
import { companyData, notificationConfig } from "@/lib/configuration-data"
import { NotificationAlerts } from "./_components/notifications-alerts"

const PageConfiguracion = () => {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Configuración Corporativa</h1>
                <p className="text-muted-foreground">Gestiona la configuración global del sistema</p>
            </div>
            <Tabs defaultValue="company" className="space-y-6">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
                    <TabsTrigger value="company">Datos de la Empresa</TabsTrigger>
                    <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
                </TabsList>

                <TabsContent value="company" className="space-y-6">
                    <FiscalDataForm data={companyData} />
                </TabsContent>
                <TabsContent value="notifications" className="space-y-6">
                    <NotificationAlerts alerts={notificationConfig.criticalAlerts} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default PageConfiguracion
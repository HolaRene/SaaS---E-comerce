import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { campaigns, storeGroups } from "@/lib/data-marketing"
import { BarChart3, TrendingUp, Users } from "lucide-react"
import { GlobalCampaignWizard } from "./_components/global-compaign-wizard"
import { Suspense } from "react"
import { CampaignsList } from "./_components/campania_lista"
import { StoreGroupManager } from "./_components/grupos-tiendas-manager"

// Mock available stores
const availableStores = [
    { id: "store-001", name: "Tienda Centro" },
    { id: "store-002", name: "Tienda Norte" },
    { id: "store-003", name: "Tienda Sur" },
    { id: "store-004", name: "Tienda Este" },
    { id: "store-005", name: "Tienda Oeste" },
    { id: "store-006", name: "Tienda Plaza" },
]

// función de carga para campañas
function CampaignsLoading() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-20 w-full" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
const Page = () => {

    // Calculate summary metrics
    const activeCampaigns = campaigns.filter((c) => c.status === "active").length
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0)
    const avgROI =
        campaigns.filter((c) => c.metrics).reduce((sum, c) => sum + (c.metrics?.roi || 0), 0) /
        campaigns.filter((c) => c.metrics).length

    return (
        <div className="space-y-6 mt-3">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Marketing Corporativo</h1>
                <p className="text-muted-foreground">
                    Gestiona campañas, grupos de tiendas y analiza el performance de tus promociones
                </p>
            </div>
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Campañas Activas</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeCampaigns}</div>
                        <p className="text-xs text-muted-foreground">{campaigns.length} campañas totales</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${(totalBudget / 1000).toFixed(0)}K</div>
                        <p className="text-xs text-muted-foreground">Asignado a {campaigns.length} campañas</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ROI Promedio</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgROI.toFixed(1)}x</div>
                        <p className="text-xs text-muted-foreground">Retorno sobre inversión</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Grupos de Tiendas</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{storeGroups.length}</div>
                        <p className="text-xs text-muted-foreground">Segmentación activa</p>
                    </CardContent>
                </Card>
            </div>
            {/* Campañas */}
            <Tabs defaultValue="campaigns" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="campaigns">Campañas</TabsTrigger>
                    <TabsTrigger value="groups">Grupos de Tiendas</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="calendar">Calendario</TabsTrigger>
                </TabsList>
                <TabsContent value="campaigns" className="space-y-4">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-1">
                            <GlobalCampaignWizard />
                        </div>
                        <div className="lg:col-span-2">
                            <Suspense fallback={<CampaignsLoading />}>
                                <CampaignsList campaigns={campaigns} />
                            </Suspense>
                        </div>
                    </div>
                </TabsContent>
                {/* Grupos */}
                <TabsContent value="groups" className="space-y-4">
                    <StoreGroupManager groups={storeGroups} availableStores={availableStores} />
                </TabsContent>
                {/* Perfomance */}
                <TabsContent value="performance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Análisis de Performance</CardTitle>
                            <CardDescription>Métricas detalladas de ROI y efectividad por campaña</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Selecciona una campaña para ver análisis detallado</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* Calendario */}
                <TabsContent value="calendar" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Calendario Corporativo</CardTitle>
                            <CardDescription>Planificación y gestión de campañas en el tiempo</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Vista de calendario próximamente</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Page
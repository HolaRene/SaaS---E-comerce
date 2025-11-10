import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package } from "lucide-react"
import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getConsolidatedInventoryData } from "@/lib/data-inventory"
import { InventoryOverview } from "./_components/inventory-overview"
import { StockDistributionChart } from "./_components/stock-distribuition-chart"
import { InventoryValueCard } from "./_components/inventory-value-card"
import { GlobalAlertsPanel } from "./_components/global-alerts-panel"
import { ProductDrilldownTab } from "./_components/product-drilldown-tab"
import { AlertsTab } from "./_components/alerts-tab"
import { AnalysisTab } from "./_components/analisis-tab"

// Server Component with streaming
async function ConsolidatedView() {
    // Simulate data fetching
    await new Promise((resolve) => setTimeout(resolve, 500))
    const data = getConsolidatedInventoryData()

    return (
        <div className="space-y-6">
            <InventoryOverview data={data} />

            <div className="grid gap-6 md:grid-cols-2">
                <StockDistributionChart data={data} />
                <InventoryValueCard data={data} />
            </div>

            <GlobalAlertsPanel alerts={data.alerts} />
        </div>
    )
}

function ConsolidatedViewSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-8 w-32 mb-2" />
                            <Skeleton className="h-3 w-20" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardContent className="pt-6">
                        <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <Skeleton className="h-[200px] w-full" />
                </CardContent>
            </Card>
        </div>
    )
}

const PageInventory = () => {
    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Inventario</h1>
                    <p className="text-muted-foreground">Sistema avanzado de inventario multi-tienda</p>
                </div>
            </div>
            <Tabs defaultValue="consolidated" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="consolidated">Vista Consolidada</TabsTrigger>
                    <TabsTrigger value="drilldown">Drill-Down</TabsTrigger>
                    <TabsTrigger value="alerts">Alertas</TabsTrigger>
                    <TabsTrigger value="analysis">Análisis</TabsTrigger>
                </TabsList>
                {/* Vista consolidad */}
                <TabsContent value="consolidated" className="space-y-6">
                    <Suspense fallback={<ConsolidatedViewSkeleton />}>
                        <ConsolidatedView />
                    </Suspense>
                </TabsContent>
                {/* Drill Down */}
                <TabsContent value="drilldown">
                    <ProductDrilldownTab />
                </TabsContent>
                {/* Alertas */}
                <TabsContent value="alerts">
                    <AlertsTab />
                </TabsContent>
                {/* Análisis */}
                <TabsContent value="analysis">
                    <AnalysisTab />
                </TabsContent>
            </Tabs>


        </div>
    )
}

export default PageInventory
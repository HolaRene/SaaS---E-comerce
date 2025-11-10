import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateSalesData } from "@/lib/analytics-data"
import { BarChart3, FileText, TrendingUp, Users } from "lucide-react"
import { Suspense } from "react"
import { SalesComparison } from "./_components/sales-comparision"
import { GrowthTrendAnalysis } from "./_components/growth-trend-analisis"
import { RegionalMetrics } from "./_components/regional-metrics"
import { Card, CardContent } from "@/components/ui/card"
import { StoreRanking } from "./_components/store-ranking"
import { CustomerSegmentation } from "./_components/customer-segmentation"
import { ReportBuilder } from "./_components/report-builder"

function SalesTabSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[400px] w-full" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[200px]" />
                ))}
            </div>
        </div>
    )
}
async function SalesTab() {
    // Simulate data fetching
    await new Promise((resolve) => setTimeout(resolve, 5000))
    const salesData = generateSalesData().slice(0, 365) // Last year

    return (
        <div className="space-y-6">
            <SalesComparison data={salesData} />
            <GrowthTrendAnalysis data={salesData} />
            <RegionalMetrics />
        </div>
    )
}

const AnalyticsPage = () => {
    return (
        <div className="space-y-6 mt-3">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics Corporativos</h1>
                <p className="text-muted-foreground">
                    Sistema avanzado de análisis multi-tienda con procesamiento de grandes volúmenes de datos
                </p>
            </div>
            <Tabs defaultValue="sales" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="sales" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        <span className="md:block hidden"> Ventas Consolidadas</span>
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="md:block hidden">Performance</span>
                    </TabsTrigger>
                    <TabsTrigger value="customers" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="md:block hidden">Clientes</span>
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="md:block hidden">Reportes</span>
                    </TabsTrigger>
                </TabsList>
                {/* Salas */}
                <TabsContent value="sales" className="space-y-6">
                    <Suspense fallback={<SalesTabSkeleton />}>
                        <SalesTab />
                    </Suspense>
                </TabsContent>
                {/* Perfomance */}
                <TabsContent value="performance" className="space-y-6">
                    <StoreRanking />
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-center text-sm text-muted-foreground">
                                Análisis de brechas y recomendaciones disponibles próximamente
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* Clientes */}
                <TabsContent value="customers" className="space-y-6">
                    <CustomerSegmentation />
                </TabsContent>
                {/* reportes */}
                <TabsContent value="reports" className="space-y-6">
                    <ReportBuilder />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AnalyticsPage
"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { DashboardHeader } from "./_components/dashboard-header"
import { SummaryCards } from "./_components/summary-cards"
import { PerformanceChart } from "./_components/perfomance-chart"
import { AlertsPanel } from "./_components/alert-panel"
import { TopStoresTable } from "./_components/top-store-table"
import { ComparativeMetrics } from "./_components/comparative-metrics"
import { Loader2 } from "lucide-react"

const Page = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month">("week")

    // Obtener usuario de Clerk
    const { user: clerkUser } = useUser()

    // Obtener usuario Convex
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    )

    // Obtener métricas consolidadas
    const metricas = useQuery(
        api.dashboard.getEmpresarialMetrics,
        usuario?._id ? { propietarioId: usuario._id, periodo: selectedPeriod } : "skip"
    )

    // Obtener top tiendas
    const topStores = useQuery(
        api.dashboard.getTopStoresPerformance,
        usuario?._id ? { propietarioId: usuario._id, limit: 5 } : "skip"
    )

    // Obtener alertas
    const alerts = useQuery(
        api.dashboard.getEmpresarialAlerts,
        usuario?._id ? { propietarioId: usuario._id } : "skip"
    )

    // Obtener métricas regionales
    const regionalMetrics = useQuery(
        api.dashboard.getRegionalMetrics,
        usuario?._id ? { propietarioId: usuario._id } : "skip"
    )

    // Estados de carga
    if (!usuario || metricas === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Cargando dashboard empresarial...</p>
                </div>
            </div>
        )
    }

    // Usuario sin tiendas
    if (metricas.tiendasCount === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4 max-w-md">
                    <h2 className="text-2xl font-bold">No tienes tiendas registradas</h2>
                    <p className="text-muted-foreground">
                        Crea tu primera tienda para comenzar a ver estadísticas y métricas de rendimiento.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod as any} />
            <main className="container mx-auto p-6 space-y-6">
                {/* Summary Cards - 4 column grid on desktop */}
                <SummaryCards
                    period={selectedPeriod}
                    metrics={{
                        sales: metricas.ventas,
                        growth: metricas.crecimiento,
                        orders: metricas.pedidos,
                        alertCount: metricas.alertas
                    }}
                />

                {/* Main Content Grid - 2 column layout on large screens */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Performance Chart - Takes 2 columns */}
                    <PerformanceChart propietarioId={usuario._id} />

                    {/* Alerts Panel - Takes 1 column */}
                    {alerts && alerts.length > 0 ? (
                        <AlertsPanel alerts={alerts} />
                    ) : (
                        <div className="border rounded-lg p-6 flex items-center justify-center text-muted-foreground">
                            No hay alertas activas
                        </div>
                    )}
                </div>

                {/* Secondary Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Top Stores Table - Takes 2 columns */}
                    {topStores && topStores.length > 0 ? (
                        <TopStoresTable stores={topStores} />
                    ) : (
                        <div className="col-span-full lg:col-span-2 border rounded-lg p-6 flex items-center justify-center text-muted-foreground">
                            No hay datos de tiendas disponibles
                        </div>
                    )}

                    {/* Comparative Metrics - Takes 1 column */}
                    {regionalMetrics && regionalMetrics.length > 0 ? (
                        <ComparativeMetrics metrics={regionalMetrics} />
                    ) : (
                        <div className="border rounded-lg p-6 flex items-center justify-center text-muted-foreground">
                            No hay métricas regionales
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default Page

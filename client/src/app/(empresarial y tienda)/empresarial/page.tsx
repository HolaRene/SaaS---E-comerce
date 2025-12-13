"use client"

import { alerts, dailySalesData, metrics, regionalMetrics, storePerformance } from "@/lib/datos.empresarial"
import { useState } from "react"
import { DashboardHeader } from "./_components/dashboard-header"
import { SummaryCards } from "./_components/summary-cards"
import { PerformanceChart } from "./_components/perfomance-chart"
import { AlertsPanel } from "./_components/alert-panel"
import { TopStoresTable } from "./_components/top-store-table"
import { ComparativeMetrics } from "./_components/comparative-metrics"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

const Page = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month">("week")

    // Calculate metrics based on selected period
    const getMetricsForPeriod = () => {
        switch (selectedPeriod) {
            case "today":
                return {
                    sales: metrics.dailySales,
                    growth: metrics.growth,
                    orders: dailySalesData[dailySalesData.length - 1].orders,
                    alertCount: metrics.alertCount,
                }
            case "week":
                return {
                    sales: metrics.weeklySales,
                    growth: metrics.growth,
                    orders: dailySalesData.reduce((sum, day) => sum + day.orders, 0),
                    alertCount: metrics.alertCount,
                }
            case "month":
                return {
                    sales: metrics.monthlySales,
                    growth: metrics.growth,
                    orders: dailySalesData.reduce((sum, day) => sum + day.orders, 0) * 4,
                    alertCount: metrics.alertCount,
                }
            default:
                return {
                    sales: metrics.weeklySales,
                    growth: metrics.growth,
                    orders: dailySalesData.reduce((sum, day) => sum + day.orders, 0),
                    alertCount: metrics.alertCount,
                }
        }
    }


    // Obtener usuario de Clerk
    const { user: clerkUser } = useUser()

    // Obtener usuario Convex
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    )

    // Obtener primera tienda del usuario
    const tiendaUser = useQuery(
        api.tiendas.getTiendasByPropietario,
        usuario?._id ? { propietarioId: usuario._id } : "skip"
    )

    // Obtener métricas reales de la tienda
    const metricas = useQuery(
        api.tiendas.getMetricasTienda,
        (tiendaUser && tiendaUser.length > 0)
            ? {
                tiendaId: tiendaUser[0]._id,
                periodo: selectedPeriod
            }
            : "skip"
    )

    if (!tiendaUser || tiendaUser.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">No se encontraron tiendas asociadas a este usuario.</p>
            </div>
        )
    }



    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod as any} />
            <main className="container mx-auto p-6 space-y-6">
                {/* Summary Cards - 4 column grid on desktop */}
                {metricas && (
                    <SummaryCards
                        period={selectedPeriod}
                        metrics={{
                            sales: metricas.ventas,
                            growth: metricas.crecimiento,
                            orders: metricas.pedidos,
                            alertCount: metricas.alertas
                        }}
                    />
                )}
                {/* Main Content Grid - 2 column layout on large screens */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Performance Chart - Takes 2 columns */}
                    <PerformanceChart propietarioId={tiendaUser[0].propietario} />

                    {/* Alerts Panel - Takes 1 column */}
                    <AlertsPanel alerts={alerts} />
                </div>
                {/* Secondary Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Top Stores Table - Takes 2 columns */}
                    <TopStoresTable stores={storePerformance} />

                    {/* Comparative Metrics - Takes 1 column */}
                    <ComparativeMetrics metrics={regionalMetrics} />
                </div>
            </main>
        </div>
    )
}

export default Page
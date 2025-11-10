"use client"

import { alerts, dailySalesData, metrics, regionalMetrics, storePerformance } from "@/lib/datos.empresarial"
import { useState } from "react"
import { DashboardHeader } from "./_components/dashboard-header"
import { SummaryCards } from "./_components/summary-cards"
import { PerformanceChart } from "./_components/perfomance-chart"
import { AlertsPanel } from "./_components/alert-panel"
import { TopStoresTable } from "./_components/top-store-table"
import { ComparativeMetrics } from "./_components/comparative-metrics"

const Page = () => {

    const [selectedPeriod, setSelectedPeriod] = useState<string>("week")

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

    const currentMetrics = getMetricsForPeriod()
    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
            <main className="container mx-auto p-6 space-y-6">
                {/* Summary Cards - 4 column grid on desktop */}
                <SummaryCards period={selectedPeriod} metrics={currentMetrics} />
                {/* Main Content Grid - 2 column layout on large screens */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Performance Chart - Takes 2 columns */}
                    <PerformanceChart data={dailySalesData} />

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
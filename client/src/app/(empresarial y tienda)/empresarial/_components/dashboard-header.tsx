"use client"

import { Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

/**
 * DashboardHeader Component
 * Displays the main title and period filter controls
 * Allows users to switch between daily, weekly, and monthly views
 */

interface DashboardHeaderProps {
    selectedPeriod: string
    onPeriodChange: (period: string) => void
}

export function DashboardHeader({ selectedPeriod, onPeriodChange }: DashboardHeaderProps) {
    return (
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
            <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-balance">MiComercio Digital</h1>
                    <p className="text-muted-foreground mt-1">Dashboard corporativo multi-tienda</p>
                </div>

                <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <Select value={selectedPeriod} onValueChange={onPeriodChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Seleccionar período" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Hoy</SelectItem>
                            <SelectItem value="week">Esta semana</SelectItem>
                            <SelectItem value="month">Este mes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}

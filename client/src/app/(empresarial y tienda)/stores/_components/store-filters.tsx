"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { regions, statusOptions } from "@/lib/data-store"

interface StoreFiltersProps {
    selectedRegion: string
    selectedStatus: string
    onRegionChange: (value: string) => void
    onStatusChange: (value: string) => void
}

export function StoreFilters({ selectedRegion, selectedStatus, onRegionChange, onStatusChange }: StoreFiltersProps) {
    return (
        <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
                <Label htmlFor="region-filter" className="text-sm font-medium mb-2 block">
                    Región
                </Label>
                <Select value={selectedRegion} onValueChange={onRegionChange}>
                    <SelectTrigger id="region-filter">
                        <SelectValue placeholder="Todas las regiones" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las regiones</SelectItem>
                        {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                                {region}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
                <Label htmlFor="status-filter" className="text-sm font-medium mb-2 block">
                    Estado
                </Label>
                <Select value={selectedStatus} onValueChange={onStatusChange}>
                    <SelectTrigger id="status-filter">
                        <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                                {status === "active" ? "Activo" : status === "inactive" ? "Inactivo" : "Mantenimiento"}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

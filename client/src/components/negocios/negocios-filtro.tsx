/**
 * FILTROS DE TIENDAS
 * Panel de filtros avanzados para búsqueda de tiendas
 */

"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, X, Star, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { type StoreFilters, type StoreCategory, DEFAULT_FILTERS, CATEGORY_ICONS, DEPARTMENTS } from "@/lib/types-negocios"



interface StoreFiltersProps {
    filters: StoreFilters
    onFiltersChange: (filters: StoreFilters) => void
    totalResults: number
    availableCategories: StoreCategory[]
}

export function StoreFiltersPanel({ filters, onFiltersChange, totalResults, availableCategories }: StoreFiltersProps) {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

    // Actualiza un filtro específico
    const updateFilter = <K extends keyof StoreFilters>(key: K, value: StoreFilters[K]) => {
        onFiltersChange({ ...filters, [key]: value })
    }

    // Limpia todos los filtros
    const clearFilters = () => {
        onFiltersChange(DEFAULT_FILTERS)
    }

    // Verifica si hay filtros activos
    const hasActiveFilters =
        filters.categoria ||
        filters.departamento ||
        filters.minRating > 0 ||
        filters.soloAbiertas ||
        filters.conDelivery ||
        filters.verificadas

    return (
        <div className="space-y-4">
            {/* Barra de búsqueda principal */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar tiendas, productos..."
                    value={filters.searchQuery}
                    onChange={(e) => updateFilter("searchQuery", e.target.value)}
                    className="pl-10 pr-4 h-11 bg-background"
                />
                {filters.searchQuery && (
                    <button
                        onClick={() => updateFilter("searchQuery", "")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Filtros de categoría como tags */}
            <div className="flex flex-wrap gap-2">
                <Badge
                    variant={filters.categoria === null ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90 transition-colors"
                    onClick={() => updateFilter("categoria", null)}
                >
                    Todas
                </Badge>
                {availableCategories.map((cat) => (
                    <Badge
                        key={cat}
                        variant={filters.categoria === cat ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/20 transition-colors"
                        onClick={() => updateFilter("categoria", filters.categoria === cat ? null : cat)}
                    >
                        {CATEGORY_ICONS[cat]} {cat}
                    </Badge>
                ))}
            </div>

            {/* Filtros avanzados colapsables */}
            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                        <span className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4" />
                            Filtros avanzados
                            {hasActiveFilters && (
                                <Badge variant="secondary" className="ml-2">
                                    Activos
                                </Badge>
                            )}
                        </span>
                        <ChevronDown className={cn("w-4 h-4 transition-transform", isAdvancedOpen && "rotate-180")} />
                    </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="pt-4 space-y-4">
                    {/* Filtro por departamento */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Departamento</Label>
                        <Select
                            value={filters.departamento || "all"}
                            onValueChange={(val) =>
                                updateFilter("departamento", val === "all" ? null : (val as typeof filters.departamento))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Todos los departamentos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los departamentos</SelectItem>
                                {DEPARTMENTS.map((dept) => (
                                    <SelectItem key={dept} value={dept}>
                                        {dept}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Filtro por rating */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Rating mínimo</Label>
                        <div className="flex gap-1">
                            {[0, 1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => updateFilter("minRating", rating)}
                                    className={cn(
                                        "flex items-center gap-0.5 px-2 py-1 rounded-md text-sm transition-colors",
                                        filters.minRating === rating ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
                                    )}
                                >
                                    {rating === 0 ? (
                                        "Todos"
                                    ) : (
                                        <>
                                            {rating}
                                            <Star className="w-3 h-3 fill-current" />
                                        </>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Switches de filtros */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="soloAbiertas" className="text-sm cursor-pointer">
                                Solo tiendas abiertas
                            </Label>
                            <Switch
                                id="soloAbiertas"
                                checked={filters.soloAbiertas}
                                onCheckedChange={(checked) => updateFilter("soloAbiertas", checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="conDelivery" className="text-sm cursor-pointer">
                                Con delivery disponible
                            </Label>
                            <Switch
                                id="conDelivery"
                                checked={filters.conDelivery}
                                onCheckedChange={(checked) => updateFilter("conDelivery", checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="verificadas" className="text-sm cursor-pointer">
                                Solo verificadas
                            </Label>
                            <Switch
                                id="verificadas"
                                checked={filters.verificadas}
                                onCheckedChange={(checked) => updateFilter("verificadas", checked)}
                            />
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                            disabled={!hasActiveFilters && !filters.searchQuery}
                            className="flex-1 bg-transparent"
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            {/* Contador de resultados */}
            <div className="text-sm text-muted-foreground">
                {totalResults} {totalResults === 1 ? "tienda encontrada" : "tiendas encontradas"}
            </div>
        </div>
    )
}

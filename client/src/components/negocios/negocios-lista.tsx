/**
 * LISTA DE TIENDAS
 * Panel izquierdo con filtros y lista scrolleable de tiendas
 */

"use client"

import { useMemo } from "react"
import { StoreIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StoreCard } from "./store-card"
import { StoreFiltersPanel } from "./negocios-filtro"
import type { Store, StoreFilters, StoreCategory } from "@/lib/types-negocios"
import { filterStores } from "@/lib/negocios-utils"

interface StoreListProps {
    stores: Store[]
    filters: StoreFilters
    onFiltersChange: (filters: StoreFilters) => void
    selectedStoreId: string | null
    onStoreHover: (storeId: string | null) => void
    availableCategories: StoreCategory[]
}

export function StoreList({ stores, filters, onFiltersChange, selectedStoreId, onStoreHover, availableCategories }: StoreListProps) {
    // Aplicar filtros a las tiendas
    const filteredStores = useMemo(() => filterStores(stores, filters), [stores, filters])

    return (
        <div className="h-full flex flex-col bg-card">
            {/* Header del panel */}
            <div className="p-4 border-b">
                <StoreFiltersPanel
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                    totalResults={filteredStores.length}
                    availableCategories={availableCategories}
                />
            </div>

            {/* Lista de tiendas */}
            <ScrollArea className="flex-1 custom-scrollbar">
                <div className="p-4 space-y-3">
                    {filteredStores.length === 0 ? (
                        // Estado vacío
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <StoreIcon className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-medium text-foreground mb-1">No se encontraron tiendas</h3>
                            <p className="text-sm text-muted-foreground max-w-[250px]">
                                Intenta ajustar los filtros o buscar con otros términos
                            </p>
                        </div>
                    ) : (
                        filteredStores.map((store) => (
                            <StoreCard
                                key={store.id}
                                store={store}
                                isSelected={selectedStoreId === store.id}
                                onHover={() => onStoreHover(store.id)}
                                onLeave={() => onStoreHover(null)}
                            />
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}

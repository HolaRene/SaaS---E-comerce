
"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { ResizablePanels } from "@/components/negocios/resizable-panels"
import { DEFAULT_FILTERS, Department, Store, StoreCategory, StoreFilters } from "@/lib/types-negocios"
import { filterStores } from "@/lib/negocios-utils"
import { StoreList } from "./negocios-lista"
import MapView from "./vista-mapa"
import { Doc } from "../../../convex/_generated/dataModel"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable"

// Función para transformar datos de Convex al tipo Store
function transformTiendaToStore(tienda: Doc<"tiendas">): Store | null {
    try {
        return {
            id: tienda._id,
            nombre: tienda.nombre || "Tienda sin nombre",
            slug: (tienda.nombre || "tienda").toLowerCase().replace(/\s+/g, '-'),
            categoria: tienda.categoria as StoreCategory,
            departamento: tienda.departamento as Department,
            direccion: tienda.direccion || "Dirección no especificada",
            coordenadas: { lat: tienda.lat || 0, lng: tienda.lng || 0 },
            telefono: tienda.telefono || "",
            whatsapp: tienda.configuracion?.whatsapp || "",
            descripcion: tienda.descripcion || "",
            avatar: tienda.avatar || "/placeholder.svg",
            banner: tienda.imgBanner || "",
            rating: tienda.puntuacion || 0,
            totalReviews: 0, // Se puede calcular con otra query si es necesario
            estado: tienda.estado === 'activo' ? 'activo' :
                tienda.estado === 'cerradoTemporal' ? 'cerrado_temporal' : 'cerrado',
            horarios: tienda.horarios?.map(h => ({
                dia: h.dia,
                apertura: h.apertura,
                cierre: h.cierre,
                cerrado: h.cerrado || false
            })) || [],
            delivery: {
                habilitado: tienda.delivery?.habilitado || false,
                costoBase: tienda.delivery?.costo || 0,
                radioKm: 10 // Valor por defecto si no está en el schema
            },
            facturacion: tienda.facturacion?.habilitada || false,
            retiroEnTienda: true, // Valor por defecto
            productosActivos: tienda.estadisticas?.productosActivos || 0,
            ventasTotales: tienda.estadisticas?.ventasTotales || 0,
            clientes: tienda.estadisticas?.clientesTotales || 0,
            fechaCreacion: tienda.creadoEn || new Date().toISOString(),
            verificada: true, // Puedes agregar un campo en el schema si lo necesitas
            nueva: false // Puedes calcular esto basado en la fecha de creación
        }
    } catch (error) {
        console.error("Error transformando tienda:", error, tienda)
        return null
    }
}

export function MarketplaceContainer() {
    const router = useRouter()

    // Obtener tiendas públicas de Convex
    const tiendasConvex = useQuery(api.tiendas.getTiendasPublicas)

    // Transformar tiendas de Convex a tipo Store
    const allStores = useMemo(() => {
        if (!tiendasConvex) return []
        const transformed = tiendasConvex
            .map(transformTiendaToStore)
            .filter((store): store is Store => store !== null)

        return transformed
    }, [tiendasConvex])

    // Estado de filtros
    const [filters, setFilters] = useState<StoreFilters>(DEFAULT_FILTERS)

    // Estado de selección
    const [selectedStore, setSelectedStore] = useState<Store | null>(null)
    const [hoveredStoreId, setHoveredStoreId] = useState<string | null>(null)

    // Tiendas filtradas para el mapa
    const filteredStores = useMemo(() => filterStores(allStores, filters), [allStores, filters])

    // Obtener categorías disponibles basadas en las tiendas cargadas
    const availableCategories = useMemo(() => {
        const categories = new Set<StoreCategory>()
        allStores.forEach(store => {
            if (store.categoria) {
                categories.add(store.categoria)
            }
        })
        return Array.from(categories).sort()
    }, [allStores])

    const handleStoreSelect = useCallback(
        (store: Store | null) => {
            setSelectedStore(store)
            // No redirigir automáticamente, permitir ver el popup en el mapa
            // if (store) {
            //     router.push(`/user/negocio/${store.id}`)
            // }
        },
        [],
    )

    const handleStoreHover = useCallback((storeId: string | null) => {
        setHoveredStoreId(storeId)
    }, [])

    const handleFiltersChange = useCallback((newFilters: StoreFilters) => {
        setFilters(newFilters)
    }, [])

    // Mostrar loading mientras se cargan las tiendas
    if (!tiendasConvex) {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando tiendas...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col bg-background">

            {/* Contenido principal */}
            <main className="flex-1 overflow-hidden">
                {/* VERSIÓN ESCRITORIO CON SHADCN/RESIZABLE */}
                <div className="hidden lg:block h-full">
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={60} minSize={45} maxSize={75}>
                            <MapView
                                stores={filteredStores}
                                selectedStore={selectedStore}
                                hoveredStoreId={hoveredStoreId}
                                onStoreSelect={handleStoreSelect}
                            />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={40} minSize={25} maxSize={55}>
                            <StoreList
                                stores={allStores}
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                selectedStoreId={selectedStore?.id ?? null}
                                onStoreHover={handleStoreHover}
                                availableCategories={availableCategories}
                            />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>

                {/* VERSIÓN MÓVIL (sin cambios) */}
                <div className="lg:hidden h-full overflow-y-auto">
                    <div className="min-h-[50vh]">
                        <StoreList
                            stores={allStores}
                            filters={filters}
                            onFiltersChange={handleFiltersChange}
                            selectedStoreId={selectedStore?.id ?? null}
                            onStoreHover={handleStoreHover}
                            availableCategories={availableCategories}
                        />
                    </div>
                    <div className="h-[60vh] border-t">
                        <MapView
                            stores={filteredStores}
                            selectedStore={selectedStore}
                            hoveredStoreId={hoveredStoreId}
                            onStoreSelect={handleStoreSelect}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}

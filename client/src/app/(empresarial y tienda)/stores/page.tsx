"use client"


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, stores as initialStores } from "@/lib/data-store"
import { Edit3, Eye, Plus } from "lucide-react"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import { StoreSearch } from "./_components/store-search"
import { StoreFilters } from "./_components/store-filters"
import { StoreGrid } from "./_components/store-grid"
import { CreateStoreForm } from "./_components/create-store-form"
import { BulkActions } from "./_components/bulk-actions"

const Page = () => {
    const [stores, setStores] = useState<Store[]>(initialStores)
    const [selectedRegion, setSelectedRegion] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")


    // Filter stores based on region, status, and search query
    // Filters are applied in cascade: region -> status -> search
    const filteredStores = stores.filter((store) => {
        // Region filter
        if (selectedRegion !== "all" && store.region !== selectedRegion) {
            return false
        }

        // Status filter
        if (selectedStatus !== "all" && store.status !== selectedStatus) {
            return false
        }

        // Search filter (searches in name, region, and manager)
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            return (
                store.name.toLowerCase().includes(query) ||
                store.region.toLowerCase().includes(query) ||
                store.manager?.toLowerCase().includes(query)
            )
        }

        return true
    })

    // Toggle store status with immediate feedback
    const handleToggleStatus = (id: number, currentStatus: Store["status"]) => {
        setStores((prev) =>
            prev.map((store) => {
                if (store.id === id) {
                    const newStatus = currentStatus === "active" ? "inactive" : "active"
                    toast(`${store.name} ahora está ${newStatus === "active" ? "activo" : "inactivo"}`)
                    return { ...store, status: newStatus }
                }
                return store
            }),
        )
    }

    const handleEdit = (store: Store) => {
        toast(`Editando ${store.name}`)
        // In a real app, this would open an edit dialog or navigate to edit page
    }

    const handleDelete = (id: number) => {
        const store = stores.find((s) => s.id === id)
        setStores((prev) => prev.filter((s) => s.id !== id))
        toast(`${store?.name} ha sido eliminada`)
    }

    const handleCreateStore = (data: any) => {
        const newStore: Store = {
            id: Math.max(...stores.map((s) => s.id)) + 1,
            name: data.name,
            region: data.region,
            status: "active",
            sales: 0,
            employees: 0,
            lastUpdated: new Date().toISOString().split("T")[0],
            address: data.address,
            phone: data.phone,
            email: data.email,
            manager: data.manager,
            hours: data.hours,
            categories: data.categories.split(",").map((c: string) => c.trim()),
        }

        setStores((prev) => [...prev, newStore])
        toast({
            title: "Tienda creada",
            description: `${newStore.name} ha sido creada exitosamente`,
        })
    }

    const handleBulkUpdate = (storeIds: number[], updates: Partial<Store>) => {
        setStores((prev) =>
            prev.map((store) => {
                if (storeIds.includes(store.id)) {
                    return { ...store, ...updates, lastUpdated: new Date().toISOString().split("T")[0] }
                }
                return store
            }),
        )

        toast(`${storeIds.length} tienda(s) actualizada(s) exitosamente`)
    }

    // Memoize search handler to prevent unnecessary re-renders
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query)
    }, [])
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-8 px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Gestión de Tiendas</h1>
                    <p className="text-muted-foreground">Administra todas tus tiendas desde un solo lugar</p>
                </div>
                <Tabs defaultValue="list" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
                        <TabsTrigger value="list" className="gap-2">
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:blok">Listado de</span> Tiendas
                        </TabsTrigger>
                        <TabsTrigger value="create" className="gap-2">
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:blok">Crear</span> Nueva Tienda
                        </TabsTrigger>
                        <TabsTrigger value="bulk" className="gap-2">
                            <Edit3 className="h-4 w-4" />
                            Edición <span className="hidden sm:blok">Masiva</span>
                        </TabsTrigger>
                    </TabsList>
                    {/* Tab 1: Store Listing */}
                    <TabsContent value="list" className="space-y-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <StoreSearch onSearch={handleSearch} />
                            </div>
                            <div className="lg:w-auto">
                                <StoreFilters
                                    selectedRegion={selectedRegion}
                                    selectedStatus={selectedStatus}
                                    onRegionChange={setSelectedRegion}
                                    onStatusChange={setSelectedStatus}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Mostrando {filteredStores.length} de {stores.length} tiendas
                            </p>
                        </div>

                        <StoreGrid
                            stores={filteredStores}
                            onToggleStatus={handleToggleStatus}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </TabsContent>
                    {/* Tab 2: Create New Store */}
                    <TabsContent value="create">
                        <CreateStoreForm onSubmit={handleCreateStore} />
                    </TabsContent>
                    {/* Tab 3: Bulk Edit */}
                    <TabsContent value="bulk">
                        <BulkActions stores={stores} onBulkUpdate={handleBulkUpdate} />
                    </TabsContent>
                </Tabs>

            </div>
        </div>
    )
}

export default Page
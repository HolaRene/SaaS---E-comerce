"use client"

import dynamic from "next/dynamic"
import { Store } from "@/lib/types-negocios"

interface MapViewProps {
    stores: Store[]
    selectedStore: Store | null
    hoveredStoreId: string | null
    onStoreSelect: (store: Store | null) => void
}

const MapaLeaflet = dynamic(() => import("./mapa-leaflet"), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center bg-muted/20">
            <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Cargando mapa...</p>
            </div>
        </div>
    ),
})

export default function MapView(props: MapViewProps) {
    return <MapaLeaflet {...props} />
}

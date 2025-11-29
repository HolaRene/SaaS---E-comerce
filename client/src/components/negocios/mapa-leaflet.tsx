"use client"

import { useEffect, useMemo } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Store } from "@/lib/types-negocios"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { StoreIcon, MapPin, Navigation } from "lucide-react"

// Fix for default marker icon in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png"
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"

const defaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

// Custom icon for selected store
const selectedIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

interface MapViewProps {
    stores: Store[]
    selectedStore: Store | null
    hoveredStoreId: string | null
    onStoreSelect: (store: Store | null) => void
}

// Component to handle map center updates
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap()
    useEffect(() => {
        map.setView(center, zoom)
    }, [center, zoom, map])
    return null
}

export default function MapaLeaflet({ stores, selectedStore, hoveredStoreId, onStoreSelect }: MapViewProps) {
    // Center of Nicaragua
    const defaultCenter: [number, number] = [12.865416, -85.207229]
    const defaultZoom = 7

    const center = useMemo(() => {
        if (selectedStore && selectedStore.coordenadas) {
            return [selectedStore.coordenadas.lat, selectedStore.coordenadas.lng] as [number, number]
        }
        return defaultCenter
    }, [selectedStore])

    const zoom = useMemo(() => {
        if (selectedStore) return 15
        return defaultZoom
    }, [selectedStore])

    return (
        <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapUpdater center={center} zoom={zoom} />

            {stores.map((store) => (
                <Marker
                    key={store.id}
                    position={[store.coordenadas.lat, store.coordenadas.lng]}
                    icon={selectedStore?.id === store.id || hoveredStoreId === store.id ? selectedIcon : defaultIcon}
                    eventHandlers={{
                        click: () => onStoreSelect(store),
                    }}
                >
                    <Popup>
                        <div className="p-2 min-w-[200px]">
                            <h3 className="font-bold text-base mb-1">{store.nombre}</h3>
                            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {store.direccion}
                            </p>
                            <div className="flex gap-2">
                                <Link href={`/user/negocio/${store.id}`} className="w-full">
                                    <Button
                                        size="sm"
                                        className="w-full h-8 text-xs"
                                    >
                                        <StoreIcon className="w-3 h-3 mr-1" />
                                        Ver Tienda
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}

"use client"

import * as React from "react"
import type { LatLngExpression } from "leaflet"
import Link from "next/link"


type Tienda = {
    _id: string
    nombre?: string
    imgBanner?: string
    descripcion?: string
    departamento?: string
    categoria?: string
    lat?: number
    lng?: number
}

export default function MapPreview({
    tiendas,
    height = '400px',
    initialCenter = { lat: 0, lng: 0 },
    initialZoom = 13,
    onMarkerClick,
}: {
    tiendas: Tienda[]
    height?: string | number
    initialCenter?: { lat: number; lng: number }
    initialZoom?: number
    onMarkerClick?: (id: string) => void
}) {
    const tiendasConCoords = React.useMemo(() => tiendas.filter(t => typeof t.lat === 'number' && typeof t.lng === 'number'), [tiendas])

    const [leafletReady, setLeafletReady] = React.useState(false)
    const [LeafletComponents, setLeafletComponents] = React.useState<any>(null)

    React.useEffect(() => {
        let mounted = true

        async function loadLeaflet() {
            if (typeof window === 'undefined') return
            try {
                await import('leaflet/dist/leaflet.css')
                const L = await import('leaflet')
                // fix icon paths
                try {
                    delete (L.Icon.Default.prototype as any)._getIconUrl
                    L.Icon.Default.mergeOptions({
                        iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).toString(),
                        iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString(),
                        shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString(),
                    })
                } catch (e) {
                    console.error('Error setting Leaflet icon URLs')
                }

                const RL = await import('react-leaflet')
                if (!mounted) return
                setLeafletComponents({ MapContainer: RL.MapContainer, TileLayer: RL.TileLayer, Marker: RL.Marker, Popup: RL.Popup })
                setLeafletReady(true)
            } catch (e) {
                // fail silently; leaflet may not be available during SSR build
                console.error('Error cargando Leaflet dinámicamente')
            }
        }

        loadLeaflet()
        return () => { mounted = false }
    }, [])

    const center: LatLngExpression = tiendasConCoords.length > 0 ? [tiendasConCoords[0].lat!, tiendasConCoords[0].lng!] : [initialCenter.lat, initialCenter.lng]

    if (!leafletReady || !LeafletComponents) {
        return <div style={{ height: typeof height === 'number' ? `${height}px` : height, width: '100%' }} className="bg-gray-100 flex items-center justify-center">Cargando mapa…</div>
    }

    const { MapContainer: RLMapContainer, TileLayer: RLTileLayer, Marker: RLMarker, Popup: RLPopup } = LeafletComponents

    return (
        <div style={{ height: typeof height === 'number' ? `${height}px` : height, width: '100%' }}>
            <RLMapContainer center={center as LatLngExpression} zoom={initialZoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <RLTileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Z</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {tiendasConCoords.map((t: any) => (
                    <RLMarker key={t._id} position={[t.lat, t.lng] as LatLngExpression} eventHandlers={{ click: () => onMarkerClick?.(t._id) }}>
                        <RLPopup>
                            <div className="max-w-xs">
                                <Link href={`/comercio/${t._id}`}><h3 className="font-bold">{t.nombre}</h3></Link>
                                {t.imgBanner && <img src={t.imgBanner} alt={t.nombre} className="w-full h-24 object-cover rounded mt-2" />}
                                {t.descripcion && <p className="text-sm mt-2">{t.descripcion}</p>}
                            </div>
                        </RLPopup>
                    </RLMarker>
                ))}
            </RLMapContainer>
        </div>
    )
}

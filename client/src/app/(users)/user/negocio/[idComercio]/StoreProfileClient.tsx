"use client"

import * as React from "react"
import { useQuery } from "convex/react"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { StoreProfilePage } from "@/components/negocios/negocio-perfil-page"
import { api } from "../../../../../../convex/_generated/api"
import { Id } from "../../../../../../convex/_generated/dataModel"

type Props = {
    idComercio: string | Promise<string>
}

export default function StoreProfileClient({ idComercio }: Props) {
    const id = typeof idComercio === "string" ? idComercio : undefined

    // Cast al tipo Id<'tiendas'> que usan las queries generadas
    // Usar getTiendaPublicaById para asegurar que solo se muestren tiendas públicas
    const tienda = useQuery(api.tiendas.getTiendaPublicaById, {
        id: id as unknown as Id<"tiendas">,
    })

    if (tienda === undefined) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando tienda...</p>
                </div>
            </div>
        )
    }

    if (!tienda) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-semibold mb-2">Tienda no encontrada</p>
                    <p className="text-muted-foreground">Esta tienda no existe o no está disponible públicamente.</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* Componente principal existente que muestra perfil y tabs */}
            <StoreProfilePage {...tienda} />

            {/* Mapa: si hay lat/lng mostramos react-leaflet */}
            {typeof tienda.lat === "number" && typeof tienda.lng === "number" && (
                <div className="mt-6 h-72 w-full rounded-md overflow-hidden">
                    <MapContainer center={[tienda.lat, tienda.lng]} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Rusia</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[tienda.lat, tienda.lng]}>
                            <Popup>
                                {tienda.nombre}
                                <br />
                                {tienda.direccion}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            )}
        </div>
    )
}

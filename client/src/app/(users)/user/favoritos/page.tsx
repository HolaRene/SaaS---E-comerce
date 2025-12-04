"use client"

import NotificacionFavoritos from "./_components/notificacionFavoritos"
import TiendasSeguidas from "./_components/tiendas-seguidas"
import ProductosGuardados from "./_components/productos-guardados"




export default function FavoritesTab() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Tus favoritos</h2>
                <p className="text-muted-foreground">Comercios y productos que te interesan</p>
            </div>

            {/* Notifications */}
            <NotificacionFavoritos />

            {/* Followed Stores */}
            <TiendasSeguidas />

            {/* Saved Products */}
            <ProductosGuardados />
        </div>
    )
}

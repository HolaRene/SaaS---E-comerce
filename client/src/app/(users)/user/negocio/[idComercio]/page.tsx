/**
 * PÁGINA DE PERFIL DE TIENDA
 * Ruta: /comercio/[id]/tienda
 * Muestra información completa de la tienda con tabs de productos, info y reseñas
 */

import StoreProfileClient from "./StoreProfileClient"
import { notFound } from "next/navigation"

interface StorePageProps {
    params: Promise<{ idComercio: string }>
}

export default async function StorePage({ params }: StorePageProps) {
    const { idComercio } = await params

    // Renderizamos un cliente que hará la consulta a Convex.
    // Si prefieres SSR completo, podemos usar ConvexHttpClient en el servidor.
    if (!idComercio) notFound()

    return <StoreProfileClient idComercio={idComercio} />
}

// Metadata dinámica mínima (puede mejorarse después de obtener datos en cliente)
export async function generateMetadata({ params }: StorePageProps) {
    const { idComercio } = await params
    if (!idComercio) {
        return { title: "Tienda no encontrada | Marketplace Tiendas" }
    }

    return {
        title: `Tienda | Marketplace Tiendas`,
    }
}

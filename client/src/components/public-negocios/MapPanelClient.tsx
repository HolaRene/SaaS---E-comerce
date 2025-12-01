"use client"

import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import MapPreview from './MapPreview'
import SpinnerLoader from './SpinnerLoader'
import EmptyState from './EmptyState'
import { useRouter, useSearchParams } from 'next/navigation'

export default function MapPanelClient({ initialCenter = { lat: 0, lng: 0 }, initialZoom = 13, embedded = false }: { initialCenter?: { lat: number; lng: number }, initialZoom?: number, embedded?: boolean }) {
    const searchParams = useSearchParams()
    const propSearch = ''
    const search = searchParams?.get('busqueda') ?? propSearch
    const rawDepartamento = searchParams?.get('departamento') ?? undefined
    const rawCategoria = searchParams?.get('categoria') ?? undefined
    const rawPuntuacion = searchParams?.get('puntuacionMinima') ?? undefined

    const departamento = rawDepartamento === 'all' ? undefined : rawDepartamento
    const categoria = rawCategoria === 'all' ? undefined : rawCategoria
    const puntuacionMinima = rawPuntuacion && rawPuntuacion !== 'all' ? Number(rawPuntuacion) : undefined

    const isFiltering = (search && search.trim() !== '') || departamento || categoria || puntuacionMinima !== undefined

    // Use the same queries as ListaNegocios so the map reflects filters
    const tiendasFiltradas = useQuery(api.tiendas.buscarTiendas, { search, departamento, categoria, puntuacionMinima })
    const tiendasPublicas = useQuery(api.tiendas.getTiendasPublicas)

    const tiendas = isFiltering ? tiendasFiltradas : tiendasPublicas

    // const router = useRouter()

    // Calculate navbar/header height so the map doesn't overlap when sticky
    const [topOffset, setTopOffset] = React.useState(64)

    React.useEffect(() => {
        if (embedded) return // embedded (mobile) should not set sticky offsets
        const header = document.querySelector('header') || document.querySelector('nav') || document.querySelector('[data-navbar]')
        const h = header instanceof HTMLElement ? header.getBoundingClientRect().height : 64
        setTopOffset(Math.max(0, Math.round(h)))
    }, [embedded])

    if (!tiendas) return (
        <div className="h-full flex items-center justify-center">
            <SpinnerLoader />
        </div>
    )

    if (tiendas.length === 0) return (
        <div className="h-full flex items-center justify-center">
            <EmptyState title="No hay tiendas públicas" />
        </div>
    )

    // If embedded (mobile) just fill parent's height
    if (embedded) {
        return (
            <div className="h-full p-3">
                <div style={{ height: '100%', width: '100%' }}>
                    <MapPreview tiendas={tiendas} height="100%" initialCenter={initialCenter} initialZoom={initialZoom} />
                </div>
            </div>
        )
    }

    return (
        <div className="h-full p-3">
            <div style={{ position: 'sticky', top: `${topOffset}px`, zIndex: 0, height: `calc(100vh - ${topOffset}px)`, overflow: 'hidden' }}>
                <MapPreview tiendas={tiendas} height="100%" initialCenter={initialCenter} initialZoom={initialZoom} />
            </div>
        </div>
    )
}

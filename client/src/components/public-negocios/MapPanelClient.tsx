"use client"

import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import MapPreview from './MapPreview'
import SpinnerLoader from './SpinnerLoader'
import EmptyState from './EmptyState'
import { useSearchParams } from 'next/navigation' // ✅ Eliminado useRouter

export default function MapPanelClient({
    initialCenter = { lat: 0, lng: 0 },
    initialZoom = 13,
    embedded = false
}: {
    initialCenter?: { lat: number; lng: number },
    initialZoom?: number,
    embedded?: boolean
}) {
    // ✅ 1. TODOS LOS HOOKS AL INICIO
    const searchParams = useSearchParams()
    const [topOffset, setTopOffset] = React.useState(64)

    // Lógica de filtros
    const propSearch = ''
    const search = searchParams?.get('busqueda') ?? propSearch
    const rawDepartamento = searchParams?.get('departamento') ?? undefined
    const rawCategoria = searchParams?.get('categoria') ?? undefined
    const rawPuntuacion = searchParams?.get('puntuacionMinima') ?? undefined

    const departamento = rawDepartamento === 'all' ? undefined : rawDepartamento
    const categoria = rawCategoria === 'all' ? undefined : rawCategoria
    const puntuacionMinima = rawPuntuacion && rawPuntuacion !== 'all' ? Number(rawPuntuacion) : undefined
    const isFiltering = (search && search.trim() !== '') || departamento || categoria || puntuacionMinima !== undefined

    // Queries
    const tiendasFiltradas = useQuery(api.tiendas.buscarTiendas, { search, departamento, categoria, puntuacionMinima })
    const tiendasPublicas = useQuery(api.tiendas.getTiendasPublicas)
    const tiendas = isFiltering ? tiendasFiltradas : tiendasPublicas

    // ✅ 2. useEffect DESPUÉS de useState/useQuery, ANTES de returns
    React.useEffect(() => {
        if (embedded) return

        const calculateOffset = () => {
            const navbar = document.querySelector('[data-navbar]') ||
                document.querySelector('header') ||
                document.querySelector('nav')
            const h = navbar instanceof HTMLElement ? navbar.getBoundingClientRect().height : 64
            setTopOffset(Math.max(0, Math.round(h)))
        }

        calculateOffset()
        window.addEventListener('resize', calculateOffset)
        return () => window.removeEventListener('resize', calculateOffset)
    }, [embedded])

    // ✅ 3. EARLY RETURNS DESPUÉS de todos los hooks
    if (!tiendas) {
        return <div className="h-full flex items-center justify-center"><SpinnerLoader /></div>
    }

    if (tiendas.length === 0) {
        return <div className="h-full flex items-center justify-center"><EmptyState title="No hay tiendas públicas" /></div>
    }

    // ✅ 4. Renderizado condicional AL FINAL
    if (!embedded) {
        return (
            <div className="h-full min-h-0 flex flex-col">
                <div
                    className="relative flex-1 min-h-0"
                    style={{
                        position: 'sticky',
                        top: `${topOffset}px`,
                        zIndex: 1,
                        height: `calc(100vh - ${topOffset}px)`,
                    }}
                >
                    <MapPreview tiendas={tiendas} height="100%" initialCenter={initialCenter} initialZoom={initialZoom} />
                </div>
            </div>
        )
    }

    return (
        <div className="h-full p-2">
            <div style={{ height: '100%', width: '100%' }}>
                <MapPreview tiendas={tiendas} height="100%" initialCenter={initialCenter} initialZoom={initialZoom} />
            </div>
        </div>
    )
}
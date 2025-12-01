"use client"

import { useQuery } from "convex/react"
import SearchBar from "./Searchbar"
import { api } from "../../../convex/_generated/api"
import TiendaCard from "./TarjetaTienda"
import EmptyState from "./EmptyState"
import SpinnerLoader from "./SpinnerLoader"
import { useSearchParams } from 'next/navigation'
import React from 'react'

const ListaNegocios = ({ busqueda }: { busqueda?: string }) => {
    const searchParams = useSearchParams()
    const propSearch = busqueda || ''
    const search = searchParams?.get('busqueda') ?? propSearch
    const rawDepartamento = searchParams?.get('departamento') ?? undefined
    const rawCategoria = searchParams?.get('categoria') ?? undefined
    const rawPuntuacion = searchParams?.get('puntuacionMinima') ?? undefined

    const departamento = rawDepartamento === 'all' ? undefined : rawDepartamento
    const categoria = rawCategoria === 'all' ? undefined : rawCategoria
    const puntuacionMinima = rawPuntuacion && rawPuntuacion !== 'all' ? Number(rawPuntuacion) : undefined

    const busquedaTiendas = useQuery(api.tiendas.buscarTiendas, { search: search, departamento, categoria, puntuacionMinima })


    // Obtener tiendas públicas de Convex
    const tiendasConvex = useQuery(api.tiendas.getTiendasPublicas)

    const isFiltering = (search && search.trim() !== '') || departamento || categoria || puntuacionMinima !== undefined
    const tiendasToShow = isFiltering ? busquedaTiendas : tiendasConvex

    return (
        <div className="h-full flex flex-col">
            <SearchBar />
            <div className='flex flex-col gap-5 p-3'>
                <h1 className="font-bold pl-3">Descubre tiendas flexis</h1>
                <div className="flex flex-col gap-5">
                    {tiendasToShow ? (
                        tiendasToShow.length > 0 ? (
                            <div className="flex flex-col gap-5">
                                {tiendasToShow.map(({ _id, imgBanner, nombre, descripcion, departamento, categoria }: any) => (
                                    <TiendaCard key={_id} imgUrl={imgBanner!}
                                        description={descripcion}
                                        title={nombre}
                                        departamento={departamento}
                                        categoria={categoria}
                                        tiendaId={_id} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState title="No hay resultado a la búsqueda" />
                        )
                    ) : <SpinnerLoader />}
                </div>
            </div>
        </div>
    )
}

export default ListaNegocios
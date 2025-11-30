"use client"

import { useQuery } from "convex/react"
import SearchBar from "./Searchbar"
import { api } from "../../../convex/_generated/api"
import TiendaCard from "./TarjetaTienda"
import EmptyState from "./EmptyState"
import SpinnerLoader from "./SpinnerLoader"
import { useSearchParams } from 'next/navigation'

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
    // console.log("tiendas buscadas:", { search, departamento, categoria, puntuacionMinima }, busquedaTiendas)

    // Obtener tiendas públicas de Convex
    const tiendasConvex = useQuery(api.tiendas.getTiendasPublicas)

    return (
        <div className="h-full flex flex-col">
            <SearchBar />
            <div className='flex flex-col gap-5 p-3'>
                <h1 className="font-bold pl-3">Descubre tiendas flexis</h1>
                <div className="flex flex-col gap-5">
                    {
                        // Si hay filtros o búsqueda, mostrar resultados de la búsqueda
                        (search && search.trim() !== '') || departamento || categoria || puntuacionMinima !== undefined ? (
                            busquedaTiendas ? (
                                busquedaTiendas.length > 0 ? (
                                    <div className="flex flex-col gap-5">
                                        {busquedaTiendas.map(({ _id, imgBanner, nombre, descripcion, departamento, categoria }) => (
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
                            ) : <SpinnerLoader />
                        ) : (
                            tiendasConvex ? (
                                tiendasConvex.length > 0 ? (
                                    <div className="flex flex-col gap-5">
                                        {tiendasConvex.map(({ _id, imgBanner, nombre, descripcion, departamento, categoria }) => (
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
                            ) : <SpinnerLoader />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ListaNegocios
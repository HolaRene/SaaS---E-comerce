"use client"

import { useQuery } from "convex/react"
import SearchBar from "./Searchbar"
import { api } from "../../../convex/_generated/api"
import TiendaCard from "./TarjetaTienda"
import EmptyState from "./EmptyState"
import SpinnerLoader from "./SpinnerLoader"

const ListaNegocios = () => {
    // Obtener tiendas públicas de Convex
    const tiendasConvex = useQuery(api.tiendas.getTiendasPublicas)

    return (
        <div className="h-full flex flex-col">
            <SearchBar />
            <div className='flex flex-col gap-5 p-3'>
                <h1 className="font-bold pl-3">Descubre tiendas flexis</h1>
                <div className="flex flex-col gap-5">
                    {
                        tiendasConvex ? (<>
                            {tiendasConvex.length > 0 ? (<div className="flex flex-col gap-5">
                                {tiendasConvex?.map(({ _id, imgBanner, nombre, descripcion, departamento, categoria }) => (
                                    <TiendaCard key={_id} imgUrl={imgBanner!}
                                        description={descripcion}
                                        title={nombre}
                                        departamento={departamento}
                                        categoria={categoria}
                                        tiendaId={_id} />
                                ))}
                            </div>) : (<EmptyState title="No hay resultado a la busqueda" />)}
                        </>) : <SpinnerLoader />
                    }
                </div>
            </div>
        </div>
    )
}

export default ListaNegocios
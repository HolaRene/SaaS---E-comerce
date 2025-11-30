"use client"

import Image from "next/image"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useDebounce } from "@/lib/useDebounce"
import { Search } from "lucide-react"

const SearchBar = () => {
    const [busqueda, setBusqueda] = useState('')
    const ruta = useRouter()
    const pathname = usePathname()

    const valorTiempo = useDebounce(busqueda, 500)

    useEffect(() => {
        if (busqueda) {
            ruta.push(`/descubre?busqueda=${busqueda}`)
        } else if (!busqueda && pathname === '/descubre') {
            ruta.push('/descubre')
        }
    }, [pathname, ruta, valorTiempo])

    return (
        <div className='relative mt-8 block '>
            <Input className="text-[16px] leading-normal  bg-black-1 rounded-[6px] placeholder:text-gray-1 border-none text-gray-1 py-6 pl-12 focus-visible:ring-offset-orange-1" placeholder="Buscar tiendas flexis" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                onLoad={() => setBusqueda('')} />
            <Search className="absolute left-4 top-3.5 " />
        </div>
    )
}

export default SearchBar
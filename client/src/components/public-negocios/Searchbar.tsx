"use client"

import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useDebounce } from "@/lib/useDebounce"
import { Search } from "lucide-react"
import { useSearchParams } from 'next/navigation'
import { departamentosNicaragua, } from "@/types/filtro"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CATEGORIAS } from "@/lib/crear-tienda-datos"

const SearchBar = () => {
    const [busqueda, setBusqueda] = useState('')
    const searchParams = useSearchParams()
    const [departamento, setDepartamento] = useState('all')
    const [rating, setRating] = useState('all')
    const [categoria, setCategoria] = useState('all')
    const ruta = useRouter()
    const pathname = usePathname()

    const valorTiempo = useDebounce(busqueda, 500)

    useEffect(() => {
        // Inicializar desde params (cuando se monta el componente)
        setBusqueda(searchParams.get('busqueda') ?? '')
        setDepartamento(searchParams.get('departamento') ?? 'all')
        setRating(searchParams.get('puntuacionMinima') ?? 'all')
        setCategoria(searchParams.get('categoria') ?? 'all')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const params = new URLSearchParams()
        if (valorTiempo && valorTiempo.trim() !== '') params.set('busqueda', valorTiempo)
        if (departamento && departamento !== 'all') params.set('departamento', departamento)
        if (rating && rating !== 'all') params.set('puntuacionMinima', rating)
        if (categoria && categoria !== 'all') params.set('categoria', categoria)

        const query = params.toString()

        if (query) {
            ruta.push(`/comercios?${query}`)
        } else {
            // Si no quedan parámetros, navegar a la ruta base de comercios (borra query)
            ruta.push('/comercios')
        }
        // Dependencias: actualiza al cambiar busqueda (debounced), departamento o rating
    }, [valorTiempo, departamento, rating, categoria, pathname, ruta])

    return (
        <div className='relative mt-5 block px-3'>
            <div className="flex flex-col sm:flex-row lg:flex-col lg:items-start gap-2">
                <Input className="w-full text-[16px] leading-normal bg-black-1 rounded-[6px] placeholder:text-gray-1 border-none text-gray-1 py-3 pl-12 focus-visible:ring-offset-orange-1" placeholder="Buscar tiendas flexis" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                    onLoad={() => setBusqueda('')} />

                <div className="flex w-full sm:w-auto gap-2 flex-col sm:flex-row lg:flex-col">
                    <Select value={departamento} onValueChange={(val) => setDepartamento(val)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Departamento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los departamentos</SelectItem>
                            {departamentosNicaragua.map((dept) => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={rating} onValueChange={(val) => setRating(val)}>
                        <SelectTrigger className="w-full sm:w-[100px]">
                            <SelectValue placeholder="Rating" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="1">1+</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={categoria} onValueChange={(val) => setCategoria(val)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las categorías</SelectItem>
                            {CATEGORIAS.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Search className="absolute left-4 top-3.5 " />
        </div>
    )
}

export default SearchBar
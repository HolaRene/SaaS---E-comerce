"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

interface StoreSearchProps {
    onSearch: (query: string) => void
}

export function StoreSearch({ onSearch }: StoreSearchProps) {
    const [query, setQuery] = useState("")

    // Debounce search with 300ms delay
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query)
        }, 300)

        return () => clearTimeout(timer)
    }, [query, onSearch])

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Buscar tiendas por nombre, región o administrador..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
            />
        </div>
    )
}

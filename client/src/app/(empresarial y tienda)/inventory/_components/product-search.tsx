"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useTransition } from "react"

interface ProductSearchProps {
    value: string
    onChange: (value: string) => void
}

export function ProductSearch({ value, onChange }: ProductSearchProps) {
    const [isPending, startTransition] = useTransition()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        // Use startTransition for non-urgent updates (debounced search)
        startTransition(() => {
            onChange(newValue)
        })
    }

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nombre o SKU..." value={value} onChange={handleChange} className="pl-9" />
            {isPending && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            )}
        </div>
    )
}

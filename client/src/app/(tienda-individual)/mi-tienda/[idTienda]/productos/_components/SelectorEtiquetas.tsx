"use client"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Plus } from "lucide-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../../../../convex/_generated/api"
import { Id } from "../../../../../../../convex/_generated/dataModel"
import { toast } from "sonner"

interface SelectorEtiquetasProps {
    tiendaId: Id<"tiendas">
    etiquetasSeleccionadas: Id<"etiquetas">[]
    onEtiquetasChange: (etiquetas: Id<"etiquetas">[]) => void
}

export function SelectorEtiquetas({
    tiendaId,
    etiquetasSeleccionadas,
    onEtiquetasChange
}: SelectorEtiquetasProps) {

    const [nuevaEtiqueta, setNuevaEtiqueta] = useState("")
    const [creando, setCreando] = useState(false)

    const etiquetasDisponibles = useQuery(api.etiquetas.getByTienda, { tiendaId })
    const crearEtiqueta = useMutation(api.etiquetas.crearEtiqueta)
    const handleCrearEtiqueta = async () => {
        if (!nuevaEtiqueta.trim()) {
            toast.error("Ingresa un nombre para la etiqueta")
            return
        }
        try {
            setCreando(true)
            const nuevaEtiquetaId = await crearEtiqueta({
                nombre: nuevaEtiqueta.trim(),
                tiendaId,
                color: "#" + Math.floor(Math.random() * 16777215).toString(16), // Color aleatorio
            })

            // Agregar automáticamente a seleccionadas
            onEtiquetasChange([...etiquetasSeleccionadas, nuevaEtiquetaId])
            setNuevaEtiqueta("")
            toast.success("Etiqueta creada")
        } catch (error) {
            toast.error("Error al crear etiqueta")
            console.error(error)
        } finally {
            setCreando(false)
        }
    }
    const toggleEtiqueta = (etiquetaId: Id<"etiquetas">) => {
        if (etiquetasSeleccionadas.includes(etiquetaId)) {
            onEtiquetasChange(etiquetasSeleccionadas.filter(id => id !== etiquetaId))
        } else {
            onEtiquetasChange([...etiquetasSeleccionadas, etiquetaId])
        }
    }
    return (
        <div className="space-y-4">
            <Label>Etiquetas</Label>

            {/* Etiquetas disponibles */}
            <div className="flex flex-wrap gap-2">
                {etiquetasDisponibles === undefined ? (
                    <p className="text-sm text-muted-foreground">Cargando...</p>
                ) : etiquetasDisponibles.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay etiquetas. Crea una abajo.</p>
                ) : (
                    etiquetasDisponibles.map(etiqueta => {
                        const seleccionada = etiquetasSeleccionadas.includes(etiqueta._id)
                        return (
                            <Badge
                                key={etiqueta._id}
                                variant={seleccionada ? "default" : "outline"}
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                style={seleccionada ? { backgroundColor: etiqueta.color } : {}}
                                onClick={() => toggleEtiqueta(etiqueta._id)}
                            >
                                {etiqueta.icono} {etiqueta.nombre}
                                {seleccionada && <X className="ml-1 h-3 w-3" />}
                            </Badge>
                        )
                    })
                )}
            </div>
            {/* Crear nueva etiqueta */}
            <div className="flex gap-2">
                <Input
                    placeholder="Nueva etiqueta (ej: Ofertas, Nuevo)"
                    value={nuevaEtiqueta}
                    onChange={(e) => setNuevaEtiqueta(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCrearEtiqueta()}
                />
                <Button
                    type="button"
                    size="sm"
                    onClick={handleCrearEtiqueta}
                    disabled={creando || !nuevaEtiqueta.trim()}
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Crear
                </Button>
            </div>
        </div>
    )
}

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Badge } from "../ui/badge"
import { BadgeCheck, Clock, FileText, Star, Truck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Schedule } from "@/lib/types-negocios"
import { isStoreOpen } from "@/lib/negocios-utils"

interface TiendaCardProps {
    description: string
    imgUrl: string
    departamento: string
    categoria: string
    title: string
    tiendaId: string
    horarios?: Schedule[]
    estado?: string
}

export function getTiendaEstadoInfo(estado: string, horarios: Schedule[]): {
    text: string
    color: 'success' | 'destructive' | 'warning' | 'muted'
    isOpen: boolean
} {
    // Primero verificar estado general de la tienda
    switch (estado) {
        case 'cerrado_temporal':
            return { text: 'Cerrado temporal', color: 'warning', isOpen: false }
        case 'suspendido':
            return { text: 'Suspendido', color: 'muted', isOpen: false }
        case 'cerrado':
            return { text: 'Cerrado', color: 'destructive', isOpen: false }
    }

    // Si está activo, verificar horarios
    const open = isStoreOpen(horarios)
    return open
        ? { text: 'Abierto', color: 'success', isOpen: true }
        : { text: 'Cerrado', color: 'destructive', isOpen: false }
}

const TiendaCard = ({ imgUrl, departamento, categoria, title, tiendaId, estado, horarios }: TiendaCardProps) => {
    const ruta = useRouter()
    console.log(imgUrl)
    // función para manejar las vistas del podcast
    const manejoVistas = () => {
        ruta.push(`/comercio/${tiendaId}`, { scroll: true })
    }
    const statusInfo = getTiendaEstadoInfo(estado, horarios)
    return (
        <div className='w-full border rounded-lg p-4 cursor-pointer' onClick={manejoVistas}>
            <figure className="flex gap-4">
                <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-muted">
                        <Image
                            src={imgUrl}
                            alt={title}
                            width={86}
                            height={86}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    {/* Indicador de verificada */}
                    <div className="absolute bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                        <BadgeCheck className="w-3.5 h-3.5" />
                    </div>

                </div>
                <div className="flex-1 min-w-0">
                    {/* Nombre y categoría */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <h3 className="font-semibold text-foreground truncate">{title}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <span>{categoria}</span>
                                <span className="mx-1">•</span>
                                <span>{departamento}</span>
                            </p>
                        </div>
                    </div>

                    {/* Dirección */}
                    <p className="text-xs text-muted-foreground mt-1 truncate">direccion</p>

                    {/* Rating y estado */}
                    <div className="flex items-center gap-3 mt-2">
                        {/* Rating */}
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">5</span>
                            <span className="text-xs text-muted-foreground">(5)</span>
                        </div>

                        {/* Estado */}
                        <Badge
                            variant="outline"
                            className={cn(
                                "text-xs font-medium",
                                statusInfo.color === "success" && "border-green-500 text-green-600 bg-green-50",
                                statusInfo.color === "destructive" && "border-red-500 text-red-600 bg-red-50",
                                statusInfo.color === "warning" && "border-yellow-500 text-yellow-600 bg-yellow-50",
                                statusInfo.color === "muted" && "border-gray-400 text-gray-500 bg-gray-100",
                            )}
                        >
                            {statusInfo.text}
                        </Badge>
                    </div>

                    {/* Horario de hoy */}
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Horario de hoy</span>
                    </div>

                    {/* Badges de servicios */}
                    <div className="flex flex-wrap gap-1.5 mt-2">

                        <Badge variant="secondary" className="text-xs gap-1 py-0.5">
                            <Truck className="w-3 h-3" />
                            Envíos
                        </Badge>

                        <Badge variant="secondary" className="text-xs gap-1 py-0.5">
                            <FileText className="w-3 h-3" />
                            Factura
                        </Badge>

                        <Badge className="text-xs py-0.5 bg-primary/90">Nueva</Badge>
                    </div>
                </div>
            </figure>
        </div>
    )
}

export default TiendaCard
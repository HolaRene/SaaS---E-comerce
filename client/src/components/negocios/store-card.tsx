/**
 * TARJETA DE TIENDA
 * Componente reutilizable para mostrar una tienda en la lista
 */

"use client"

import { memo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Truck, FileText, Clock, BadgeCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CATEGORY_ICONS, Store } from "@/lib/types-negocios"
import { getStoreStatusInfo, getTodaySchedule } from "@/lib/negocios-utils"

interface StoreCardProps {
    store: Store
    isSelected?: boolean
    onHover?: () => void
    onLeave?: () => void
}

export const StoreCard = memo(function StoreCard({ store, isSelected = false, onHover, onLeave }: StoreCardProps) {
    const statusInfo = getStoreStatusInfo(store)
    const todayHours = getTodaySchedule(store.horarios)

    const [imgSrc, setImgSrc] = useState(store.avatar || "/placeholder.svg")

    return (
        <Link href={`/user/negocio/${store.id}`}>
            <Card
                className={cn(
                    "p-4 cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                    isSelected ? "border-primary bg-primary/5 shadow-md" : "border-transparent hover:border-primary/30",
                )}
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
            >
                <div className="flex gap-3">
                    {/* Avatar de la tienda */}
                    <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-muted">
                            <Image
                                src={imgSrc}
                                alt={store.nombre}
                                width={56}
                                height={56}
                                className="object-cover w-full h-full"
                                onError={() => setImgSrc("/placeholder.svg")}
                            />
                        </div>
                        {/* Indicador de verificada */}
                        {store.verificada && (
                            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                                <BadgeCheck className="w-3.5 h-3.5" />
                            </div>
                        )}
                    </div>

                    {/* Información de la tienda */}
                    <div className="flex-1 min-w-0">
                        {/* Nombre y categoría */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <h3 className="font-semibold text-foreground truncate">{store.nombre}</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <span>{CATEGORY_ICONS[store.categoria]}</span>
                                    <span>{store.categoria}</span>
                                    <span className="mx-1">•</span>
                                    <span>{store.departamento}</span>
                                </p>
                            </div>
                        </div>

                        {/* Dirección */}
                        <p className="text-xs text-muted-foreground mt-1 truncate">{store.direccion}</p>

                        {/* Rating y estado */}
                        <div className="flex items-center gap-3 mt-2">
                            {/* Rating */}
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{store.rating.toFixed(1)}</span>
                                <span className="text-xs text-muted-foreground">({store.totalReviews})</span>
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
                            <span>{todayHours}</span>
                        </div>

                        {/* Badges de servicios */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {store.delivery.habilitado && (
                                <Badge variant="secondary" className="text-xs gap-1 py-0.5">
                                    <Truck className="w-3 h-3" />
                                    Delivery
                                </Badge>
                            )}
                            {store.facturacion && (
                                <Badge variant="secondary" className="text-xs gap-1 py-0.5">
                                    <FileText className="w-3 h-3" />
                                    Factura
                                </Badge>
                            )}
                            {store.nueva && <Badge className="text-xs py-0.5 bg-primary/90">Nueva</Badge>}
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    )
})

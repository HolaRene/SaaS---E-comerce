'use client'

import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Store } from "lucide-react"
import { useQuery } from "convex/react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { api } from "../../../../../../convex/_generated/api"

const Recomendaciones = () => {
    const tiendas = useQuery(api.dashboard.getRecomendaciones);

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold">Recomendaciones para ti</h3>
                    <p className="text-sm text-muted-foreground">Tiendas en tu zona que te podrían interesar</p>
                </div>
                {/* <Button variant="outline" size="sm">
                    Ver más
                </Button> */}
            </div>

            {tiendas === undefined ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[250px] w-full" />)}
                </div>
            ) : tiendas.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay recomendaciones por el momento.</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {tiendas.map((store) => (
                        <Card key={store._id} className="overflow-hidden group hover:border-primary/50 transition-colors">
                            <div className="relative aspect-video">
                                {/* Placeholder/Imagen de banner si existiera, usando avatar por ahora para MVP */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <img
                                    src={store.avatar || "/placeholder.svg"}
                                    alt={store.nombre}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute bottom-2 left-2 z-20 text-white">
                                    <p className="font-semibold">{store.nombre}</p>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        <span>{store.departamento || "Nacional"}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {store.descripcion || "Visita esta tienda y descubre sus productos."}
                                    </p>
                                    <Link href={`/tienda/${store._id}`} className="w-full mt-2">
                                        <Button size="sm" className="w-full gap-2">
                                            <Store className="h-4 w-4" />
                                            Visitar Tienda
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Recomendaciones
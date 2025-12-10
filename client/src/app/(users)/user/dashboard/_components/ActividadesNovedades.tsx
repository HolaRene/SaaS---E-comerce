"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { useQuery } from "convex/react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { api } from "../../../../../../convex/_generated/api"
import { DataTable } from "./data-table"
import { columnsActividad, Actividad } from "./columns-actividad"

const ActividadesNovedades = () => {
    const actividad = useQuery(api.dashboard.getActividadReciente);
    const novedades = useQuery(api.dashboard.getNovedades);

    return (
        <div className=''>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                {/* Recent Activity */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Actividad reciente</CardTitle>
                        <CardDescription>Tus últimas acciones en la plataforma</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {actividad === undefined ? (
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : actividad.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No tienes actividad reciente.</p>
                        ) : (
                            <DataTable columns={columnsActividad} data={actividad as Actividad[]} />
                        )}
                    </CardContent>
                </Card>

                {/* Store News */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Novedades</CardTitle>
                        <CardDescription>Promociones y avisos de tus comercios</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {novedades === undefined ? (
                            <div className="space-y-4">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        ) : novedades.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No hay novedades recientes.</p>
                        ) : (
                            <div className="space-y-4">
                                {novedades.map((news, index) => (
                                    <div key={index} className="flex gap-3 border-b pb-3 last:border-0 last:pb-0">
                                        <div className="flex-shrink-0 mt-1">
                                            <Bell className="h-8 w-8 text-muted-foreground bg-secondary/50 p-1.5 rounded-full" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-semibold">{news.titulo}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{news.mensaje}</p>
                                            {news.tiendaId && (
                                                <Link href={`/tienda/${news.tiendaId}`} passHref>
                                                    <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                                        Ir a tienda →
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ActividadesNovedades
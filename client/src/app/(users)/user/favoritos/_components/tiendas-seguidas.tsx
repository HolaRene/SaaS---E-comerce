"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Store, Heart } from "lucide-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import Link from "next/link"

const TiendasSeguidas = () => {
    const { user: clerkUser } = useUser();

    // Obtener usuario de Convex
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    );

    // Obtener tiendas favoritas
    const tiendasFavoritas = useQuery(
        api.favoritos.getFavoritosTiendasByUsuario,
        usuario?._id ? { usuarioId: usuario._id } : "skip"
    );

    // Mutation para eliminar tienda de favoritos
    const eliminarFavorito = useMutation(api.favoritos.eliminarTiendaFavorita);

    const handleDejarDeSeguir = async (tiendaId: string) => {
        if (!usuario?._id) return;

        try {
            await eliminarFavorito({
                usuarioId: usuario._id,
                tiendaId: tiendaId as any,
            });
            toast.success("Tienda eliminada de favoritos");
        } catch (error) {
            toast.error("Error al eliminar de favoritos");
            console.error(error);
        }
    };

    // Estado vacío
    if (tiendasFavoritas && tiendasFavoritas.length === 0) {
        return (
            <div>
                <h3 className="mb-4 text-xl font-semibold">Comercios seguidos</h3>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Store className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground text-center">
                            No sigues ningún comercio aún
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <h3 className="mb-4 text-xl font-semibold">Comercios seguidos</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tiendasFavoritas?.map((tienda) => (
                    <Card key={tienda._id}>
                        <CardHeader>
                            <div className="flex items-start gap-3">
                                <img
                                    src={tienda.avatar || "/placeholder.svg"}
                                    alt={tienda.nombre}
                                    className="h-12 w-12 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <CardTitle className="text-base text-balance">{tienda.nombre}</CardTitle>
                                    <CardDescription className="text-xs">{tienda.categoria}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex gap-2">
                                {tienda.puntuacion > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                        ⭐ {tienda.puntuacion.toFixed(1)}
                                    </Badge>
                                )}
                                {tienda.delivery?.habilitado && (
                                    <Badge variant="outline" className="text-xs">
                                        🚚 Delivery
                                    </Badge>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Link href={`/user/negocio/${tienda._id}`}>
                                    <Button size="sm" className="flex-1">
                                        <Store className="mr-1 h-3 w-3" />
                                        Visitar
                                    </Button>
                                </Link>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDejarDeSeguir(tienda._id)}
                                >
                                    Dejar de seguir
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default TiendasSeguidas
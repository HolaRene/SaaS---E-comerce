"use client"


import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Loader2, ShoppingCart } from "lucide-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { useState } from "react"



const ProductosGuardados = () => {
    const [addingId, setAddingId] = useState<string | null>(null);
    const { user: clerkUser } = useUser();

    // Obtener usuario de Convex
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    );

    // Obtener productos favoritos
    const productosFavoritos = useQuery(
        api.favoritos.getFavoritosProductosByUsuario,
        usuario?._id ? { usuarioId: usuario._id } : "skip"
    );

    // Mutation para eliminar producto de favoritos
    const eliminarFavorito = useMutation(api.favoritos.eliminarProductoFavorito);
    const agregarAlCarrito = useMutation(api.carrito.agregarAlCarrito)

    const handleEliminarFavorito = async (productoId: string) => {
        if (!usuario?._id) return;

        try {
            await eliminarFavorito({
                usuarioId: usuario._id,
                productoId: productoId as any,
            });
            toast.success("Producto eliminado de favoritos");
        } catch (error) {
            toast.error("Error al eliminar de favoritos");
            console.error(error);
        }
    };

    const handleAddToCart = async (producto: any) => {
        if (!usuario?._id) {
            toast.error('Debes iniciar sesión para agregar al carrito')
            return
        }

        setAddingId(producto._id);
        try {
            const result = await agregarAlCarrito({
                usuarioId: usuario._id,
                productoId: producto._id,
                cantidad: 1,
            })
            if (result.action === 'updated') {
                toast.success(`Se actualizó la cantidad en tu carrito`)
            } else {
                toast.success(`${producto.nombre} agregado al carrito`)
            }
        } catch (error: any) {
            toast.error(error.message || 'Error al agregar al carrito')
            console.error(error)
        } finally {
            setAddingId(null);
        }
    }

    // Estado vacío
    if (productosFavoritos && productosFavoritos.length === 0) {
        return (
            <div>
                <h3 className="mb-4 text-xl font-semibold">Productos guardados</h3>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground text-center">
                            No tienes productos guardados aún
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <h3 className="mb-4 text-xl font-semibold">Productos guardados</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {productosFavoritos?.map((producto) => (
                    <Card key={producto._id} className="overflow-hidden">
                        <img
                            src={producto.imagenes?.[0] || "/placeholder.svg"}
                            alt={producto.nombre}
                            className="h-48 w-full object-cover"
                        />
                        <CardContent className="p-4">
                            <h4 className="font-semibold text-balance line-clamp-1">{producto.nombre}</h4>
                            <p className="text-xs text-muted-foreground">{producto.nombreTienda}</p>
                            <p className="mt-2 text-lg font-bold text-primary">
                                C${producto.precio.toFixed(2)}
                            </p>
                            <div className="mt-3 flex gap-2">
                                <Button
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                                    size="sm"
                                    onClick={() => handleAddToCart(producto)}
                                    disabled={addingId === producto._id || !usuario}
                                >
                                    {addingId === producto._id ? (
                                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    ) : (
                                        <ShoppingCart className="w-4 h-4 mr-1" />
                                    )}
                                    {addingId === producto._id ? 'Agregando...' : 'Agregar'}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEliminarFavorito(producto._id)}
                                >
                                    <Heart className="h-4 w-4 fill-current text-red-600" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default ProductosGuardados
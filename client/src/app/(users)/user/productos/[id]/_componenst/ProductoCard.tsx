"use client"
import { useState, useEffect } from "react"
import { Star, Heart, Share2, ShoppingCart, Truck, RotateCcw, Award, ClipboardCopy, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useQuery, useMutation } from "convex/react"
import { Spinner } from "@/components/ui/spinner"
import EmptyState from "@/components/public-negocios/EmptyState"
import Link from "next/link"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Id } from "../../../../../../../convex/_generated/dataModel"
import { api } from "../../../../../../../convex/_generated/api"

// Reviews handled by backend now


const ProductCard = ({ id }: { id: Id<"productos"> }) => {
    // Estado para el carrito
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    // Obtener usuario actual de Clerk
    const { user: clerkUser } = useUser();

    // Obtener usuario de Convex usando el clerkId
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    );

    // Estado local
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0)

    // Reviews queries
    const resenas = useQuery(api.resenas.getResenasProducto, { productoId: id })
    const statsResenas = useQuery(api.resenas.getEstadisticasResenasProducto, { productoId: id })
    const miResena = useQuery(api.resenas.getResenaUsuarioProducto, { productoId: id }); // ¡NUEVO!
    const crearResena = useMutation(api.resenas.crearResenaProducto);
    const editarResena = useMutation(api.resenas.editarResenaProducto);

    // State for new review
    const [isReviewOpen, setIsReviewOpen] = useState(false)
    const [newRating, setNewRating] = useState(5)
    const [newComment, setNewComment] = useState("")
    const [isSubmittingReview, setIsSubmittingReview] = useState(false)

    // Precarga datos al abrir el modal
    useEffect(() => {
        if (miResena && isReviewOpen) {
            setNewRating(miResena.calificacion);
            setNewComment(miResena.comentario || "");
        }
    }, [miResena, isReviewOpen]);



    // Queries
    // Queries
    const data = useQuery(api.productos.getProductoConTienda, { id });
    const { producto, tienda } = data || {};

    const agregarAlCarrito = useMutation(api.carrito.agregarAlCarrito)

    // Verificar si el producto es favorito
    const esFavorito = useQuery(
        api.favoritos.isProductoFavorito,
        usuario?._id ? { usuarioId: usuario._id, productoId: id } : "skip"
    );

    // Mutations para favoritos
    const agregarFavorito = useMutation(api.favoritos.agregarProductoFavorito);
    const eliminarFavorito = useMutation(api.favoritos.eliminarProductoFavorito);

    // Sincronizar estado local con Convex
    useEffect(() => {
        if (esFavorito !== undefined) {
            setIsFavorite(esFavorito);
        }
    }, [esFavorito]);
    // Handler modificado para crear/editar
    const handleSubmitReview = async () => {
        if (!usuario?._id) return toast.error("Debes iniciar sesión");
        setIsSubmittingReview(true);
        try {
            if (miResena) {
                // EDITAR reseña existente
                await editarResena({
                    resenaId: miResena._id,
                    calificacion: newRating,
                    comentario: newComment
                });
                toast.success("Reseña actualizada");
            } else {
                // CREAR nueva reseña
                await crearResena({
                    productoId: id,
                    calificacion: newRating,
                    comentario: newComment
                });
                toast.success("Reseña publicada");
            }
            setIsReviewOpen(false);
            setNewComment("");
            setNewRating(5);
        } catch (error: any) {
            toast.error(error.message || "Error al publicar reseña");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (data === undefined) {
        return <div className="flex items-center justify-center min-h-screen">
            <Spinner className="h-8 w-8 text-primary" />
        </div>
    }

    if (data === null || !producto || !tienda) {
        return <EmptyState title="Producto no encontrado" buttonLink="/product" buttonText="Ver Productos" />
    }

    // Calculate discount if applicable
    const discount = producto.costo && producto.precio < producto.costo
        ? producto.costo - producto.precio
        : 0;

    // Handler para guardar/quitar de favoritos
    const handleToggleFavorite = async () => {
        if (!usuario?._id) {
            toast.error("Debes iniciar sesión para guardar productos");
            return;
        }

        try {
            if (isFavorite) {
                await eliminarFavorito({
                    usuarioId: usuario._id,
                    productoId: id,
                });
                toast.success("Producto eliminado de favoritos");
            } else {
                await agregarFavorito({
                    usuarioId: usuario._id,
                    productoId: id,
                });
                toast.success("Producto guardado en favoritos");
            }
        } catch (error: any) {
            toast.error(error.message || "Error al actualizar favoritos");
            console.error(error);
        }
    };

    // Handler para copiar enlace
    const handleCopyLink = async () => {
        const link = `${window.location.origin}/product/${id}`;
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            toast.success("Enlace copiado al portapapeles");
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error("Error al copiar enlace");
        }
    };
    // Handler para agregar al carrito
    const handleAddToCart = async () => {
        if (!usuario?._id) {
            toast.error('Debes iniciar sesión para agregar al carrito')
            return
        }
        if (!producto) return
        setIsAddingToCart(true)
        try {
            const result = await agregarAlCarrito({
                usuarioId: usuario._id,
                productoId: producto._id,
                cantidad: quantity,
            })
            if (result.action === 'updated') {
                toast.success(`Se actualizó la cantidad en tu carrito`)
            } else {
                toast.success(`${producto.nombre} agregado al carrito`)
            }
            // Resetear cantidad después de agregar
            setQuantity(1)
        } catch (error: any) {
            toast.error(error.message || 'Error al agregar al carrito')
            console.error(error)
        } finally {
            setIsAddingToCart(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="aspect-square bg-white rounded-lg p-4 relative overflow-hidden">
                        {/* Render ALL images to preload them, toggle visibility via opacity */}
                        {producto.imagenes.length > 0 ? (
                            producto.imagenes.map((img, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "w-full h-full absolute inset-0 p-4 transition-opacity duration-300",
                                        selectedImage === index ? "opacity-100 z-10" : "opacity-0 z-0"
                                    )}
                                >
                                    <Image
                                        src={img || "/icons/producto-64.png"}
                                        alt={`${producto.nombre} - vista ${index + 1}`}
                                        fill
                                        className="object-cover rounded-md"
                                        sizes="(min-width: 1024px) 50vw, 100vw"
                                        priority={index === 0}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="w-full h-full relative">
                                <Image
                                    src="/icons/producto-64.png"
                                    alt={producto.nombre}
                                    fill
                                    className="object-cover rounded-md"
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                    priority
                                />
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {producto.imagenes.map((image, index) => (
                            <Button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={cn(
                                    "aspect-square bg-white rounded-md p-1 border-2 relative overflow-hidden h-auto",
                                    selectedImage === index ? "border-blue-500" : "border-gray-200"
                                )}
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src={image || "/placeholder.svg"}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover rounded"
                                        sizes="(max-width: 768px) 25vw, 10vw"
                                    />
                                </div>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{producto.nombre}</h1>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(producto.puntuacionPromedio || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                    />
                                ))}
                                <span className="ml-2 text-sm text-gray-600">
                                    {statsResenas?.promedio.toFixed(1) || 0} ({statsResenas?.total || 0} valoraciones)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-4 justify-between">
                        <span className="text-3xl font-bold text-green-600">C$ {producto.precio}</span>
                        <div className=" flex gap-2 text-3xl font-bold text-blue-500 items-center">
                            <Heart className="w-5 h-5 text-red-600 fill-red-600" /> {producto.megusta || 0}
                        </div>

                        {/* 
                        {discount > 0 && (
                            <Badge className="bg-red-500 text-white">
                                Guardar {discount.toFixed(2)}
                            </Badge>
                        )} */}
                    </div>

                    {/* Seller Info */}
                    {tienda && (
                        <Card>
                            <CardContent className="px-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">Vendido por {tienda.nombre}</div>
                                        <div className="text-sm text-orange-600">
                                            {tienda.puntuacion || 0}★ puntuación
                                        </div>
                                    </div>
                                    <Link href={`/comercio/${tienda._id}`}>
                                        <Button variant="outline" size="sm">
                                            Ver Tienda
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Key Features / Description Preview */}
                    <div>
                        <h3 className="font-semibold mb-3">Descripción</h3>
                        <p className="text-sm text-gray-600 line-clamp-4">{producto.descripcion}</p>
                    </div>

                    {/* Purchase Options */}
                    <div className="space-y-4 p-4 bg-white rounded-lg border">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium">Cantidad:</label>
                            <select
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="border rounded px-3 py-1"
                            >
                                {[...Array(Math.min(10, producto.cantidad || 1))].map((_, i) => (
                                    <option key={i} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-3">
                            <Button
                                className="w-full bg-green-400 hover:bg-green-500 text-black text-lg py-3"
                                onClick={handleAddToCart}
                                disabled={isAddingToCart || !usuario}
                            >
                                {isAddingToCart ? (
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                ) : (
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                )}
                                {isAddingToCart ? 'Agregando...' : 'Agregar al Carrito'}
                            </Button>
                            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-3">Comprar Ahora</Button>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                    "transition-all",
                                    isFavorite && "bg-red-50 border-red-300"
                                )}
                                onClick={handleToggleFavorite}
                                disabled={!usuario}
                            >
                                <Heart className={cn("w-4 h-4 text-gray-400", isFavorite && "fill-red-500 text-red-500")} />
                                {isFavorite ? "Guardado" : "Guardar"}
                            </Button>
                            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Compartir
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="h-auto">
                                    <SheetHeader>
                                        <SheetTitle>Compartir producto</SheetTitle>
                                    </SheetHeader>
                                    <div className="space-y-4 mt-4">
                                        <div className="flex items-center gap-2">
                                            <Input
                                                readOnly
                                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/product/${id}`}
                                                className="flex-1"
                                            />
                                            <Button
                                                onClick={handleCopyLink}
                                                variant="secondary"
                                                size="icon"
                                                className="shrink-0"
                                            >
                                                {copied ? (
                                                    <Check className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <ClipboardCopy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Comparte este enlace para que otros puedan ver este producto
                                        </p>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-green-600" />
                            <span>Envío gratis disponible</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <RotateCcw className="w-4 h-4 text-blue-600" />
                            <span>Devoluciones gratis dentro de 30 días</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-purple-600" />
                            <span>Garantía de satisfacción</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details Tabs */}
            <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Descripción</TabsTrigger>
                    <TabsTrigger value="specifications">Especificaciones</TabsTrigger>
                    <TabsTrigger value="reviews">Reseñas ({statsResenas?.total || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-gray-700 leading-relaxed">{producto.descripcion}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="specifications" className="mt-6">
                    <Card>
                        <CardContent className="p-6">
                            {producto.attributes ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(producto.attributes).map(([key, value]) => (
                                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="font-medium capitalize">{key}</span>
                                            <span className="text-gray-600">{Array.isArray(value) ? value.join(", ") : value}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No hay especificaciones disponibles.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                    <div className="space-y-6">
                        {/* Review Summary */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Opiniones de clientes</CardTitle>
                                <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                                    <DialogTrigger asChild>
                                        <Button disabled={!usuario}>
                                            {miResena ? "Editar mi opinión" : "Escribir opinión"}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Escribe una reseña</DialogTitle>
                                            <DialogDescription>
                                                Comparte tu experiencia con este producto.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Calificación</Label>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={cn(
                                                                "w-8 h-8 cursor-pointer transition-colors",
                                                                star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                            )}
                                                            onClick={() => setNewRating(star)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Comentario</Label>
                                                <Textarea
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    placeholder="¿Qué te pareció el producto?"
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsReviewOpen(false)}>Cancelar</Button>
                                            <Button onClick={handleSubmitReview} disabled={isSubmittingReview}>
                                                {isSubmittingReview && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                Publicar
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold mb-2">{statsResenas?.promedio.toFixed(1) || 0}</div>
                                        <div className="flex justify-center mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${i < Math.round(statsResenas?.promedio || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-sm text-gray-600">{statsResenas?.total || 0} valoraciones</div>
                                    </div>
                                    <div className="space-y-2">
                                        {[5, 4, 3, 2, 1].map((rating, idx) => {
                                            // statsResenas?.distribucion es [count1, count2, count3, count4, count5]
                                            // rating 5 está en index 4
                                            const count = statsResenas?.distribucion ? statsResenas.distribucion[rating - 1] : 0;
                                            const total = statsResenas?.total || 1;
                                            const percentage = Math.round((count / total) * 100);

                                            return (
                                                <div key={rating} className="flex items-center gap-2">
                                                    <span className="text-sm w-8">{rating}★</span>
                                                    <Progress
                                                        value={percentage}
                                                        className="flex-1"
                                                    />
                                                    <span className="text-sm text-gray-600 w-8">
                                                        {percentage}%
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Individual Reviews */}
                        <div className="space-y-4">
                            {resenas?.map((review) => (
                                <Card key={review._id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <Avatar>
                                                <AvatarImage src={review.usuario.avatar} />
                                                <AvatarFallback>{review.usuario.nombre[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-medium">{review.usuario.nombre} {review.usuario.apellido}</span>
                                                    {/* Verification badge could be implemented if we track purchase */}
                                                </div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${i < review.calificacion ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-600">{new Date(review.fecha).toLocaleDateString()}</span>
                                                </div>
                                                {/* Title removed as schema doesn't have it, or we can add it later */}
                                                <p className="text-gray-700 mb-3">{review.comentario}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {(!resenas || resenas.length === 0) && (
                                <div className="text-center text-gray-500 py-8">
                                    No hay reseñas todavía. ¡Sé el primero en opinar!
                                </div>
                            )}
                        </div>

                        <div className="text-center">
                            <Button variant="outline">Load More Reviews</Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
export default ProductCard
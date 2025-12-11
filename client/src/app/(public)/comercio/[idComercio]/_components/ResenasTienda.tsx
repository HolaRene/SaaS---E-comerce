"use client"
import { useEffect, useState } from "react"
import { Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ResenasTiendaProps {
    id: Id<"tiendas">
}

export default function ResenasTienda({ id }: ResenasTiendaProps) {
    const { user: clerkUser } = useUser()

    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    )

    const resenas = useQuery(api.resenas.getResenasTienda, { tiendaId: id })
    const statsResenas = useQuery(api.resenas.getEstadisticasResenasTienda, { tiendaId: id })
    const miResena = useQuery(api.resenas.getResenaUsuarioTienda, { tiendaId: id })

    const crearResena = useMutation(api.resenas.crearResenaTienda)
    const editarResena = useMutation(api.resenas.editarResenaTienda)

    // State
    const [isReviewOpen, setIsReviewOpen] = useState(false)
    const [newRating, setNewRating] = useState(5)
    const [newComment, setNewComment] = useState("")
    const [isSubmittingReview, setIsSubmittingReview] = useState(false)

    useEffect(() => {
        if (isReviewOpen && miResena) {
            setNewRating(miResena.calificacion)
            setNewComment(miResena.comentario || "")
        } else if (isReviewOpen && !miResena) {
            setNewRating(5)
            setNewComment("")
        }
    }, [isReviewOpen, miResena])

    const handleSubmitReview = async () => {
        if (!usuario?._id) return toast.error("Debes iniciar sesión");
        setIsSubmittingReview(true);
        try {
            if (miResena) {
                await editarResena({
                    resenaId: miResena._id,
                    calificacion: newRating,
                    comentario: newComment
                });
                toast.success("Reseña actualizada");
            } else {
                await crearResena({
                    tiendaId: id,
                    calificacion: newRating,
                    comentario: newComment
                });
                toast.success("Reseña publicada");
            }
            setIsReviewOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Error al publicar reseña");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Opiniones de clientes</CardTitle>
                    <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={!usuario}>
                                {miResena ? "Editar opinión" : "Escribir opinión"}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Califica esta tienda</DialogTitle>
                                <DialogDescription>
                                    Comparte tu experiencia de compra.
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
                                        placeholder="¿Cómo fue el servicio?"
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
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const count = statsResenas?.distribucion ? statsResenas.distribucion[rating - 1] : 0
                                const total = statsResenas?.total || 1
                                const percentage = Math.round((count / total) * 100)

                                return (
                                    <div key={rating} className="flex items-center gap-2">
                                        <span className="text-sm w-8">{rating}★</span>
                                        <Progress value={percentage} className="flex-1" />
                                        <span className="text-sm text-gray-600 w-8">{percentage}%</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

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
                                    <p className="text-gray-700">{review.comentario}</p>
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
        </div>
    )
}

// app/mi-tienda/[idTienda]/_components/Perfil.tsx

"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Heart, ImageIcon, Phone, Star, User } from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import EditarTiendaDialog from "./EditarTiendaDialog";

interface PerfilProps {
    id: Id<"tiendas">;
}

// ✅ ESTADOS DE CARGA Y ERROR
const LoadingState = () => (
    <div className="space-y-3">
        <Card className="overflow-hidden">
            <div className="animate-pulse bg-muted h-48 w-full" />
            <CardHeader>
                <div className="animate-pulse bg-muted h-8 w-2/3 rounded" />
                <div className="animate-pulse bg-muted h-5 w-1/3 mt-2 rounded" />
            </CardHeader>
        </Card>
    </div>
);

const ErrorState = ({ message }: { message: string }) => (
    <div className="space-y-3">
        <Card className="border-red-200">
            <CardContent className="p-6">
                <div className="text-center">
                    <p className="font-bold text-red-600">Error al cargar tienda</p>
                    <p className="text-sm text-muted-foreground mt-2">{message}</p>
                    <Button
                        className="mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
);

export default function Perfil({ id }: PerfilProps) {

    const tienda = useQuery(
        api.tiendas.getTiendaById,
        id ? { id } : "skip"
    );

    const productosTienda = useQuery(
        api.productos.getProductosByTienda,
        id ? { tiendaId: id } : "skip"
    );


    const { user: clerkUser } = useUser()

    // Obtener usuario Convex
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    );

    const isOwner = usuario?._id === tienda?.propietario


    if (tienda === undefined) {
        return <LoadingState />;
    }
    console.log(tienda.visitas)

    // null = error o no encontrado
    if (tienda === null) {
        return <ErrorState message="No tienes acceso a esta tienda o no existe" />;
    }

    // ✅ Handler seguro para WhatsApp
    const handleWhatsAppChat = () => {
        if (!tienda.telefono) return;
        const phone = tienda.telefono.replace(/\D/g, '');
        window.open(`https://wa.me/${phone}`, "_blank", "noopener,noreferrer");
    };


    return (
        <div className="space-y-3">
            {
                isOwner ? (
                    <>
                        <Card className="overflow-hidden">
                            <div className="relative">
                                <Image
                                    src={tienda.imgBanner}
                                    alt="Banner del negocio"
                                    className="h-48 w-full object-cover"
                                    width={800}
                                    height={500}
                                />
                                <div className="absolute left-6 top-24">
                                    <Avatar className="h-40 w-40 border-4 border-background">
                                        <AvatarImage src={tienda.avatar} />
                                        <AvatarFallback>
                                            {tienda.nombre.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                            <CardHeader className="pt-20">
                                <CardTitle className="text-3xl font-bold">{tienda.nombre}</CardTitle>
                                <Badge variant="secondary" className="w-fit">{tienda.categoria}</Badge>
                                <CardDescription className="pt-2 text-base">
                                    {tienda.descripcion}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    <EditarTiendaDialog tienda={tienda} />
                                    <Button variant="outline" onClick={handleWhatsAppChat}>
                                        <Phone className="mr-2 h-4 w-4" /> Chatear por WhatsApp
                                    </Button>
                                    <Button variant="outline">
                                        <Star className="mr-2 h-4 w-4" />Ver Reseñas
                                    </Button>

                                    <span className="flex items-center gap-2"><User className="mr-1 h-4 w-4" /> {tienda.favoritos || 0} Personas que te siguen</span>

                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5" />
                                    Productos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {
                                        productosTienda && (
                                            productosTienda.length > 0 ? (
                                                productosTienda.map((src) => (
                                                    <div key={src._id} className="group cursor-pointer">
                                                        <Link href={`/mi-tienda/${tienda._id}/productos`}>
                                                            <Image
                                                                src={src.imagenes[0]}
                                                                alt={src.nombre}
                                                                className="rounded-lg object-cover aspect-square transition-transform group-hover:scale-105"
                                                                width={200}
                                                                height={200}
                                                            />
                                                        </Link>
                                                        <h3 className="font-bold mt-2 text-sm">{src.nombre}</h3>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="col-span-full text-center text-muted-foreground py-8">
                                                    No hay productos aún
                                                </p>
                                            )
                                        )
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <p className="text-red-500 text-3xl">Esta tienda no es tuya jaja 🤣🤣</p>
                )
            }
        </div>
    );
}
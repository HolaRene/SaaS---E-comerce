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
import { Phone, Star, User, Edit, ImageIcon } from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { Id, Doc } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import EditarTiendaDialog from "./EditarTiendaDialog";

interface PerfilProps {
    id: Id<"tiendas">;
    tiendaData: Doc<"tiendas">;
    usuarioData: Doc<"usuarios"> | null | undefined;
    isOwner: boolean;
    role: string;
}

export default function Perfil({ id, tiendaData: tienda, usuarioData: usuario, isOwner, role }: PerfilProps) {

    // Ya no cargamos tienda ni usuario aquí, vienen por props

    // Solo cargamos los productos de la tienda (esto es específico de esta vista)
    const productosTienda = useQuery(
        api.productos.getProductosByTienda,
        id ? { tiendaId: id } : "skip"
    );

    // Validación extra por si acaso, aunque el padre ya lo maneja
    const hasAccess = isOwner || role !== undefined;

    if (!hasAccess) {
        return (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                No tienes permisos para ver este perfil.
            </div>
        );
    }

    // ✅ Handler seguro para WhatsApp
    const handleWhatsAppChat = () => {
        if (!tienda.telefono) return;
        const phone = tienda.telefono.replace(/\D/g, '');
        window.open(`https://wa.me/${phone}`, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="space-y-3">
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
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-3xl font-bold">{tienda.nombre}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="w-fit">{tienda.categoria}</Badge>
                                {!isOwner && (
                                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                                        Rol: {role}
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="pt-2 text-base">
                                {tienda.descripcion}
                            </CardDescription>
                        </div>
                        {/* Botón de editar movido aquí para mejor UX - Sólo visible si es dueño o admin */}
                        {(isOwner || role === 'admin') && (
                            <div className="hidden md:block">
                                <EditarTiendaDialog tienda={tienda} />
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {/* En móvil mostrar botón editar aquí */}
                        <div className="md:hidden w-full mb-2">
                            {(isOwner || role === 'admin') && <EditarTiendaDialog tienda={tienda} />}
                        </div>

                        <Button variant="outline" onClick={handleWhatsAppChat}>
                            <Phone className="mr-2 h-4 w-4" /> Chatear por WhatsApp
                        </Button>
                        <Button variant="outline">
                            <Star className="mr-2 h-4 w-4" />Ver Reseñas
                        </Button>

                        <span className="flex items-center gap-2 ml-auto text-sm text-muted-foreground">
                            <User className="mr-1 h-4 w-4" /> {tienda.favoritos || 0} Seguidores
                        </span>

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
                                            <h3 className="font-bold mt-2 text-sm truncate">{src.nombre}</h3>
                                            <p className="text-xs text-muted-foreground">${src.precio}</p>
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
        </div>
    );
}

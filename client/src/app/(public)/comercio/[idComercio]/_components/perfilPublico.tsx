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
import { Edit, Eye, Heart, ImageIcon, MapPin, Phone, Share2, Star, ClipboardCopy, Check, Clock } from "lucide-react";
import Link from "next/link";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { CATEGORY_ICONS } from "@/lib/types-negocios";
import { useState, useEffect } from "react";
import EmptyState from "@/components/public-negocios/EmptyState";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getTodaySchedule } from "@/lib/negocios-utils";


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

export default function PerfilPublico({ id }: PerfilProps) {
    // Obtener usuario actual de Clerk
    const { user: clerkUser } = useUser();

    // Obtener usuario de Convex usando el clerkId
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    );

    // Estado local
    const [isFollowing, setIsFollowing] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Queries
    const tiendaPublica = useQuery(api.tiendas.getTiendaById, {
        id
    });
    const productos = useQuery(api.productos.getProductosByTienda, {
        tiendaId: id
    });



    // Verificar si la tienda es favorita
    const esFavorita = useQuery(
        api.favoritos.isTiendaFavorita,
        usuario?._id ? { usuarioId: usuario._id, tiendaId: id } : "skip"
    );

    // Mutations para favoritos
    const agregarFavorito = useMutation(api.favoritos.agregarTiendaFavorita);
    const eliminarFavorito = useMutation(api.favoritos.eliminarTiendaFavorita);

    // Sincronizar estado local con Convex
    useEffect(() => {
        if (esFavorita !== undefined) {
            setIsFollowing(esFavorita);
        }
    }, [esFavorita]);

    if (tiendaPublica === undefined) {
        return <LoadingState />;
    }

    if (tiendaPublica === null) {
        return <ErrorState message="No tienes acceso a esta tienda o no existe" />;
    }

    const todayHours = getTodaySchedule(tiendaPublica?.horarios)

    const handleWhatsAppChat = () => {
        if (!tiendaPublica.telefono) return;
        const phone = tiendaPublica.telefono.replace(/\D/g, '');
        window.open(`https://wa.me/${phone}`, "_blank", "noopener,noreferrer");
    };

    // Handler para seguir/dejar de seguir
    const handleToggleFollow = async () => {
        if (!usuario?._id) {
            toast.error("Debes iniciar sesión para seguir tiendas");
            return;
        }

        try {
            if (isFollowing) {
                await eliminarFavorito({
                    usuarioId: usuario._id,
                    tiendaId: id,
                });
                toast.success("Dejaste de seguir esta tienda");
            } else {
                await agregarFavorito({
                    usuarioId: usuario._id,
                    tiendaId: id,
                });
                toast.success("Ahora sigues esta tienda");
            }
        } catch (error: any) {
            toast.error(error.message || "Error al actualizar favoritos");
            console.error(error);
        }
    };

    // Handler para copiar enlace
    const handleCopyLink = async () => {
        const link = `${window.location.origin}/comercio/${id}`;
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            toast.success("Enlace copiado al portapapeles");
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error("Error al copiar enlace");
        }
    };

    return (
        <div className="space-y-3">
            <Card className="overflow-hidden">
                <div className="relative">
                    <Image
                        src={tiendaPublica.imgBanner}
                        alt="Banner del negocio"
                        className="h-48 w-full object-cover"
                        width={800}
                        height={500}
                    />
                    <div className="absolute left-6 top-24">
                        <Avatar className="h-40 w-40 border-4 border-background">
                            <AvatarImage src={tiendaPublica.avatar} />
                            <AvatarFallback>
                                {tiendaPublica.nombre.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
                <CardHeader className="pt-20">
                    <div className="flex justify-between gap-2">
                        <div>
                            <CardTitle className="text-3xl font-bold">{tiendaPublica.nombre}</CardTitle>

                            <CardDescription className="pt-2 text-base">
                                {tiendaPublica.descripcion}
                            </CardDescription>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={handleToggleFollow}
                                variant={isFollowing ? "default" : "outline"}
                                className={cn(
                                    "gap-2 transition-all",
                                    isFollowing
                                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                                        : "bg-green-500 hover:bg-green-600 text-white"
                                )}
                                disabled={!usuario}
                            >
                                <Heart className={cn("h-4 w-4", isFollowing && "fill-current")} />
                                {isFollowing ? "Siguiendo" : "Seguir"}
                            </Button>
                            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        <Share2 className="h-4 w-4" />
                                        Compartir
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="h-auto">
                                    <SheetHeader>
                                        <SheetTitle>Compartir tienda</SheetTitle>
                                    </SheetHeader>
                                    <div className="space-y-4 mt-4">
                                        <div className="flex items-center gap-2">
                                            <Input
                                                readOnly
                                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/comercio/${id}`}
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
                                            Comparte este enlace para que otros puedan ver esta tienda
                                        </p>
                                    </div>
                                </SheetContent>
                            </Sheet>

                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    {/* Ubicación y categoría */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {tiendaPublica.departamento}
                        </span>
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <span>{CATEGORY_ICONS[tiendaPublica.categoria as any]}</span>
                            {tiendaPublica.categoria}
                        </Badge>
                        {tiendaPublica.telefono && (
                            <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {tiendaPublica.telefono}
                            </span>
                        )}
                    </div>
                    <div className="flex md:flex-wrap justify-between flex-col gap-2 ">
                        <div className="flex gap-2 md:flex-row mt-2">
                            <Button variant="outline" className="bg-green-500" onClick={handleWhatsAppChat}>
                                <Phone className="mr-1 h-4 w-4" />
                                <span className="md:block hidden">Chatear por</span> WhatsApp
                            </Button>
                            <Button variant="outline">
                                <Star className="mr-1 h-4 w-4" />Ver Reseñas
                            </Button>
                            {/* Horario de hoy */}
                            <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{todayHours}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 text-center pr-4">
                            <div>
                                <p className="text-2xl font-bold">{tiendaPublica.visitas}</p>
                                <p className="text-xs text-muted-foreground">Visitas</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{tiendaPublica.favoritos}</p>
                                <p className="text-xs text-muted-foreground">Favoritos</p>
                            </div>
                        </div>
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
                    {
                        productos ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {
                                    productos.length === 0 ? (
                                        <EmptyState title="No hay productos"
                                            buttonLink="/comercios"
                                            buttonText="ver más tiendas" />
                                    ) : (
                                        productos.map((producto) => (
                                            <div key={producto._id} className="cursor-pointer relative">

                                                <Link href={`/product/${producto._id}`}>
                                                    <Image src={producto.imagenes[0]} alt={producto.nombre} className="w-full h-48 object-cover rounded-md" width={192} height={192} />
                                                </Link>
                                                {producto.costo && (
                                                    <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                                                        Guardar
                                                    </Badge>
                                                )}
                                                <h3 className="font-medium text-sm mb-2 line-clamp-2">{producto.nombre}</h3>

                                                <div className="flex items-center mb-2">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(producto.puntuacionPromedio) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-600 ml-1">(3)</span>
                                                </div>

                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-lg font-bold text-gray-900">NIO {producto.precio}</span>
                                                    {/* {producto.costo && <span className="text-sm text-gray-500 line-through">${producto.costo}</span>} */}
                                                </div>

                                                {/* <div className="text-xs text-gray-600 mb-3">
                                                    por <span className="text-blue-600 hover:underline">{tiendaPublica.nombre}</span>
                                                </div> */}


                                                {/* <Link href={`/user/carrito/`}>
                                                    <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">Agregar al carrito</Button></Link> */}
                                            </div>
                                        ))
                                    )
                                }
                            </div>
                        ) : (
                            <EmptyState title="No hay productos" />
                        )
                    }
                </CardContent>
            </Card>
            {/* Tabs de productos y ubicación */}
            <Tabs>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="productos">Promociones</TabsTrigger>
                    <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
                </TabsList>
                <TabsContent value="productos" className="space-y-6">
                    <p>Promcion flexis</p>
                </TabsContent>
                <TabsContent value="ubicacion" className="space-y-6">
                    {/* Mapa: si hay lat/lng mostramos react-leaflet */}
                    {typeof tiendaPublica.lat === "number" && typeof tiendaPublica.lng === "number" && (
                        <div className="mt-6 h-72 w-full rounded-md overflow-hidden">
                            <MapContainer center={[tiendaPublica.lat, tiendaPublica.lng]} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Mapa Z</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[tiendaPublica.lat, tiendaPublica.lng]}>
                                    <Popup>
                                        {tiendaPublica.nombre}
                                        <br />
                                        {tiendaPublica.direccion}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
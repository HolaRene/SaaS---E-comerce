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
import { Edit, Eye, Heart, ImageIcon, MapPin, Phone, Share2, Star } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { CATEGORY_ICONS } from "@/lib/types-negocios";

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
    const tiendaPublica = useQuery(api.tiendas.getTiendaById, {
        id
    })




    if (tiendaPublica === undefined) {
        return <LoadingState />;
    }

    if (tiendaPublica === null) {
        return <ErrorState message="No tienes acceso a esta tienda o no existe" />;
    }

    // ✅ Handler seguro para WhatsApp
    const handleWhatsAppChat = () => {
        // if (!tienda.telefono) return;
        // const phone = tienda.telefono.replace(/\D/g, '');
        window.open(`https://wa.me/5212222222222`, "_blank", "noopener,noreferrer");
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
                            <Button variant="outline">
                                <Heart className="mr-2 h-4 w-4" /> Seguir
                            </Button>
                            <Button variant="outline">
                                <Share2 className="mr-2 h-4 w-4" />
                                Compartir
                            </Button>

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
                    <div className="flex md:flex-wrap justify-between">
                        <div className="flex gap-2 md:flex-row ">
                            <Button variant="outline" className="bg-green-500" onClick={handleWhatsAppChat}>
                                <Phone className="mr-1 h-4 w-4" />
                                <span className="md:block hidden">Chatear por</span> WhatsApp
                            </Button>
                            <Button variant="outline">
                                <Star className="mr-1 h-4 w-4" />Ver Reseñas
                            </Button>
                        </div>
                        <div className="hidden lg:flex items-center gap-6 text-center pr-4">
                            <div>
                                <p className="text-2xl font-bold">{tiendaPublica.estadisticas.productosActivos}</p>
                                <p className="text-xs text-muted-foreground">Productos</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{tiendaPublica.estadisticas.ventasTotales.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">Ventas</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{tiendaPublica.estadisticas.clientesTotales.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">Clientes</p>
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        Produvyos                                   </div>
                </CardContent>
            </Card>
            {/* Tabs de productos y ubicación */}
            <Tabs>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="productos">Productos</TabsTrigger>
                    <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
                </TabsList>
                <TabsContent value="productos" className="space-y-6">
                    <p>Productos</p>
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
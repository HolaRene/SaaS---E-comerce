/**
 * COMPONENTE DE PÁGINA DE PERFIL DE TIENDA
 * Estilo Facebook Marketplace - Info del vendedor en header horizontal arriba
 */

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import {
    ArrowLeft,
    Star,
    Heart,
    Share2,
    Truck,
    FileText,
    StoreIcon,
    Package,
    MapPin,
    Phone,
    MessageCircle,
    MoreHorizontal,
    ShoppingBag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types-negocios"
import { getStoreStatusInfo, getTodaySchedule } from "@/lib/negocios-utils"
import { CATEGORY_ICONS } from "@/lib/types-negocios"
import { Id, Doc } from "../../../convex/_generated/dataModel"

interface tienda {
    _id: Id<"tiendas">;
    _creationTime: number;
    avatar: string;
    imgBanner: string;
    nombre: string;
    categoria: string;
    descripcion: string;
    direccion: string;
    lat: number;
    lng: number;
    departamento: string;
    telefono: string;
    propietario: Id<"usuarios">;
    publica: boolean;
    estado: "activo" | "inactivo" | "pendiente" | "suspendido" | "cerradoTemporal" | "borrado";
    ventasHoy: number;
    miembros: {
        usuarioId: Id<"usuarios">;
        rol: "admin" | "vendedor" | "asistente";
        fechaUnion: string;
        permisos: string[];
    }[];
    configuracion: {
        NIT: string;
        RUC: string;
        moneda: string;
        whatsapp: string;
        backup: string;
        permisosTienda: {
            vendedoresPuedenCrearProductos: boolean;
            vendedoresPuedenModificarPrecios: boolean;
            vendedoresPuedenVerReportes: boolean;
            maxVendedores: number;
        };
    };
    horarios: {
        dia: string;
        apertura: string;
        cierre: string;
        cerrado: boolean;
        aperturaEspecial?: string;
        cierreEspecial?: string;
    }[];
    metricasEquipo: {
        totalVendedores: number;
        ventasEsteMes: number;
        productoMasVendido?: Id<"productos">;
    };
    delivery: {
        habilitado: boolean;
        costo: number;
        tiempoEstimado: string;
        zonas: string[];
    };
    facturacion: {
        habilitada: boolean;
        tipo: "manual" | "automatica" | "ninguna";
        serie: string;
        numeracionActual: number;
    };
    estadisticas: {
        ventasTotales: number;
        clientesTotales: number;
        productosActivos: number;
    };
    visitas: number;
    likes: number;
    favoritos: number;
    puntuacion: number;
    creadoEn: string;
    ultimaActualizacion: string;
}

// Componente de producto individual estilo Facebook
function ProductCard({ product }: { product: Product }) {
    const [imgSrc, setImgSrc] = useState(product.imagenes[0] || "/placeholder.svg")

    return (
        <div className="group cursor-pointer">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted relative">
                <Link href={`/user/productos/${product.id}`}>
                    <Image
                        src={imgSrc}
                        alt={product.nombre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={() => setImgSrc("/placeholder.svg")}
                    />v
                </Link>
                {product.estado === "agotado" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">Agotado</span>
                    </div>
                )}
            </div>
            <div className="mt-2">
                <p className="font-bold text-foreground">C$ {product.precio.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{product.nombre}</p>
                <p className="text-xs text-green-600 mt-1">Envío gratis</p>
            </div>
        </div>
    )
}

export function StoreProfilePage(tienda: tienda) {
    const [isLiked, setIsLiked] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [productFilter, setProductFilter] = useState<"todos" | "stock" | "populares">("todos")
    const [avatarSrc, setAvatarSrc] = useState(tienda.avatar || "/placeholder.svg")

    // Obtener usuario actual
    const { user: clerkUser } = useUser();
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    );

    // Verificar si la tienda es favorita
    const esFavorita = useQuery(
        api.favoritos.isTiendaFavorita,
        usuario?._id ? { usuarioId: usuario._id, tiendaId: tienda._id } : "skip"
    );

    // Mutations
    const agregarFavorito = useMutation(api.favoritos.agregarTiendaFavorita);
    const eliminarFavorito = useMutation(api.favoritos.eliminarTiendaFavorita);

    // Sincronizar estado local con el estado de Convex
    useEffect(() => {
        if (esFavorita !== undefined) {
            setIsFollowing(esFavorita);
        }
    }, [esFavorita]);

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
                    tiendaId: tienda._id,
                });
                toast.success("Dejaste de seguir esta tienda");
            } else {
                await agregarFavorito({
                    usuarioId: usuario._id,
                    tiendaId: tienda._id,
                });
                toast.success("Ahora sigues esta tienda");
            }
        } catch (error: any) {
            toast.error(error.message || "Error al actualizar favoritos");
            console.error(error);
        }
    };

    // Obtener productos públicos de la tienda
    const productosConvex = useQuery(api.tiendas.getProductosPublicosByTienda, {
        tiendaId: tienda._id
    })

    // Obtener reseñas de la tienda
    const resenasConvex = useQuery(api.tiendas.getResenasPublicasByTienda, {
        tiendaId: tienda._id
    })

    // Transformar productos de Convex al tipo Product
    const products: Product[] = productosConvex?.map(p => ({
        id: p._id,
        storeId: p.tiendaId,
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio: p.precio,
        precioAnterior: p.costo,
        categoria: p.categoria,
        imagenes: p.imagenes,
        estado: p.estado as any,
        rating: p.puntuacionPromedio || 0,
        totalReviews: 0,
        stock: p.cantidad,
        destacado: false
    })) || []

    // Transformar reseñas
    const reviews = resenasConvex?.map(r => ({
        id: r._id,
        storeId: r.tiendaId,
        userId: r.clienteId,
        userName: r.clienteNombre,
        userAvatar: r.clienteImagen,
        rating: r.calificacion,
        comentario: r.comentario || '',
        fecha: r.fecha
    })) || []

    const filteredProducts = products.filter((p) => {
        if (productFilter === "stock") return p.estado === "activo"
        if (productFilter === "populares") return p.rating >= 4.5
        return true
    })

    return (
        <div className="min-h-screen bg-muted/30">
            <header className="sticky top-0 z-1 bg-background border-b">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
                    <Link
                        href="/user/negocios"
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <span className="font-semibold truncate">{tienda.nombre}</span>
                    <div className="flex-1" />
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsLiked(!isLiked)}>
                        <Heart className={cn("w-5 h-5", isLiked && "fill-red-500 text-red-500")} />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Share2 className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreHorizontal className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            <div className="bg-background border-b">
                <div className="max-w-5xl mx-auto px-4 py-5">
                    {/* Fila principal: Avatar + Info + Acciones */}
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-muted border-4 border-background shadow-lg">
                                <Image
                                    src={avatarSrc}
                                    alt={tienda.nombre}
                                    width={96}
                                    height={96}
                                    className="object-cover w-full h-full"
                                    onError={() => setAvatarSrc("/placeholder.svg")}
                                />
                            </div>
                        </div>

                        {/* Info principal */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl md:text-2xl font-bold text-foreground">{tienda.nombre}</h1>

                            {/* Rating y estado en línea */}
                            <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold text-sm">{tienda.puntuacion.toFixed(1)}</span>
                                    <span className="text-sm text-muted-foreground">({reviews.length})</span>
                                </div>
                                <span className="text-muted-foreground">•</span>
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                    {tienda.estado === 'activo' ? 'Abierto' : 'Cerrado'}
                                </Badge>
                                <span className="text-sm text-muted-foreground hidden sm:inline">
                                    {getTodaySchedule(tienda.horarios)}
                                </span>
                            </div>

                            {/* Ubicación y categoría */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {tienda.departamento}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span>{CATEGORY_ICONS[tienda.categoria as any]}</span>
                                    {tienda.categoria}
                                </span>
                                {tienda.telefono && (
                                    <span className="flex items-center gap-1">
                                        <Phone className="w-4 h-4" />
                                        {tienda.telefono}
                                    </span>
                                )}
                            </div>

                            {/* Botones de acción - visible en desktop */}
                            <div className="hidden md:flex gap-2 mt-4">
                                <Button
                                    onClick={handleToggleFollow}
                                    variant={isFollowing ? "outline" : "default"}
                                    className="gap-2"
                                    disabled={!usuario}
                                >
                                    {isFollowing ? "Siguiendo" : "Seguir"}
                                </Button>
                                <Button variant="outline" className="gap-2 bg-transparent">
                                    <MessageCircle className="w-4 h-4" />
                                    Mensaje
                                </Button>
                            </div>
                        </div>

                        {/* Estadísticas - visible en desktop */}
                        <div className="hidden lg:flex items-center gap-6 text-center pr-4">
                            <div>
                                <p className="text-2xl font-bold">{tienda.estadisticas.productosActivos}</p>
                                <p className="text-xs text-muted-foreground">Productos</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{tienda.estadisticas.ventasTotales.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">Ventas</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{tienda.estadisticas.clientesTotales.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">Clientes</p>
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción - visible en móvil */}
                    <div className="flex md:hidden gap-2 mt-4">
                        <Button
                            onClick={handleToggleFollow}
                            variant={isFollowing ? "outline" : "default"}
                            className="flex-1 gap-2"
                            disabled={!usuario}
                        >
                            {isFollowing ? "Siguiendo" : "Seguir"}
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                            <MessageCircle className="w-4 h-4" />
                            Mensaje
                        </Button>
                    </div>

                    {/* Estadísticas móvil + Servicios */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        {/* Stats móvil */}
                        <div className="flex lg:hidden items-center gap-4 text-center">
                            <div className="flex items-center gap-1.5">
                                <Package className="w-4 h-4 text-muted-foreground" />
                                <span className="font-semibold">{tienda.estadisticas.productosActivos}</span>
                                <span className="text-xs text-muted-foreground">productos</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                                <span className="font-semibold">{tienda.estadisticas.ventasTotales.toLocaleString()}</span>
                                <span className="text-xs text-muted-foreground">ventas</span>
                            </div>
                        </div>

                        {/* Servicios */}
                        <div className="flex flex-wrap gap-2 ml-auto">
                            {tienda.delivery.habilitado && (
                                <Badge variant="outline" className="gap-1 text-xs">
                                    <Truck className="w-3 h-3" />
                                    Delivery
                                </Badge>
                            )}
                            {tienda.facturacion.habilitada && (
                                <Badge variant="outline" className="gap-1 text-xs">
                                    <FileText className="w-3 h-3" />
                                    Factura
                                </Badge>
                            )}
                            <Badge variant="outline" className="gap-1 text-xs">
                                <StoreIcon className="w-3 h-3" />
                                Retiro
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* Header de productos con filtros */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <h2 className="text-lg font-semibold">
                        Productos del vendedor
                        <span className="text-muted-foreground font-normal ml-2">({filteredProducts.length})</span>
                    </h2>

                    <div className="flex gap-1 bg-muted rounded-lg p-1 self-start">
                        {[
                            { key: "todos", label: "Todos" },
                            { key: "stock", label: "En stock" },
                            { key: "populares", label: "Populares" },
                        ].map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setProductFilter(filter.key as typeof productFilter)}
                                className={cn(
                                    "px-3 py-1.5 text-sm rounded-md transition-colors",
                                    productFilter === filter.key
                                        ? "bg-background shadow-sm font-medium"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid de productos */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No hay productos disponibles</p>
                    </div>
                )}
            </div>

            {reviews.length > 0 && (
                <div className="bg-background border-t">
                    <div className="max-w-5xl mx-auto px-4 py-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Reseñas destacadas</h2>
                            <Button variant="ghost" size="sm" className="text-primary">
                                Ver todas ({reviews.length})
                            </Button>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {reviews.slice(0, 3).map((review) => (
                                <div key={review.id} className="p-4 rounded-xl border bg-muted/30">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
                                            <Image
                                                src={review.userAvatar}
                                                alt={"Usuario"}
                                                width={40}
                                                height={40}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">Juna</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={cn(
                                                            "w-3 h-3",
                                                            star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted",
                                                        )}
                                                    />
                                                ))}
                                                <span className="text-xs text-muted-foreground ml-2">
                                                    {new Date(review.fecha).toLocaleDateString("es-NI", {
                                                        day: "numeric",
                                                        month: "short",
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-3 line-clamp-3">{review.comentario}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

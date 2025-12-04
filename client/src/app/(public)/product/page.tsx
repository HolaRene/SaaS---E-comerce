"use client";

import { useEffect, useState } from "react";
import { Star, Filter, Plus, Heart, Store, ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Spinner } from "@/components/ui/spinner";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import EmptyState from "@/components/public-negocios/EmptyState";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock data
const categories = ["Electrónica", "Ropas", "Casa y jardín", "Deporte", "Libros", "Juguetes", "Bellesa", "Vehiculos"];

// interface de productos
interface ProductosCard {
    _id: Id<"productos">;
    _creationTime: number;
    publica?: boolean;
    costo?: number;
    ventasTotales?: number;
    creadoEn?: string;
    puntuacionPromedio?: number;
    vistasTotales?: number;
    attributes?: Record<string, string | number | string[]>;
    codigoBarras?: string;
    sku?: string;
    nombre: string;
    categoria: string;
    descripcion: string;
    estado: "activo" | "inactivo" | "agotado";
    ultimaActualizacion: string;
    tiendaId: Id<"tiendas">;
    precio: number;
    imagenes: string[];
    cantidad: number;
    autorId: Id<"usuarios">[];
}


function ProductCard({ product }: { product: ProductosCard }) {
    const [isFavorite, setIsFavorite] = useState(false);
    console.log('es favorito', isFavorite)

    const tiendas = useQuery(api.tiendas.getTiendaById, { id: product.tiendaId })
    // Obtener usuario actual de Clerk
    const { user: clerkUser } = useUser();

    // Obtener usuario de Convex usando el clerkId
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    );

    // Verificar si el producto es favorito
    const esFavorito = useQuery(
        api.favoritos.isProductoFavorito,
        usuario?._id ? { usuarioId: usuario._id, productoId: product._id } : "skip"
    );

    // Mutations para favoritos
    const agregarFavorito = useMutation(api.favoritos.agregarProductoFavorito);
    const eliminarFavorito = useMutation(api.favoritos.eliminarProductoFavorito);

    // Sincronizar estado local con el estado de Convex
    useEffect(() => {
        if (esFavorito !== undefined) {
            setIsFavorite(esFavorito);
        }
    }, [esFavorito]);


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
                    productoId: product._id,
                });
                toast.success("Producto eliminado de favoritos");
            } else {
                await agregarFavorito({
                    usuarioId: usuario._id,
                    productoId: product._id,
                });
                toast.success("Producto guardado en favoritos");
            }
        } catch (error: any) {
            toast.error(error.message || "Error al actualizar favoritos aqui error");
            console.error(error);
        }
    };
    if (!tiendas) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner className="h-8 w-8 text-blue-500" />
            </div>
        )
    }

    return (
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4">
                <div className="relative mb-3">
                    <Link href={`/product/${product._id}`}>
                        <Image src={product.imagenes[0]} alt={product.nombre} className="w-full h-48 object-cover rounded-md" width={192} height={192} />
                    </Link>
                    {product.costo && (
                        <Badge className="absolute top-2 left-2 bg-blue-500 text-white">
                            Guardar
                        </Badge>
                    )}
                </div>

                <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.nombre}</h3>

                <div className="flex items-center mb-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.puntuacionPromedio) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                        ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">(5)</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-gray-900">${product.precio}</span>
                    {product.costo && <span className="text-sm text-gray-500 line-through">${product.costo}</span>}
                </div>

                <div className="text-xs text-gray-600 mb-3">
                    Por <span className="text-blue-600 hover:underline">{tiendas?.nombre}</span>
                </div>


                <div className="flex justify-between">

                    <Button disabled={!usuario} className=" bg-orange-400 hover:bg-orange-500 text-black"><ShoppingCartIcon className="w-4 h-4" />
                        Agregar al carrito
                    </Button>
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
                        <Heart className={cn("w-4 h-4", isFavorite && "fill-red-500 text-red-500")} />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function BuyerHomepage() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState([0, 200]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // obtner los pridyctos
    const productosPublicos = useQuery(api.productos.getProductosPublicosConStock)

    if (productosPublicos === undefined) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner className="h-8 w-8 text-primary" />
            </div>
        )
    }

    if (!productosPublicos) {
        return <EmptyState title="No se encontraron productos" buttonLink="/product/" buttonText="Ver todos los productos" />
    }


    const handleCategoryChange = (category: string, checked: boolean) => {
        setSelectedCategories(checked ? [...selectedCategories, category] : selectedCategories.filter((c) => c !== category));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="p-6 md:p-8 pb-0">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Productos</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex flex-1">
                {/* Sidebar Filters */}
                <aside
                    className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-white border-r p-6 overflow-y-auto transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                        }`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Filtros</h3>
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)}>
                            ✕
                        </Button>
                    </div>

                    {/* Categories */}
                    <div className="mb-6">
                        <h4 className="font-medium mb-3">Categorías</h4>
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <div key={category} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={category}
                                        checked={selectedCategories.includes(category)}
                                        onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                                    />
                                    <label htmlFor={category} className="text-sm">
                                        {category}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                        <h4 className="font-medium mb-3">Rango del precio</h4>
                        <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="mb-2" />
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                        </div>
                    </div>

                    {/* Seller Rating */}
                    <div>
                        <h4 className="font-medium mb-3">Puntuación del vendedor</h4>
                        <div className="space-y-2">
                            {[4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center space-x-2">
                                    <Checkbox id={`rating-${rating}`} />
                                    <label htmlFor={`rating-${rating}`} className="flex items-center text-sm">
                                        <div className="flex">
                                            {[...Array(rating)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                        <span className="ml-1"> & mejor</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Overlay (for mobile) */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>
                )}

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {/* Header Controls */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold">Detalles de los Productos</h2>
                        <div className="flex items-center gap-4 flex-col md:flex-row">
                            <Button variant="outline" size="sm" className="md:hidden" onClick={() => setSidebarOpen(true)}>
                                <Filter className="w-4 h-4 mr-1" /> Filters
                            </Button>
                            <select className="border rounded-md px-3 py-1 text-sm">
                                <option>Precio: Menor a mayor</option>
                                <option>Precio: Mayor a menor</option>
                                <option>Puntuación de las tiendas</option>

                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productosPublicos.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Button variant="outline" className="px-8">
                            <Plus className="mr-2 h-4 w-4" /> Cargar más productos
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    );
}

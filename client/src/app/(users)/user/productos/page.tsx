"use client";

import { useEffect, useState } from "react";
import { Star, Filter, Plus, Heart, Store, ShoppingCartIcon, Loader2, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { Spinner } from "@/components/ui/spinner";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CATEGORIAS } from "@/lib/crear-tienda-datos";
import { useDebounce } from "@/lib/useDebounce";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";


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
    // Estado para el carrito
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [quantity, setQuantity] = useState(1)


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
    const agregarAlCarrito = useMutation(api.carrito.agregarAlCarrito)

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
    const handleAddToCart = async () => {
        if (!usuario?._id) {
            toast.error('Debes iniciar sesión para agregar al carrito')
            return
        }
        if (!product) return
        setIsAddingToCart(true)
        try {
            const result = await agregarAlCarrito({
                usuarioId: usuario._id,
                productoId: product._id,
                cantidad: quantity,
            })
            if (result.action === 'updated') {
                toast.success(`Se actualizó la cantidad en tu carrito`)
            } else {
                toast.success(`${product.nombre} agregado al carrito`)
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
                    <Link href={`/user/productos/${product._id}`}>
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

                    <Button
                        className=" bg-green-400 hover:bg-green-500 text-black text-lg py-3"
                        onClick={handleAddToCart}
                        disabled={isAddingToCart || !usuario}
                    >
                        {isAddingToCart ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <ShoppingCart className="w-5 h-5" />
                        )}
                        {isAddingToCart ? 'Agregando...' : 'Agr. al Carrito'}
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
    // Obtener precio máximo para el slider
    const maxPrecio = useQuery(api.productos.getPrecioMaximoProductos) ?? 5000;

    // Estados de filtros
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrecio]);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<"precio_asc" | "precio_desc" | "puntuacion_desc" | "reciente">("reciente");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Actualizar priceRange cuando cambie maxPrecio
    useEffect(() => {
        if (maxPrecio && priceRange[1] !== maxPrecio) {
            setPriceRange([priceRange[0], maxPrecio]);
        }
    }, [maxPrecio]);

    // Debounce para búsqueda y precio (evita actualizaciones excesivas)
    const debouncedSearch = useDebounce(searchQuery, 500);
    const debouncedPriceRange = useDebounce(priceRange, 300);

    // Usar la nueva query con filtros (con valores debounced)
    const productosPublicos = useQuery(api.productos.filtrarProductosPublicos, {
        busqueda: debouncedSearch.trim() !== "" ? debouncedSearch : undefined,
        categorias: selectedCategories.length > 0 ? selectedCategories : undefined,
        precioMin: debouncedPriceRange[0] > 0 ? debouncedPriceRange[0] : undefined,
        precioMax: debouncedPriceRange[1] < maxPrecio ? debouncedPriceRange[1] : undefined,
        puntuacionMinima: selectedRating ?? undefined,
        ordenarPor: sortBy,
    });

    if (productosPublicos === undefined) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner className="h-8 w-8 text-primary" />
            </div>
        )
    }

    const handleCategoryChange = (category: string, checked: boolean) => {
        setSelectedCategories(checked ? [...selectedCategories, category] : selectedCategories.filter((c) => c !== category));
    };

    const handleRatingChange = (rating: number, checked: boolean) => {
        setSelectedRating(checked ? rating : null);
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedCategories([]);
        setPriceRange([0, maxPrecio]);
        setSelectedRating(null);
        setSortBy("reciente");
    };



    return (
        <div className="min-h-screen flex flex-col">
            <div className="p-1 md:p-1">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/user/dashboard">Tablero de inicio</BreadcrumbLink>
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

                    {/* Search Input */}
                    <div className="mb-6">
                        <h4 className="font-medium mb-3">Buscar</h4>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Producto o tienda..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {(searchQuery.trim() !== "" || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < maxPrecio || selectedRating !== null) && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full mb-4 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={handleClearFilters}
                        >
                            Limpiar filtros
                        </Button>
                    )}

                    {/* Categories */}
                    <div className="mb-6">
                        <h4 className="font-medium mb-3">Categorías</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {CATEGORIAS.map((category) => (
                                <div key={category} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={category}
                                        checked={selectedCategories.includes(category)}
                                        onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                                    />
                                    <label htmlFor={category} className="text-sm cursor-pointer">
                                        {category}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                        <h4 className="font-medium mb-3">Rango del precio</h4>
                        <Slider
                            value={priceRange}
                            onValueChange={(value) => setPriceRange(value as [number, number])}
                            max={maxPrecio}
                            step={Math.max(10, Math.round(maxPrecio / 50))}
                            className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>C${priceRange[0].toLocaleString()}</span>
                            <span>C${priceRange[1].toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Seller Rating */}
                    <div>
                        <h4 className="font-medium mb-3">Puntuación mínima</h4>
                        <div className="space-y-2">
                            {[4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`rating-${rating}`}
                                        checked={selectedRating === rating}
                                        onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
                                    />
                                    <label htmlFor={`rating-${rating}`} className="flex items-center text-sm cursor-pointer">
                                        <div className="flex">
                                            {[...Array(rating)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                            ))}
                                            {[...Array(5 - rating)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-gray-300" />
                                            ))}
                                        </div>
                                        <span className="ml-1">& mejor</span>
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
                        <div>
                            <h2 className="text-2xl font-semibold">Productos</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {productosPublicos.length} producto{productosPublicos.length !== 1 ? 's' : ''} encontrado{productosPublicos.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="flex items-center gap-4 flex-col md:flex-row">
                            <Button variant="outline" size="sm" className="md:hidden" onClick={() => setSidebarOpen(true)}>
                                <Filter className="w-4 h-4 mr-1" /> Filtros
                            </Button>
                            <select
                                className="border rounded-md px-3 py-2 text-sm bg-white"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            >
                                <option value="reciente">Más recientes</option>
                                <option value="precio_asc">Precio: Menor a mayor</option>
                                <option value="precio_desc">Precio: Mayor a menor</option>
                                <option value="puntuacion_desc">Mejor puntuación</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {productosPublicos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {productosPublicos.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
                            <p className="text-gray-500 text-center mb-4">
                                Intenta ajustar los filtros para ver más resultados
                            </p>
                            <Button onClick={handleClearFilters} variant="outline">
                                Limpiar filtros
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

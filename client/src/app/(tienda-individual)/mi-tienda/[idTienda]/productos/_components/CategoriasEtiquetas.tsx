"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowDown, ArrowUp, Edit, Trash2, Eye } from "lucide-react";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const etiquetasData = ["Ofertas", "Nuevo", "Popular", "SinBromato", "Importado"];

const CategoriasEtiquetas = ({ idTienda }: { idTienda: Id<"tiendas"> }) => {

    // Obtener productos de Convex
    const productsTienda = useQuery(api.productos.getProductosByTienda, { tiendaId: idTienda });
    // Etiquetas
    const [nuevaEtiqueta, setNuevaEtiqueta] = useState("")
    const [cargando, setCargando] = useState(false)
    const estadisticasEtiquetas = useQuery(api.etiquetas.getEstadisticas, { tiendaId: idTienda })
    const crearEtiqueta = useMutation(api.etiquetas.crearEtiqueta)
    const eliminarEtiqueta = useMutation(api.etiquetas.eliminarEtiqueta)

    // Agrupar productos por categoría
    const productosPorCategoria = useMemo(() => {
        if (!productsTienda) return [];

        // Obtener categorías únicas
        const categoriasUnicas = Array.from(
            new Set(productsTienda.map(p => p.categoria))
        );

        // Agrupar productos por cada categoría
        return categoriasUnicas.map(categoria => ({
            id: categoria,
            nombre: categoria,
            productos: productsTienda.filter(p => p.categoria === categoria)
        }));
    }, [productsTienda]);

    // Función para formatear precio
    const formatearPrecio = (precio: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(precio);
    };

    // Función para obtener el estado del producto como badge
    const getEstadoBadge = (estado: string, cantidad: number) => {
        if (estado === 'agotado' || cantidad === 0) {
            return <Badge variant="destructive">Agotado</Badge>;
        }
        if (cantidad < 10) {
            return <Badge variant="secondary">Stock Bajo</Badge>;
        }
        return <Badge variant="outline">Disponible</Badge>;
    };

    // -> para etiquetas
    const handleCrearEtiqueta = async () => {
        if (!nuevaEtiqueta.trim()) {
            toast.error("Ingresa un nombre")
            return
        }

        try {
            setCargando(true)
            await crearEtiqueta({
                nombre: nuevaEtiqueta.trim(),
                tiendaId: idTienda,
                color: "#" + Math.floor(Math.random() * 16777215).toString(16),
            })
            setNuevaEtiqueta("")
            toast.success("Etiqueta creada")
        } catch (error: any) {
            toast.error(error.message || "Error al crear")
        } finally {
            setCargando(false)
        }
    }
    const handleEliminarEtiqueta = async (etiquetaId: Id<"etiquetas">) => {
        if (!confirm("¿Eliminar esta etiqueta? Se quitará de todos los productos.")) return

        try {
            await eliminarEtiqueta({ etiquetaId })
            toast.success("Etiqueta eliminada")
        } catch (error) {
            toast.error("Error al eliminar")
        }
    }

    return (
        <div className='grid md:grid-cols-2 gap-4 grid-cols-1 mb-3'>
            <Card>
                <CardHeader>
                    <CardTitle>Gestión de Productos por Categoría</CardTitle>
                    <CardDescription>Organiza y gestiona tus productos según su categoría.</CardDescription>
                </CardHeader>
                <CardContent>
                    {productsTienda === undefined ? (
                        <p className="text-center py-4 text-muted-foreground">Cargando productos...</p>
                    ) : productosPorCategoria.length === 0 ? (
                        <p className="text-center py-4 text-muted-foreground">No hay productos en esta tienda</p>
                    ) : (
                        <Accordion type="single" collapsible className="w-full">
                            {productosPorCategoria.map(cat => (
                                <AccordionItem key={cat.id} value={cat.id}>
                                    <AccordionTrigger className="hover:no-underline">
                                        <div className="flex items-center justify-between w-full">
                                            <span>{cat.nombre}</span>
                                            <Badge variant="secondary" className="ml-2">
                                                {cat.productos.length} productos
                                            </Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pl-4">
                                        {cat.productos.length === 0 ? (
                                            <div className="text-center py-4 text-muted-foreground">
                                                No hay productos en esta categoría
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {cat.productos.map(producto => (
                                                    <div
                                                        key={producto._id}
                                                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                                                    >
                                                        <div className="flex items-center space-x-3 flex-1">
                                                            {/* Imagen del producto */}
                                                            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                                                                {producto.imagenes && producto.imagenes.length > 0 ? (
                                                                    <img
                                                                        src={producto.imagenes[0]}
                                                                        alt={producto.nombre}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                                                        Sin imagen
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Información del producto */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center space-x-2 mb-1">
                                                                    <h4 className="font-medium text-sm truncate">
                                                                        {producto.nombre}
                                                                    </h4>
                                                                    {getEstadoBadge(producto.estado, producto.cantidad)}
                                                                </div>
                                                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                                                    <span>C$ {producto.precio}</span>
                                                                    <span>Stock: {producto.cantidad}</span>
                                                                    <span>⭐ {producto.puntuacionPromedio || 0}</span>
                                                                </div>
                                                                {/* Categoría del producto */}
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-xs"
                                                                    >
                                                                        {producto.categoria}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Acciones */}
                                                        <div className="flex items-center space-x-1 ml-4">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                title="Ver producto"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                title="Editar producto"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                                title="Eliminar producto"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Agregar Categoría</Button>
                    <Button>Agregar Producto</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Etiquetas de Búsqueda</CardTitle>
                    <CardDescription>Ayuda a tus clientes a encontrar productos fácilmente.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Etiquetas activas */}
                        <div>
                            <h4 className="text-sm font-medium mb-2">Etiquetas activas</h4>
                            <div className="flex flex-wrap gap-2">
                                {estadisticasEtiquetas === undefined ? (
                                    <p className="text-sm text-muted-foreground">Cargando...</p>
                                ) : estadisticasEtiquetas.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No hay etiquetas</p>
                                ) : (
                                    estadisticasEtiquetas.map(etiqueta => (
                                        <Badge
                                            key={etiqueta._id}
                                            variant="secondary"
                                            className="px-3 py-1"
                                            style={{ backgroundColor: etiqueta.color }}
                                        >
                                            {etiqueta.icono} {etiqueta.nombre}
                                            <button
                                                className="ml-2 hover:text-destructive"
                                                onClick={() => handleEliminarEtiqueta(etiqueta._id)}
                                            >
                                                ×
                                            </button>
                                        </Badge>
                                    ))
                                )}
                            </div>
                        </div>
                        {/* Estadísticas */}
                        <div>
                            <h4 className="text-sm font-medium mb-2">Uso en productos</h4>
                            <div className="space-y-2">
                                {estadisticasEtiquetas?.map(etiqueta => (
                                    <div key={etiqueta._id} className="flex items-center justify-between text-sm">
                                        <span>{etiqueta.icono} {etiqueta.nombre}</span>
                                        <Badge variant="outline">
                                            {etiqueta.cantidadProductos} productos
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Crear nueva */}
                        <div className="pt-4 border-t">
                            <h4 className="text-sm font-medium mb-2">Agregar nueva etiqueta</h4>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Ej: Orgánico, Sin gluten..."
                                    value={nuevaEtiqueta}
                                    onChange={(e) => setNuevaEtiqueta(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCrearEtiqueta()}
                                />
                                <Button
                                    size="sm"
                                    onClick={handleCrearEtiqueta}
                                    disabled={cargando || !nuevaEtiqueta.trim()}
                                >
                                    {cargando ? "Creando..." : "Agregar"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CategoriasEtiquetas;
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
import { categoriasData, productos } from "@/lib/tiendas-datos";
import { ArrowDown, ArrowUp, Edit, Trash2, Eye } from "lucide-react";

const etiquetasData = ["Ofertas", "Nuevo", "Popular", "SinBromato", "Importado"];

const CategoriasEtiquetas = () => {
    // Función para agrupar productos por categoría
    const productosPorCategoria = categoriasData.map(categoria => {
        // Filtrar productos que pertenecen a esta categoría o sus subcategorías
        const productosEnCategoria = productos.filter(producto =>
            producto.categoria.some(cat =>
                [categoria.nombre, ...categoria.subcategorias].includes(cat)
            )
        );

        return {
            ...categoria,
            productos: productosEnCategoria
        };
    });

    // Función para formatear precio
    const formatearPrecio = (precio: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(precio);
    };

    // Función para obtener el estado del producto como badge
    const getEstadoBadge = (estado: string, stock: number) => {
        if (estado === 'agotado' || stock === 0) {
            return <Badge variant="destructive">Agotado</Badge>;
        }
        if (stock < 10) {
            return <Badge variant="secondary">Stock Bajo</Badge>;
        }
        return <Badge variant="outline">Disponible</Badge>;
    };

    return (
        <div className='grid md:grid-cols-2 gap-4 grid-cols-1 mb-3'>
            <Card>
                <CardHeader>
                    <CardTitle>Gestión de Productos por Categoría</CardTitle>
                    <CardDescription>Organiza y gestiona tus productos según su categoría.</CardDescription>
                </CardHeader>
                <CardContent>
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
                                                    key={producto.id}
                                                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex items-center space-x-3 flex-1">
                                                        {/* Imagen del producto */}
                                                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                                                            {producto.imagen && producto.imagen.length > 0 ? (
                                                                <img
                                                                    src={producto.imagen[0]}
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
                                                                {getEstadoBadge(producto.estado, producto.stock)}
                                                            </div>
                                                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                                                <span>{formatearPrecio(producto.precio)}</span>
                                                                <span>Stock: {producto.stock}</span>
                                                                <span>⭐ {producto.puntuacion}</span>
                                                            </div>
                                                            {/* Categorías del producto */}
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {producto.categoria.map((cat, index) => (
                                                                    <Badge
                                                                        key={index}
                                                                        variant="outline"
                                                                        className="text-xs"
                                                                    >
                                                                        {cat}
                                                                    </Badge>
                                                                ))}
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
                        {/* Etiquetas existentes */}
                        <div>
                            <h4 className="text-sm font-medium mb-2">Etiquetas activas</h4>
                            <div className="flex flex-wrap gap-2">
                                {etiquetasData.map(tag => (
                                    <Badge key={tag} variant="secondary" className="px-3 py-1">
                                        {tag}
                                        <button className="ml-1 hover:text-destructive">×</button>
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Estadísticas de uso de etiquetas */}
                        <div>
                            <h4 className="text-sm font-medium mb-2">Uso en productos</h4>
                            <div className="space-y-2">
                                {etiquetasData.map(tag => {
                                    const productosConEtiqueta = productos.filter(p =>
                                        p.categoria.includes(tag)
                                    ).length;
                                    return (
                                        <div key={tag} className="flex items-center justify-between text-sm">
                                            <span>{tag}</span>
                                            <Badge variant="outline">
                                                {productosConEtiqueta} productos
                                            </Badge>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Agregar nueva etiqueta */}
                        <div className="pt-4 border-t">
                            <h4 className="text-sm font-medium mb-2">Agregar nueva etiqueta</h4>
                            <div className="flex gap-2">
                                <Input placeholder="Ej: Orgánico, Sin gluten..." />
                                <Button size="sm">Agregar</Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CategoriasEtiquetas;
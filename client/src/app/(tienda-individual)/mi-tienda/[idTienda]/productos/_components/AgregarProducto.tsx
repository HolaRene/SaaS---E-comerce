"use client";

import {
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { SelectorEtiquetas } from "./SelectorEtiquetas";

// --- Categorías internas de pulpería ---
const pulperiaCategories = [
    "Bebidas",
    "Snacks",
    "Cereales",
    "Lácteos",
    "Higiene",
    "Limpieza",
    "Abarrotes",
    "Enlatados",
    "Pan",
    "Huevos",
    "Otros",
] as const;

// --- Schema Zod ---
const formSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(1),

    category: z.enum(pulperiaCategories),
    cantidad: z.number({ message: "debe ser núm" }).min(1),

    attributes: z.object({
        marca: z.string().min(1),
        contenido: z.string().min(1),
        unidadMedida: z.enum(["g", "kg", "ml", "L", "unidades"]),
        fechaExpiracion: z.string(),
        codigoBarras: z.string().optional(),
    }),
});

const AddProductPulperia = ({ idTienda }: { idTienda: Id<"tiendas"> }) => {
    const [cargando, setCargando] = useState(false)

    const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState<Id<"etiquetas">[]>([])
    const asignarEtiqueta = useMutation(api.productoEtiquetas.asignarEtiqueta)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "prueba 1",
            description: "esta es una prueba",
            price: 45,
            category: pulperiaCategories[0],
            cantidad: 10,
            attributes: {
                marca: "",
                contenido: "",
                unidadMedida: "g",
                fechaExpiracion: "",
                codigoBarras: "",
            }
        }

    });
    type productoFormData = z.infer<typeof formSchema>;

    const crearProductos = useMutation(api.productos.crearProducto)

    const manejoEnvío = async (data: productoFormData) => {
        try {
            setCargando(true)
            const newProductId = await crearProductos({
                nombre: data.name,
                categoria: data.category,
                cantidad: data.cantidad,
                descripcion: data.description,
                precio: data.price,
                codigoBarras: data.attributes.codigoBarras,
                tiendaId: idTienda,
                // Campos requeridos adicionales
                imagenes: [], // Por ahora vacío, después agregarás subida de imágenes
                estado: "activo" as const,
                attributes: {
                    fechaExpiracion: data.attributes.fechaExpiracion,
                    contenido: data.attributes.contenido,
                    unidadMedida: data.attributes.unidadMedida,
                    marca: data.attributes.marca,
                },
            })

            for (const etiquetaId of etiquetasSeleccionadas) {
                await asignarEtiqueta({
                    productoId: newProductId,
                    etiquetaId,
                    tiendaId: idTienda,
                })
            }
            form.reset(); // Limpiar formulario después de crear
            toast.success("Producto creado exitosamente")
            toast.success("Producto creado con etiquetas")
            setEtiquetasSeleccionadas([]) // Limpiar etiquetas
            setCargando(false)
        } catch (error) {
            console.error("Error al crear producto:", error);
            toast("Error al crear producto")
            setCargando(false)
        }
    }



    return (
        <SheetContent className="px-3 pb-10">
            <ScrollArea className="h-screen">
                <SheetHeader>
                    <SheetTitle className="mb-4">Agregar producto (Pulpería)</SheetTitle>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(manejoEnvío)} className="space-y-3">

                        {/* Nombre */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del producto</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cantidad"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cantidad</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            onChange={e => field.onChange(parseInt(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Descripción */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción completa</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Precio */}
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Precio</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Categoría interna */}
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoría</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una categoría" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {pulperiaCategories.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>
                                                        {cat}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Marca */}
                        <FormField
                            control={form.control}
                            name="attributes.marca"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Marca</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Contenido */}
                        <FormField
                            control={form.control}
                            name="attributes.contenido"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contenido (ej. 500ml, 1kg)</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Unidad de medida */}
                        <FormField
                            control={form.control}
                            name="attributes.unidadMedida"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unidad de medida</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona unidad" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["g", "kg", "ml", "L", "unidades"].map((u) => (
                                                    <SelectItem key={u} value={u}>
                                                        {u}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Expiración */}
                        <FormField
                            control={form.control}
                            name="attributes.fechaExpiracion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha de expiración</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Código de barras */}
                        <FormField
                            control={form.control}
                            name="attributes.codigoBarras"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código de barras (opcional)</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Etiquetas */}
                        <SelectorEtiquetas
                            tiendaId={idTienda}
                            etiquetasSeleccionadas={etiquetasSeleccionadas}
                            onEtiquetasChange={setEtiquetasSeleccionadas}
                        />

                        <Button type="submit">Agregar producto</Button>
                    </form>
                </Form>
            </ScrollArea>
        </SheetContent>
    );
};

export default AddProductPulperia;

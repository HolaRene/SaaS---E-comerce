"use client"

import { useState } from "react"
import { Edit } from "lucide-react"
import { useWatch } from "react-hook-form"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Doc, Id } from "../../../../../../../convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "../../../../../../../convex/_generated/api"
import { toast } from "sonner"
import SubidaImgs from "@/components/subir-img/subidaImgs"

const formSchema = z.object({
    nombre: z.string().min(1),
    descripcion: z.string().min(1),
    precio: z.number().min(0),
    costo: z.optional(z.number()),
    cantidad: z.number().min(0),
    categoria: z.string().min(1),
})

const EditarProducto = ({ producto }: { producto: Doc<"productos"> }) => {

    const [open, setOpen] = useState(false)
    // imagen en el archivo
    // Inicializamos con IDs dummy para mantener la sincronización con imageUrls
    const [imageStorageIds, setImageStorageIds] = useState<Id<"_storage">[]>(
        (producto.imagenes || []).map(() => "existing_image" as Id<"_storage">)
    )
    // imge url
    const [imageUrls, setImageUrls] = useState<string[]>(producto.imagenes || [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: producto.nombre || "",
            descripcion: producto.descripcion || "",
            precio: producto.precio ?? 0,
            costo: producto.costo ?? producto.precio ?? 0,
            cantidad: producto.cantidad ?? 0,
            categoria: producto.categoria || "",
        }
    })

    const actualizar = useMutation(api.productos.actualizarProducto)

    // Watch price and costo to show advertencia
    const watchedPrice = useWatch({ control: form.control, name: "precio" }) as number | undefined
    const watchedCosto = useWatch({ control: form.control, name: "costo" }) as number | undefined
    const margenNegativo = (watchedCosto ?? 0) >= (watchedPrice ?? 0)
    const [confirmarMargenNegativo, setConfirmarMargenNegativo] = useState(false)

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            if (margenNegativo && !confirmarMargenNegativo) {
                toast.error("El costo es mayor o igual al precio. Marca la casilla para confirmar y continuar.")
                return
            }

            await actualizar({
                productoId: producto._id,
                datos: {
                    ...data,
                    imagenes: imageUrls
                }
            })
            toast.success("Producto actualizado")
            setOpen(false)
            // No recargamos la página: Convex actualizará las queries suscritas
        } catch (err) {
            console.error(err)
            toast.error("Error al actualizar producto")
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={`Editar ${producto.nombre}`}>
                    <Edit className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Editar producto</SheetTitle>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full px-2">
                        <div className="space-y-3 max-h-[60vh] overflow-auto pr-2">
                            <FormField control={form.control} name="nombre" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="descripcion" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="pt-10 flex flex-col">
                                <SubidaImgs
                                    imageUrls={imageUrls}
                                    setImageUrls={setImageUrls}
                                    imageStorageIds={imageStorageIds}
                                    setImageStorageIds={setImageStorageIds}
                                />
                            </div>

                            <FormField control={form.control} name="precio" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Precio</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="costo" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Costo unitario</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Advertencia si costo >= precio */}
                            {((form.getValues("costo") ?? 0) >= (form.getValues("precio") ?? 0)) && (
                                <div className="p-3 mt-2 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
                                    <p className="font-medium">Advertencia: El costo es mayor o igual al precio de venta.</p>
                                    <p className="text-sm">Esto resultará en margen cero o negativo. Marca la casilla abajo para confirmar y continuar.</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <input type="checkbox" checked={confirmarMargenNegativo} onChange={(e) => setConfirmarMargenNegativo(e.target.checked)} />
                                        <label className="text-sm">Confirmo que deseo guardar este producto con margen negativo</label>
                                    </div>
                                </div>
                            )}

                            <FormField control={form.control} name="cantidad" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cantidad</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="categoria" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoría</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <div className="sticky bottom-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur p-3 flex gap-2 justify-end border-t">
                            <Button type="submit">Guardar</Button>
                            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                        </div>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}

export default EditarProducto

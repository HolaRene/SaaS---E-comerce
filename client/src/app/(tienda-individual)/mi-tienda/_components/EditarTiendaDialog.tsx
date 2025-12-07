"use client";

import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Store, Upload } from "lucide-react";
import { useState } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SubidaImg from "@/components/subir-img/subidaImg";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Esquema de validación
const formSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    descripcion: z.string().optional(),
    direccion: z.string().optional(),
    telefono: z.string().optional(),
    departamento: z.string().optional(),
    categoria: z.string().optional(),
    avatar: z.string().optional(),
    imgBanner: z.string().optional(),
});

interface EditarTiendaDialogProps {
    tienda: {
        _id: Id<"tiendas">;
        nombre: string;
        descripcion?: string;
        direccion?: string;
        telefono?: string;
        departamento?: string;
        categoria?: string;
        avatar?: string;
        imgBanner?: string;
    };
    trigger?: React.ReactNode;
}

const DEPARTAMENTOS = [
    "Boaco", "Carazo", "Chinandega", "Chontales", "Estelí",
    "Granada", "Jinotega", "León", "Madriz", "Managua",
    "Masaya", "Matagalpa", "Nueva Segovia", "Rivas",
    "Río San Juan", "RAAN", "RAAS"
];

const CATEGORIAS = [
    "Restaurante", "Tienda de Ropa", "Tecnología", "Supermercado",
    "Farmacia", "Ferretería", "Librería", "Otros"
];

export default function EditarTiendaDialog({ tienda, trigger }: EditarTiendaDialogProps) {
    const [open, setOpen] = useState(false);
    const updateTienda = useMutation(api.tiendas.updateTienda);

    // Estados para imágenes
    const [avatarUrl, setAvatarUrl] = useState(tienda.avatar || "");
    const [avatarStorageId, setAvatarStorageId] = useState<Id<"_storage"> | null>(null); // No se usa directamente en update pero good to have

    const [bannerUrl, setBannerUrl] = useState(tienda.imgBanner || "");
    const [bannerStorageId, setBannerStorageId] = useState<Id<"_storage"> | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: tienda.nombre,
            descripcion: tienda.descripcion || "",
            direccion: tienda.direccion || "",
            telefono: tienda.telefono || "",
            departamento: tienda.departamento || "",
            categoria: tienda.categoria || "",
            avatar: tienda.avatar || "",
            imgBanner: tienda.imgBanner || "",
        },
    });

    // Actualizar valores del formulario cuando las URLs de imágenes cambian
    // Esto es necesario porque SubidaImg maneja su propio estado
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await updateTienda({
                id: tienda._id,
                nombre: values.nombre,
                descripcion: values.descripcion,
                direccion: values.direccion,
                telefono: values.telefono,
                departamento: values.departamento,
                categoria: values.categoria,
                avatar: avatarUrl, // Usar estado local actualizado
                imgBanner: bannerUrl, // Usar estado local actualizado
            });

            toast.success("Tienda actualizada correctamente");
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar la tienda");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Store className="mr-2 h-4 w-4" /> Editar Perfil
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Editar Perfil de Tienda</DialogTitle>
                    <DialogDescription>
                        Actualiza la información visible de tu negocio.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[70vh] px-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-6">

                            {/* Sección Imágenes */}
                            <div className="space-y-4 border-b pb-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Imágenes del Perfil</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <FormLabel>Logo / Avatar</FormLabel>
                                        <div className="pt-10 flex flex-col">
                                            <SubidaImg
                                                image={avatarUrl}
                                                setImage={setAvatarUrl}
                                                setImageStorageId={setAvatarStorageId as any} // Cast simple por ahora
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <FormLabel>Banner / Portada</FormLabel>
                                        <div className="pt-10 flex flex-col">
                                            <SubidaImg
                                                image={bannerUrl}
                                                setImage={setBannerUrl}
                                                setImageStorageId={setBannerStorageId as any}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sección Datos Generales */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Información General</h3>

                                <FormField
                                    control={form.control}
                                    name="nombre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre del Negocio</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej. Tienda Los Angeles" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="categoria"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Categoría</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona una categoría" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {CATEGORIAS.map((cat) => (
                                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="departamento"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Departamento</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona ubicación" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {DEPARTAMENTOS.map((dep) => (
                                                            <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>


                                <FormField
                                    control={form.control}
                                    name="descripcion"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descripción</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe tu negocio..."
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="direccion"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Dirección</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Dirección física" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="telefono"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Teléfono / WhatsApp</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+505 8888 8888" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Guardar Cambios
                                </Button>
                            </div>

                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

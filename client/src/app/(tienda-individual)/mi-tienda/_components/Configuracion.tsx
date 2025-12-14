"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, CheckCircle2, FileText, Globe, Save, Loader2, ShieldAlert } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id, Doc } from "../../../../../convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
    NIT: z.string().optional(),
    RUC: z.string().optional(),
    direccion: z.string().optional(),
    moneda: z.string(),
    backup: z.string().optional(),
    whatsapp: z.string().optional(),
});

interface ConfiguracionProps {
    id: Id<"tiendas">;
    tiendaData: Doc<"tiendas">;
    usuarioData: Doc<"usuarios"> | null | undefined;
    isOwner: boolean;
    role: string;
}

const Configuracion = ({ id, tiendaData: tienda, usuarioData: usuario, isOwner, role }: ConfiguracionProps) => {

    const updateTienda = useMutation(api.tiendas.updateTienda);

    // Configuración sensible solo para propietario o admin
    const canEditSensitive = isOwner || role === 'admin';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: tienda ? {
            NIT: tienda.configuracion?.NIT || "",
            RUC: tienda.configuracion?.RUC || "",
            direccion: tienda.direccion || "",
            moneda: tienda.configuracion?.moneda || "NIO",
            backup: tienda.configuracion?.backup || "Diario",
            whatsapp: tienda.configuracion?.whatsapp || "",
        } : undefined
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!tienda) return;

        if (!canEditSensitive) {
            toast.error("No tienes permisos para modificar la configuración");
            return;
        }

        try {
            await updateTienda({
                id: tienda._id,
                direccion: values.direccion,
                configuracion: {
                    ...tienda.configuracion,
                    NIT: values.NIT,
                    RUC: values.RUC,
                    moneda: values.moneda,
                    backup: values.backup,
                    whatsapp: values.whatsapp,
                    permisosTienda: tienda.configuracion.permisosTienda // Mantener permisos existentes
                }
            });
            toast.success("Configuración actualizada correctamente");
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar la configuración");
        }
    };

    if (!canEditSensitive) {
        return (
            <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Acceso Restringido</AlertTitle>
                <AlertDescription>
                    Solo el propietario o administradores pueden modificar la configuración fiscal y sensible de la tienda.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className='space-y-3'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Datos Fiscales</CardTitle>
                            <CardDescription>Información legal y fiscal de tu negocio.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="NIT"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>NIT</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input {...field} className="pl-10" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="RUC"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>RUC</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input {...field} className="pl-10" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="direccion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dirección Fiscal</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input {...field} className="pl-10" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Preferencias del Sistema</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="moneda"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Moneda Predeterminada</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona una moneda" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="NIO">Córdoba (NIO)</SelectItem>
                                                    <SelectItem value="USD">Dólar (USD)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="space-y-2">
                                    <Label htmlFor="formato-fecha">Formato de Fecha y Hora</Label>
                                    <Input id="formato-fecha" defaultValue="DD/MM/YYYY hh:mm A" disabled />
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <FormField
                                    control={form.control}
                                    name="backup"
                                    render={({ field }) => (
                                        <div className="w-full flex justify-between items-center">
                                            <div>
                                                <Label>Backup Automático</Label>
                                                <p className="text-sm text-muted-foreground">Frecuencia de respaldo: {field.value}</p>
                                            </div>
                                            <Select onValueChange={field.onChange} defaultValue={field.value || "Diario"}>
                                                <FormControl>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Frecuencia" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Diario">Diario</SelectItem>
                                                    <SelectItem value="Semanal">Semanal</SelectItem>
                                                    <SelectItem value="Mensual">Mensual</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Integraciones</CardTitle>
                            <CardDescription>Conecta tu negocio con otras plataformas.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className={`h-6 w-6 ${tienda.telefono ? 'text-green-500' : 'text-gray-400'}`} />
                                    <div>
                                        <p className="font-semibold">WhatsApp</p>
                                        <p className="text-sm text-muted-foreground">{
                                            tienda.telefono ? 'Conectado (Usando teléfono del perfil)' : 'No conectado'
                                        }</p>
                                    </div>
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="whatsapp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número para Enlace de WhatsApp (opcional)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input {...field} placeholder="Ej. 50588888888" className="pl-10" />
                                            </div>
                                        </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Este número se usará para el enlace directo &quot;wa.me&quot;. Si se deja vacío, se usará el teléfono principal.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    )
}

export default Configuracion
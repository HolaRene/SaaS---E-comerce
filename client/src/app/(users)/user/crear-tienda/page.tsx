"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Check, Loader, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import {
    CATEGORIAS,
    DEPARTAMENTOS_NIC,
    DIAS_SEMANA,
} from "@/lib/crear-tienda-datos";
import SubidaImg from "@/components/subir-img/subidaImg";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import Link from "next/link";
const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return <p className="text-sm text-red-500 mt-1">{message}</p>;
};

// Schema completo para validación
const storeSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    categoria: z.string().min(1, "Selecciona una categoría"),
    descripcion: z.string().min(5, "La descripción debe tener al menos 5 caracteres"),
    direccion: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
    telefono: z.string().regex(/^\+?[\d\s-()]+$/, "Formato de teléfono inválido"),
    departamento: z.string().min(1, "Selecciona un departamento"),
    lat: z.number().min(-90, "Latitud debe estar entre -90 y 90").max(90, "Latitud debe estar entre -90 y 90"),
    lng: z.number().min(-180, "Longitud debe estar entre -180 y 180").max(180, "Longitud debe estar entre -180 y 180"),

    configuracion: z.object({
        NIT: z.string().optional(),
        RUC: z.string().optional(),
        moneda: z.string().min(1, "Selecciona una moneda"),
        whatsapp: z.string().optional(),
        permisosTienda: z.object({
            vendedoresPuedenCrearProductos: z.boolean(),
            vendedoresPuedenModificarPrecios: z.boolean(),
            vendedoresPuedenVerReportes: z.boolean(),
            maxVendedores: z.number().min(1, "Debe haber al menos 1 vendedor")
        })
    }),

    horarios: z.array(
        z.object({
            dia: z.string(),
            apertura: z.string().min(1, "Elige hora de apertura"),
            cierre: z.string().min(1, "Elige hora de cierre"),
            cerrado: z.boolean(),
            aperturaEspecial: z.string().optional(),
            cierreEspecial: z.string().optional(),
        })
    ).length(7, "Debes definir los 7 días de la semana"),
});

type StoreFormData = z.infer<typeof storeSchema>;

const steps = [
    { id: 1, title: "Información Básica", description: "Datos generales de la tienda" },
    { id: 2, title: "Horarios", description: "Horario semanal de atención" },
    { id: 3, title: "Configuración", description: "Datos administrativos" },
];

export default function CreateStoreForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [cargando, setCargando] = useState(false);
    // Estados para imágenes
    const [avatarUrl, setAvatarUrl] = useState("");
    const [avatarStorageId, setAvatarStorageId] = useState<Id<"_storage"> | null>(null); // No se usa directamente en update pero good to have

    const [bannerUrl, setBannerUrl] = useState("");
    const [bannerStorageId, setBannerStorageId] = useState<Id<"_storage"> | null>(null);
    const router = useRouter();
    const crearTienda = useMutation(api.tiendas.crearTienda);


    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        trigger,
        control
    } = useForm<StoreFormData>({
        resolver: zodResolver(storeSchema),
        mode: "onChange",
        defaultValues: {
            nombre: "La esperanza",
            categoria: "",
            descripcion: "Tienda flexi",
            direccion: "LLegando a Allá",
            telefono: "",
            departamento: "",
            lat: 12.8654,
            lng: -85.2072,

            configuracion: {
                NIT: "",
                RUC: "",
                moneda: "Córdoba",
                whatsapp: "",
                permisosTienda: {
                    vendedoresPuedenCrearProductos: true,
                    vendedoresPuedenModificarPrecios: false,
                    vendedoresPuedenVerReportes: false,
                    maxVendedores: 3,
                },
            },

            horarios: DIAS_SEMANA.map((dia) => ({
                dia,
                apertura: "08:00",
                cierre: "17:00",
                cerrado: false,
            })),
        },
    });

    const validateStep = async () => {
        const fields =
            currentStep === 1
                ? ["nombre", "categoria", "descripcion", "direccion", "telefono", "departamento", "lat", "lng"]
                : currentStep === 2
                    ? ["horarios"]
                    : ["configuracion"];

        const result = await trigger(fields as ("nombre" | "categoria" | "descripcion" | "direccion" | "telefono" | "departamento" | "lat" | "lng" | "horarios" | "configuracion")[]);
        return result;
    };

    const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const isValid = await validateStep();
        if (isValid && currentStep < 3) {
            setCurrentStep((s) => s + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) setCurrentStep((s) => s - 1);
    };

    const onFormSubmit = async (data: StoreFormData) => {
        if (currentStep !== 3) {
            toast.error("Completa todos los pasos antes de enviar");
            return;
        }

        try {
            setCargando(true);
            await crearTienda({
                nombre: data.nombre,
                categoria: data.categoria,
                descripcion: data.descripcion,
                direccion: data.direccion,
                departamento: data.departamento,
                telefono: data.telefono,
                lat: data.lat,
                lng: data.lng,
                avatar: avatarUrl,
                imgBanner: bannerUrl,
                configuracion: {
                    NIT: data.configuracion.NIT || "",
                    RUC: data.configuracion.RUC || "",
                    moneda: data.configuracion.moneda,
                    whatsapp: data.configuracion.whatsapp || "",
                    permisosTienda: {
                        vendedoresPuedenCrearProductos: data.configuracion.permisosTienda.vendedoresPuedenCrearProductos,
                        vendedoresPuedenModificarPrecios: data.configuracion.permisosTienda.vendedoresPuedenModificarPrecios,
                        vendedoresPuedenVerReportes: data.configuracion.permisosTienda.vendedoresPuedenVerReportes,
                        maxVendedores: data.configuracion.permisosTienda.maxVendedores,
                    }
                },
                horarios: data.horarios.map(h => ({
                    dia: h.dia,
                    apertura: h.apertura,
                    cierre: h.cierre,
                    cerrado: h.cerrado,
                    aperturaEspecial: h.aperturaEspecial,
                    cierreEspecial: h.cierreEspecial,
                })),
            });
            toast.success("Tienda creada con éxito");
            router.push("/user/dashboard");
        } catch (error) {
            console.error("❌ Error:", error);
            setCargando(false)
            if (error instanceof ConvexError) {
                toast.error(error.data);
            } else {
                toast.error("Error inesperado al crear la tienda");
            }
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, i) => (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors
                  ${currentStep >= step.id
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                                </div>
                                <div className="mt-2 text-center">
                                    <p className="text-sm font-medium">{step.title}</p>
                                    <p className="text-xs text-muted-foreground hidden sm:block">
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            {i < steps.length - 1 && (
                                <div
                                    className={`h-1 flex-1 mx-2 ${currentStep > step.id ? "bg-primary" : "bg-muted"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                        <CardDescription>{steps[currentStep - 1].description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* STEP 1 */}
                        {currentStep === 1 && (
                            <>
                                <div className="space-y-2">
                                    <Label>Nombre de la Tienda *</Label>
                                    <Input {...register("nombre")} placeholder="Ej: El Buen Precio" />
                                    <ErrorMessage message={errors.nombre?.message} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Logo / Avatar</Label>
                                    <div className="pt-10 flex flex-col">
                                        <SubidaImg
                                            image={avatarUrl}
                                            setImage={setAvatarUrl}
                                            setImageStorageId={setAvatarStorageId as any} // Cast simple por ahora
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Banner / Portada</Label>
                                    <div className="pt-10 flex flex-col">
                                        <SubidaImg
                                            image={bannerUrl}
                                            setImage={setBannerUrl}
                                            setImageStorageId={setBannerStorageId as any}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Categoría *</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            setValue("categoria", value, { shouldValidate: true })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIAS.map((c) => (
                                                <SelectItem key={c} value={c}>
                                                    {c}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <ErrorMessage message={errors.categoria?.message} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Descripción *</Label>
                                    <Input {...register("descripcion")} placeholder="Descripción de tu tienda" />
                                    <ErrorMessage message={errors.descripcion?.message} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Dirección *</Label>
                                    <Input {...register("direccion")} placeholder="Av. Principal 123" />
                                    <ErrorMessage message={errors.direccion?.message} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Teléfono *</Label>
                                        <Input {...register("telefono")} placeholder="+505 87654321" />
                                        <ErrorMessage message={errors.telefono?.message} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Departamento *</Label>
                                        <Select
                                            onValueChange={(value) =>
                                                setValue("departamento", value, { shouldValidate: true })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Departamento" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DEPARTAMENTOS_NIC.map((d) => (
                                                    <SelectItem key={d} value={d}>
                                                        {d}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <ErrorMessage message={errors.departamento?.message} />
                                    </div>
                                </div>

                                <TooltipProvider>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Campo Latitud */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Label htmlFor="lat">Latitud *</Label>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground cursor-help hidden sm:inline-block" />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-xs">
                                                        <p className="text-sm">
                                                            Coordenada geográfica norte-sur. Obténla desde Google Maps con clic derecho.
                                                            Rango: -90 a 90. Verifica en {" "}
                                                            <Link
                                                                href="https://www.latlong.net"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-500 underline hover:text-blue-600"
                                                            >
                                                                latlong.net
                                                            </Link>
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <Input
                                                id="lat"
                                                type="number"
                                                step="any"
                                                placeholder="Ej: 12.8654"
                                                {...register("lat", { valueAsNumber: true })}
                                            />
                                            {/* Ayuda visible solo en móvil */}
                                            <p className="text-xs text-muted-foreground sm:hidden flex items-center gap-1">
                                                <Info className="h-3 w-3" />
                                                <span>Clic derecho en Google Maps para copiar. Rango: -90 a 90, o en <Link
                                                    href="https://www.latlong.net"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 underline hover:text-blue-600"
                                                >
                                                    latlong.net
                                                </Link></span>
                                            </p>
                                            <ErrorMessage message={errors.lat?.message} />
                                        </div>

                                        {/* Campo Longitud */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Label htmlFor="lng">Longitud *</Label>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground cursor-help hidden sm:inline-block" />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-xs">
                                                        <p className="text-sm">
                                                            Coordenada geográfica este-oeste. Obténla desde Google Maps con clic derecho.
                                                            Rango: -180 a 180. Verifica en {" "}
                                                            <Link
                                                                href="https://www.latlong.net"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-500 underline hover:text-blue-600"
                                                            >
                                                                latlong.net
                                                            </Link>
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <Input
                                                id="lng"
                                                type="number"
                                                step="any"
                                                placeholder="Ej: -85.2072"
                                                {...register("lng", { valueAsNumber: true })}
                                            />
                                            {/* Ayuda visible solo en móvil */}
                                            <p className="text-xs text-muted-foreground sm:hidden flex items-center gap-1">
                                                <Info className="h-3 w-3" />
                                                <span>Clic derecho en Google Maps para copiar. Rango: -180 a 180
                                                    en <Link
                                                        href="https://www.latlong.net"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 underline hover:text-blue-600"
                                                    >
                                                        latlong.net
                                                    </Link>
                                                </span>
                                            </p>
                                            <ErrorMessage message={errors.lng?.message} />
                                        </div>
                                    </div>
                                </TooltipProvider>
                            </>
                        )}

                        {/* STEP 2 - HORARIOS */}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                {DIAS_SEMANA.map((dia, index) => (
                                    <div
                                        key={dia}
                                        className="grid grid-cols-1 md:grid-cols-5 gap-4 border p-3 rounded"
                                    >
                                        <p className="font-medium col-span-1">{dia}</p>

                                        <div className="space-y-1">
                                            <Label className="text-xs">Apertura</Label>
                                            <Input
                                                type="time"
                                                {...register(`horarios.${index}.apertura` as const)}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-xs">Cierre</Label>
                                            <Input
                                                type="time"
                                                {...register(`horarios.${index}.cierre` as const)}
                                            />
                                        </div>

                                        <Controller
                                            name={`horarios.${index}.cerrado`}
                                            control={control}
                                            defaultValue={false}
                                            render={({ field }) => (
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                    <Label className="text-xs">Cerrado</Label>
                                                </div>
                                            )}
                                        />

                                        <div className="col-span-1 md:col-span-2 space-y-1">
                                            <Label className="text-xs">Apertura especial (opcional)</Label>
                                            <Input
                                                type="time"
                                                {...register(`horarios.${index}.aperturaEspecial` as const)}
                                            />
                                        </div>

                                        <div className="col-span-1 md:col-span-2 space-y-1">
                                            <Label className="text-xs">Cierre especial (opcional)</Label>
                                            <Input
                                                type="time"
                                                {...register(`horarios.${index}.cierreEspecial` as const)}
                                            />
                                        </div>
                                    </div>
                                ))}

                                <ErrorMessage message={errors.horarios?.message} />
                            </div>
                        )}

                        {/* STEP 3 */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>NIT</Label>
                                        <Input {...register("configuracion.NIT")} placeholder="001-123456-7890" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>RUC</Label>
                                        <Input {...register("configuracion.RUC")} placeholder="J1230001234567" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Moneda *</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            setValue("configuracion.moneda", value, { shouldValidate: true })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona moneda" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Córdoba">Córdoba</SelectItem>
                                            <SelectItem value="USD">Dólar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <ErrorMessage message={errors.configuracion?.moneda?.message} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>WhatsApp</Label>
                                        <Input {...register("configuracion.whatsapp")} placeholder="+505 88888888" />
                                    </div>
                                </div>

                                <div className="p-4 border rounded space-y-3">
                                    <Label className="font-semibold">Permisos de vendedores</Label>

                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" {...register("configuracion.permisosTienda.vendedoresPuedenCrearProductos")} />
                                        Crear productos
                                    </label>

                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" {...register("configuracion.permisosTienda.vendedoresPuedenModificarPrecios")} />
                                        Modificar precios
                                    </label>

                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" {...register("configuracion.permisosTienda.vendedoresPuedenVerReportes")} />
                                        Ver reportes
                                    </label>

                                    <div className="space-y-2">
                                        <Label>Máx. vendedores *</Label>
                                        <Input
                                            type="number"
                                            min={1}
                                            {...register("configuracion.permisosTienda.maxVendedores", {
                                                valueAsNumber: true,
                                            })}
                                        />
                                        <ErrorMessage message={errors.configuracion?.permisosTienda?.maxVendedores?.message} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* NAVIGATION */}
                <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" disabled={currentStep === 1} onClick={handlePrevious}>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                    </Button>

                    {currentStep < 3 ? (
                        <Button
                            type="button"
                            onClick={(e) => handleNext(e)}
                        >
                            Siguiente
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    ) : (
                        <Button type="submit" disabled={cargando}>
                            {cargando ? (
                                <>
                                    Enviando...
                                    <Loader size={20} className="animate-spin ml-2" />
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4 mr-1" />
                                    Crear Tienda
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
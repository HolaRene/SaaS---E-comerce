"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { regions, storeTemplates } from "@/lib/data-store"

// Zod validation schema
const storeSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    region: z.string().min(1, "Selecciona una región"),
    address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
    phone: z.string().regex(/^\+?[\d\s-()]+$/, "Formato de teléfono inválido"),
    email: z.email("Email inválido"),
    hours: z.string().min(1, "Especifica el horario"),
    categories: z.string().min(1, "Selecciona al menos una categoría"),
    manager: z.string().min(1, "Selecciona un administrador"),
    template: z.string().min(1, "Selecciona una plantilla"),
})

type StoreFormData = z.infer<typeof storeSchema>

const steps = [
    { id: 1, title: "Información Básica", description: "Datos generales de la tienda" },
    { id: 2, title: "Configuración", description: "Horarios y categorías" },
    { id: 3, title: "Administrador", description: "Asignar responsable" },
    // { id: 4, title: "Plantilla", description: "Configuración base" },
]

const mockManagers = ["Ana García", "Carlos Ruiz", "María López", "Roberto Sánchez", "Laura Martínez"]

interface CreateStoreFormProps {
    onSubmit: (data: StoreFormData) => void
}

export default function CreateStoreForm({ onSubmit }: CreateStoreFormProps) {
    const [currentStep, setCurrentStep] = useState(1)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        trigger,
    } = useForm<StoreFormData>({
        resolver: zodResolver(storeSchema),
        mode: "onChange",
    })

    const formData = watch()

    // Validate current step before proceeding
    const validateStep = async () => {
        let fieldsToValidate: (keyof StoreFormData)[] = []

        switch (currentStep) {
            case 1:
                fieldsToValidate = ["name", "region", "address", "phone", "email"]
                break
            case 2:
                fieldsToValidate = ["hours", "categories"]
                break
            case 3:
                fieldsToValidate = ["manager"]
                break
            case 4:
                fieldsToValidate = ["template"]
                break
        }

        return await trigger(fieldsToValidate)
    }

    const handleNext = async () => {
        const isValid = await validateStep()
        if (isValid && currentStep < 4) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const onFormSubmit = (data: StoreFormData) => {
        onSubmit(data)
    }

    return (
        <div>
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${currentStep > step.id
                                        ? "bg-primary text-primary-foreground"
                                        : currentStep === step.id
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                                </div>
                                <div className="mt-2 text-center">
                                    <p className="text-sm font-medium">{step.title}</p>
                                    <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`h-1 flex-1 mx-2 transition-colors ${currentStep > step.id ? "bg-primary" : "bg-muted"}`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                        <CardDescription>{steps[currentStep - 1].description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre de la Tienda *</Label>
                                    <Input id="name" placeholder="Ej: Flagship Downtown" {...register("name")} />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="region">Región *</Label>
                                    <Select
                                        value={formData.region}
                                        onValueChange={(value) => setValue("region", value, { shouldValidate: true })}
                                    >
                                        <SelectTrigger id="region">
                                            <SelectValue placeholder="Selecciona una región" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {regions.map((region) => (
                                                <SelectItem key={region} value={region}>
                                                    {region}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.region && <p className="text-sm text-red-500">{errors.region.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Dirección *</Label>
                                    <Input id="address" placeholder="Ej: Av. Principal 123" {...register("address")} />
                                    {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Teléfono *</Label>
                                        <Input id="phone" placeholder="+1 234-567-8900" {...register("phone")} />
                                        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input id="email" type="email" placeholder="tienda@micomercio.com" {...register("email")} />
                                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 2: Configuration */}
                        {currentStep === 2 && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="hours">Horario de Atención *</Label>
                                    <Input id="hours" placeholder="Ej: 9:00 - 21:00" {...register("hours")} />
                                    {errors.hours && <p className="text-sm text-red-500">{errors.hours.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="categories">Categorías *</Label>
                                    <Input
                                        id="categories"
                                        placeholder="Ej: Electrónica, Ropa, Hogar (separadas por comas)"
                                        {...register("categories")}
                                    />
                                    {errors.categories && <p className="text-sm text-red-500">{errors.categories.message}</p>}
                                    <p className="text-xs text-muted-foreground">Ingresa las categorías separadas por comas</p>
                                </div>
                            </>
                        )}

                        {/* Step 3: Assign Manager */}
                        {currentStep === 3 && (
                            <div className="space-y-2">
                                <Label htmlFor="manager">Administrador de Tienda *</Label>
                                <Select
                                    value={formData.manager}
                                    onValueChange={(value) => setValue("manager", value, { shouldValidate: true })}
                                >
                                    <SelectTrigger id="manager">
                                        <SelectValue placeholder="Selecciona un administrador" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockManagers.map((manager) => (
                                            <SelectItem key={manager} value={manager}>
                                                {manager}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.manager && <p className="text-sm text-red-500">{errors.manager.message}</p>}
                                <p className="text-xs text-muted-foreground">
                                    El administrador será responsable de la gestión diaria de la tienda
                                </p>
                            </div>
                        )}

                        {/* Step 4: Template Selection */}
                        {currentStep === 4 && (
                            <div className="space-y-4">
                                <Label>Plantilla de Configuración *</Label>
                                <div className="grid grid-cols-1 gap-4">
                                    {storeTemplates.map((template) => (
                                        <Card
                                            key={template}
                                            className={`cursor-pointer transition-all hover:border-primary ${formData.template === template ? "border-primary border-2" : ""
                                                }`}
                                            onClick={() => setValue("template", template, { shouldValidate: true })}
                                        >
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-base">{template}</CardTitle>
                                                    {formData.template === template && <Badge>Seleccionado</Badge>}
                                                </div>
                                                <CardDescription>
                                                    {template === "Retail Standard" && "Configuración estándar para tiendas minoristas"}
                                                    {template === "Premium Store" && "Configuración premium con características avanzadas"}
                                                    {template === "Outlet Model" && "Configuración optimizada para outlets y liquidación"}
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                                {errors.template && <p className="text-sm text-red-500">{errors.template.message}</p>}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                    </Button>

                    {currentStep < 4 ? (
                        <Button type="button" onClick={handleNext}>
                            Siguiente
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    ) : (
                        <Button type="submit">
                            <Check className="h-4 w-4 mr-1" />
                            Crear Tienda
                        </Button>
                    )}
                </div>
            </form>
        </div>
    )
}

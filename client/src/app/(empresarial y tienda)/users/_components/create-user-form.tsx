"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { availableStores, permissionModules, type Permission, getPermissionLabel } from "@/lib/data-user"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// Esquemas de validación Zod para cada paso
const step1Schema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.email("Email inválido"),
    phone: z.string().min(9, "Teléfono inválido").optional(),
})

const step2Schema = z.object({
    stores: z.array(z.string()).min(1, "Debe seleccionar al menos una tienda"),
})

const step3Schema = z.object({
    role: z.enum(["super_admin", "regional_manager", "store_manager", "employee"]),
})

const step4Schema = z.object({
    permissions: z.record(z.array(z.string())),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>
type Step4Data = z.infer<typeof step4Schema>

type FormData = Step1Data & Step2Data & Step3Data & Step4Data

export function CreateUserForm() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<Partial<FormData>>({
        stores: [],
        permissions: {},
    })

    const totalSteps = 5

    // Paso 1: Información personal
    const Step1 = () => {
        const {
            register,
            handleSubmit,
            formState: { errors },
        } = useForm<Step1Data>({
            resolver: zodResolver(step1Schema),
            defaultValues: formData,
        })

        const onSubmit = (data: Step1Data) => {
            setFormData({ ...formData, ...data })
            setCurrentStep(2)
        }

        return (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input id="name" {...register("name")} placeholder="María González" />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <Label htmlFor="email">Email corporativo *</Label>
                    <Input id="email" type="email" {...register("email")} placeholder="maria.gonzalez@empresa.com" />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" {...register("phone")} placeholder="+34 612 345 678" />
                    {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
                </div>

                <div className="flex justify-end">
                    <Button type="submit">
                        Siguiente
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </form>
        )
    }

    // Paso 2: Asignación de tiendas
    const Step2 = () => {
        const [selectedStores, setSelectedStores] = useState<string[]>(formData.stores || [])

        const toggleStore = (store: string) => {
            setSelectedStores((prev) => (prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]))
        }

        const handleNext = () => {
            if (selectedStores.length === 0) {
                toast("Debe seleccionar al menos una tienda")
                return
            }
            setFormData({ ...formData, stores: selectedStores })
            setCurrentStep(3)
        }

        return (
            <div className="space-y-4">
                <div>
                    <Label>Seleccionar tiendas *</Label>
                    <p className="text-sm text-muted-foreground mb-3">El usuario tendrá acceso a las tiendas seleccionadas</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {availableStores.map((store) => (
                            <Card
                                key={store}
                                className={`cursor-pointer transition-colors ${selectedStores.includes(store) ? "border-primary bg-primary/5" : ""
                                    }`}
                                onClick={() => toggleStore(store)}
                            >
                                <CardContent className="flex items-center gap-3 p-4">
                                    <Checkbox checked={selectedStores.includes(store)} onCheckedChange={() => toggleStore(store)} />
                                    <span className="font-medium">{store}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Anterior
                    </Button>
                    <Button type="button" onClick={handleNext}>
                        Siguiente
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    }

    // Paso 3: Configuración de rol
    const Step3 = () => {
        const [selectedRole, setSelectedRole] = useState<"super_admin" | "regional_manager" | "store_manager" | "employee">(
            (formData.role as "super_admin" | "regional_manager" | "store_manager" | "employee") || "employee"
        )


        const roles = [
            { value: "super_admin", label: "Super Admin", description: "Acceso completo al sistema" },
            { value: "regional_manager", label: "Gerente Regional", description: "Gestión de múltiples tiendas" },
            { value: "store_manager", label: "Admin. Tienda", description: "Gestión de tiendas asignadas" },
            { value: "employee", label: "Empleado", description: "Acceso básico operativo" },
        ]

        const handleNext = () => {
            setFormData({ ...formData, role: selectedRole as "super_admin" | "regional_manager" | "store_manager" | "employee" })
            setCurrentStep(4)
        }

        return (
            <div className="space-y-4">
                <div>
                    <Label>Seleccionar rol *</Label>
                    <p className="text-sm text-muted-foreground mb-3">El rol determina los permisos base del usuario</p>
                    <div className="grid grid-cols-1 gap-3">
                        {roles.map((role) => (
                            <Card
                                key={role.value}
                                className={`cursor-pointer transition-colors ${selectedRole === role.value ? "border-primary bg-primary/5" : ""
                                    }`}
                                onClick={() => setSelectedRole(role.value as typeof selectedRole)}
                            >
                                <CardContent className="flex items-start gap-3 p-4">
                                    <Checkbox
                                        checked={selectedRole === role.value}
                                        onCheckedChange={() => setSelectedRole(role.value as typeof selectedRole)}

                                        className="mt-1"
                                    />
                                    <div>
                                        <div className="font-medium">{role.label}</div>
                                        <div className="text-sm text-muted-foreground">{role.description}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Anterior
                    </Button>
                    <Button type="button" onClick={handleNext}>
                        Siguiente
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    }




    // Paso 4: Permisos granulares
    const Step4 = () => {
        const [permissions, setPermissions] = useState<Record<string, Permission[]>>(formData.permissions || {})

        const togglePermission = (moduleId: string, permission: Permission) => {
            setPermissions((prev) => {
                const modulePerms = prev[moduleId] || []
                const hasPermission = modulePerms.includes(permission)

                return {
                    ...prev,
                    [moduleId]: hasPermission ? modulePerms.filter((p) => p !== permission) : [...modulePerms, permission],
                }
            })
        }

        const handleNext = () => {
            setFormData({ ...formData, permissions })
            setCurrentStep(5)
        }

        return (
            <div className="space-y-4">
                <div>
                    <Label>Permisos granulares</Label>
                    <p className="text-sm text-muted-foreground mb-3">Personaliza los permisos específicos para cada módulo</p>
                    <div className="space-y-4">
                        {permissionModules.map((module) => (
                            <Card key={module.id}>
                                <CardHeader>
                                    <CardTitle className="text-base">{module.name}</CardTitle>
                                    <CardDescription>{module.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {module.permissions.map((permission) => (
                                            <Button
                                                key={permission}
                                                type="button"
                                                variant={permissions[module.id]?.includes(permission) ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => togglePermission(module.id, permission)}
                                            >
                                                {permissions[module.id]?.includes(permission) && <Check className="mr-2 h-3 w-3" />}
                                                {getPermissionLabel(permission)}
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(3)}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Anterior
                    </Button>
                    <Button type="button" onClick={handleNext}>
                        Siguiente
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    }

    // Paso 5: Revisión y confirmación
    const Step5 = () => {
        const handleSubmit = () => {
            toast(`Usuario creado exitosamente, Se ha enviado una invitación a ${formData.email}`)
            // Reset form
            setFormData({ stores: [], permissions: {} })
            setCurrentStep(1)
        }

        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Información Personal</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Nombre:</span>
                            <span className="font-medium">{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">{formData.email}</span>
                        </div>
                        {formData.phone && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Teléfono:</span>
                                <span className="font-medium">{formData.phone}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tiendas Asignadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {formData.stores?.map((store) => (
                                <Badge key={store} variant="secondary">
                                    {store}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Rol y Permisos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Rol:</span>
                            <Badge>{formData.role}</Badge>
                        </div>
                        <div>
                            <span className="text-muted-foreground mb-2 block">Permisos personalizados:</span>
                            <div className="space-y-2">
                                {Object.entries(formData.permissions || {}).map(([moduleId, perms]) => {
                                    const modulo = permissionModules.find((m) => m.id === moduleId)
                                    if (!modulo || perms.length === 0) return null
                                    return (
                                        <div key={moduleId} className="flex justify-between items-center">
                                            <span className="text-sm">{modulo.name}:</span>
                                            <div className="flex gap-1">
                                                {perms.map((perm) => (
                                                    <Badge key={perm} variant="outline" className="text-xs">
                                                        {getPermissionLabel(perm as Permission)}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(4)}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Anterior
                    </Button>
                    <Button type="button" onClick={handleSubmit}>
                        <Check className="mr-2 h-4 w-4" />
                        Crear usuario y enviar invitación
                    </Button>
                </div>
            </div>
        )
    }

    const steps = [
        { number: 1, title: "Información Personal", component: Step1 },
        { number: 2, title: "Asignación de Tiendas", component: Step2 },
        { number: 3, title: "Configuración de Rol", component: Step3 },
        { number: 4, title: "Permisos Granulares", component: Step4 },
        { number: 5, title: "Revisión y Confirmación", component: Step5 },
    ]

    const CurrentStepComponent = steps[currentStep - 1].component

    return (
        <div className="space-y-3">
            {/* Progress indicator */}
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${currentStep >= step.number ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
                            </div>
                            <span className="text-xs mt-2 text-center max-w-[90px]">{step.title}</span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`h-[2px] flex-1 mx-2 ${currentStep > step.number ? "bg-primary" : "bg-muted"}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Current step content */}
            <Card>
                <CardHeader>
                    <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                    <CardDescription>
                        Paso {currentStep} de {totalSteps}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CurrentStepComponent />
                </CardContent>
            </Card>
        </div>
    )
}

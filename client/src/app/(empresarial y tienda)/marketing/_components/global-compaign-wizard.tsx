"use client"

import { useState, useTransition, useEffect } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createCampaign } from "../actions"
import type { CampaignFormState } from "@/lib/marketing-types"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

const initialState: CampaignFormState = {
    success: false,
    message: "",
}

export function GlobalCampaignWizard() {
    const [step, setStep] = useState(1)
    const [state, formAction] = useActionState(createCampaign, initialState)
    const [isPending, startTransition] = useTransition()


    useEffect(() => {
        if (state.success) {
            toast(state.message)
            setStep(1)
        } else if (state.message && !state.success) {
            toast(`Error ${state.message}`)
        }
    }, [state.success, state.message, toast])

    const handleSubmit = (formData: FormData) => {
        startTransition(() => {
            formAction(formData)
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Crear Campaña Global</CardTitle>
                <CardDescription>
                    Paso {step} de 3: {step === 1 ? "Información básica" : step === 2 ? "Presupuesto y fechas" : "Revisión"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre de la campaña</Label>
                                <Input id="name" name="name" placeholder="Ej: Black Friday 2024" required />
                                {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Tipo de campaña</Label>
                                <Select name="type" defaultValue="global">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="global">Global</SelectItem>
                                        <SelectItem value="group">Por grupo</SelectItem>
                                        <SelectItem value="store_specific">Tienda específica</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe los objetivos de la campaña..."
                                    rows={4}
                                />
                            </div>

                            <Button type="button" onClick={() => setStep(2)} className="w-full">
                                Siguiente
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="budget">Presupuesto total</Label>
                                <Input id="budget" name="budget" type="number" placeholder="50000" min="1000" step="1000" required />
                                {state.errors?.budget && <p className="text-sm text-destructive">{state.errors.budget[0]}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Fecha de inicio</Label>
                                    <Input id="startDate" name="startDate" type="date" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="endDate">Fecha de fin</Label>
                                    <Input id="endDate" name="endDate" type="date" required />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                                    Anterior
                                </Button>
                                <Button type="button" onClick={() => setStep(3)} className="flex-1">
                                    Siguiente
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="rounded-lg border p-4 space-y-2">
                                <p className="text-sm text-muted-foreground">Revisa la información antes de crear la campaña</p>
                            </div>

                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                                    Anterior
                                </Button>
                                <Button type="submit" disabled={isPending} className="flex-1">
                                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Crear campaña
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    )
}

"use client"

import { useActionState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { updateFiscalData } from "./action"
import { CompanyFiscalData } from "@/lib/configuration-types"
import { toast } from "sonner"

interface FiscalDataFormProps {
    data: CompanyFiscalData
}

export function FiscalDataForm({ data }: FiscalDataFormProps) {

    const [state, formAction, isPending] = useActionState(updateFiscalData, {
        success: false,
        message: "",
    })

    useEffect(() => {
        if (state.success) {
            toast(state.message)
        } else if (state.message) {
            toast(`Error ${state.message}`)
        }
    }, [state, toast])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Datos Fiscales</CardTitle>
                <CardDescription>Información legal y fiscal de la empresa</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="legalName">Razón Social</Label>
                            <Input id="legalName" name="legalName" defaultValue={data.legalName} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="taxId">RFC / Tax ID</Label>
                            <Input id="taxId" name="taxId" defaultValue={data.taxId} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="country">País</Label>
                            <Select name="country" defaultValue={data.country}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="México">México</SelectItem>
                                    <SelectItem value="Estados Unidos">Estados Unidos</SelectItem>
                                    <SelectItem value="España">España</SelectItem>
                                    <SelectItem value="Argentina">Argentina</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="taxRegime">Régimen Fiscal</Label>
                            <Select name="taxRegime" defaultValue={data.fiscalYear.taxRegime}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="General de Ley Personas Morales">General de Ley Personas Morales</SelectItem>
                                    <SelectItem value="Régimen Simplificado de Confianza">Régimen Simplificado de Confianza</SelectItem>
                                    <SelectItem value="Actividad Empresarial">Actividad Empresarial</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Dirección Fiscal</Label>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input name="street" placeholder="Calle" defaultValue={data.address.street} />
                            <Input name="number" placeholder="Número" defaultValue={data.address.number} />
                            <Input name="city" placeholder="Ciudad" defaultValue={data.address.city} />
                            <Input name="state" placeholder="Estado" defaultValue={data.address.state} />
                            <Input name="postalCode" placeholder="Código Postal" defaultValue={data.address.postalCode} />
                        </div>
                    </div>

                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

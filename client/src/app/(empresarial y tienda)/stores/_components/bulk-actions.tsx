"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CheckSquare, Square, Edit, RefreshCw } from "lucide-react"
import { regions, Store, storeTemplates } from "@/lib/data-store"

interface BulkActionsProps {
    stores: Store[]
    onBulkUpdate: (storeIds: number[], updates: Partial<Store>) => void
}

export function BulkActions({ stores, onBulkUpdate }: BulkActionsProps) {
    const [selectedStores, setSelectedStores] = useState<number[]>([])
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [updateProgress, setUpdateProgress] = useState(0)

    // Update form state
    const [updateRegion, setUpdateRegion] = useState<string>("defaultRegion")
    const [updateHours, setUpdateHours] = useState<string>("")
    const [updateTemplate, setUpdateTemplate] = useState<string>("")

    const toggleStore = (storeId: number) => {
        setSelectedStores((prev) => (prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId]))
    }

    const toggleAll = () => {
        if (selectedStores.length === stores.length) {
            setSelectedStores([])
        } else {
            setSelectedStores(stores.map((s) => s.id))
        }
    }

    const handleBulkUpdate = () => {
        if (selectedStores.length === 0) return
        setUpdateDialogOpen(true)
    }

    const confirmUpdate = async () => {
        setIsUpdating(true)
        setUpdateProgress(0)

        // Build updates object (only include fields that were set)
        const updates: Partial<Store> = {}
        if (updateRegion) updates.region = updateRegion
        if (updateHours) updates.hours = updateHours

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
            setUpdateProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(progressInterval)
                    return 90
                }
                return prev + 10
            })
        }, 100)

        // Simulate async update
        setTimeout(() => {
            clearInterval(progressInterval)
            setUpdateProgress(100)
            onBulkUpdate(selectedStores, updates)

            setTimeout(() => {
                setIsUpdating(false)
                setUpdateProgress(0)
                setUpdateDialogOpen(false)
                setSelectedStores([])
                setUpdateRegion("defaultRegion")
                setUpdateHours("")
                setUpdateTemplate("")
            }, 500)
        }, 1000)
    }

    return (
        <div className="space-y-6">
            {/* Selection Controls */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Selección de Tiendas</CardTitle>
                            <CardDescription>
                                {selectedStores.length} de {stores.length} tiendas seleccionadas
                            </CardDescription>
                        </div>
                        <div className="flex gap-2 md:flex-row flex-col">
                            <Button variant="outline" size="sm" onClick={toggleAll}>
                                {selectedStores.length === stores.length ? (
                                    <>
                                        <Square className="h-4 w-4 mr-1" />
                                        Deseleccionar Todo
                                    </>
                                ) : (
                                    <>
                                        <CheckSquare className="h-4 w-4 mr-1" />
                                        Seleccionar Todo
                                    </>
                                )}
                            </Button>
                            <Button onClick={handleBulkUpdate} disabled={selectedStores.length === 0}>
                                <Edit className="h-4 w-4 mr-1" />
                                Actualizar Seleccionadas
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stores.map((store) => (
                            <Card
                                key={store.id}
                                className={`cursor-pointer transition-all ${selectedStores.includes(store.id) ? "border-primary border-2 bg-primary/5" : "hover:border-primary/50"
                                    }`}
                                onClick={() => toggleStore(store.id)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start gap-3">
                                        <Checkbox
                                            checked={selectedStores.includes(store.id)}
                                            onCheckedChange={() => toggleStore(store.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="flex-1">
                                            <CardTitle className="text-sm font-medium">{store.name}</CardTitle>
                                            <div className="flex gap-2 mt-2">
                                                <Badge variant="secondary" className="text-xs">
                                                    {store.region}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {store.employees} empleados
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Template Selector */}
            <Card>
                <CardHeader>
                    <CardTitle>Aplicar Plantilla</CardTitle>
                    <CardDescription>Aplica una configuración predefinida a las tiendas seleccionadas</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {storeTemplates.map((template) => (
                            <Card
                                key={template}
                                className={`cursor-pointer transition-all hover:border-primary ${updateTemplate === template ? "border-primary border-2" : ""
                                    }`}
                                onClick={() => setUpdateTemplate(template)}
                            >
                                <CardHeader>
                                    <CardTitle className="text-sm">{template}</CardTitle>
                                    {updateTemplate === template && <Badge className="w-fit">Seleccionado</Badge>}
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Batch Update Dialog */}
            <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Actualización Masiva</DialogTitle>
                        <DialogDescription>Actualizar {selectedStores.length} tienda(s) seleccionada(s)</DialogDescription>
                    </DialogHeader>

                    {!isUpdating ? (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="bulk-region">Cambiar Región (opcional)</Label>
                                <Select value={updateRegion} onValueChange={setUpdateRegion}>
                                    <SelectTrigger id="bulk-region">
                                        <SelectValue placeholder="Mantener región actual" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="defaultRegion">Mantener región actual</SelectItem>
                                        {regions.map((region) => (
                                            <SelectItem key={region} value={region}>
                                                {region}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bulk-hours">Cambiar Horario (opcional)</Label>
                                <Input
                                    id="bulk-hours"
                                    placeholder="Ej: 9:00 - 21:00"
                                    value={updateHours}
                                    onChange={(e) => setUpdateHours(e.target.value)}
                                />
                            </div>

                            {updateTemplate && (
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm font-medium">Plantilla seleccionada:</p>
                                    <p className="text-sm text-muted-foreground">{updateTemplate}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4 py-6">
                            <div className="flex items-center justify-center">
                                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Actualizando tiendas...</span>
                                    <span>{updateProgress}%</span>
                                </div>
                                <Progress value={updateProgress} />
                            </div>
                        </div>
                    )}

                    {!isUpdating && (
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={confirmUpdate}>Confirmar Actualización</Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

import { createStoreGroup } from "../actions"
import type { StoreGroup } from "@/lib/marketing-types"
import { Users, Plus } from "lucide-react"
import { toast } from "sonner"

interface StoreGroupManagerProps {
    groups: StoreGroup[]
    availableStores: Array<{ id: string; name: string }>
}

export function StoreGroupManager({ groups, availableStores }: StoreGroupManagerProps) {
    const [isCreating, setIsCreating] = useState(false)
    const [groupName, setGroupName] = useState("")
    const [groupType, setGroupType] = useState<StoreGroup["type"]>("custom")
    const [selectedStores, setSelectedStores] = useState<string[]>([])
    const [isPending, startTransition] = useTransition()

    const handleCreateGroup = () => {
        if (!groupName || selectedStores.length === 0) {
            toast("Completa todos los campos requeridos")
            return
        }

        startTransition(async () => {
            const result = await createStoreGroup(groupName, groupType, selectedStores)

            if (result.success) {
                toast(result.message)
                setIsCreating(false)
                setGroupName("")
                setSelectedStores([])
            } else {
                toast(`Error ${result.message}`)
            }
        })
    }

    const toggleStore = (storeId: string) => {
        setSelectedStores((prev) => (prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId]))
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Grupos de Tiendas</h3>
                <Button onClick={() => setIsCreating(!isCreating)} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Grupo
                </Button>
            </div>

            {isCreating && (
                <Card>
                    <CardHeader>
                        <CardTitle>Crear Nuevo Grupo</CardTitle>
                        <CardDescription>Define un grupo de tiendas para campañas segmentadas</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="groupName">Nombre del grupo</Label>
                            <Input
                                id="groupName"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder="Ej: Tiendas Premium"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="groupType">Tipo de grupo</Label>
                            <Select value={groupType} onValueChange={(value) => setGroupType(value as StoreGroup["type"])}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="custom">Personalizado</SelectItem>
                                    <SelectItem value="region">Por región</SelectItem>
                                    <SelectItem value="performance">Por performance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Seleccionar tiendas ({selectedStores.length})</Label>
                            <div className="border rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                                {availableStores.map((store) => (
                                    <div key={store.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={store.id}
                                            checked={selectedStores.includes(store.id)}
                                            onCheckedChange={() => toggleStore(store.id)}
                                        />
                                        <label
                                            htmlFor={store.id}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {store.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsCreating(false)} className="flex-1">
                                Cancelar
                            </Button>
                            <Button onClick={handleCreateGroup} disabled={isPending} className="flex-1">
                                Crear Grupo
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groups.map((group) => (
                    <Card key={group.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-base">{group.name}</CardTitle>
                                    <CardDescription className="line-clamp-2">{group.description || "Sin descripción"}</CardDescription>
                                </div>
                                <Badge variant="outline">
                                    {group.type === "custom" ? "Personalizado" : group.type === "region" ? "Región" : "Performance"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{group.stores.length} tiendas</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

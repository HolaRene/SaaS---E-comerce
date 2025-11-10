"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { MapPin, Users, DollarSign, Calendar, Edit, Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { statusConfig, Store } from "@/lib/data-store"

interface StoreGridProps {
    stores: Store[]
    onToggleStatus: (id: number, currentStatus: Store["status"]) => void
    onEdit: (store: Store) => void
    onDelete: (id: number) => void
}

export function StoreGrid({ stores, onToggleStatus, onEdit, onDelete }: StoreGridProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [storeToDelete, setStoreToDelete] = useState<number | null>(null)

    const handleDeleteClick = (id: number) => {
        setStoreToDelete(id)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (storeToDelete) {
            onDelete(storeToDelete)
            setDeleteDialogOpen(false)
            setStoreToDelete(null)
        }
    }

    if (stores.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron tiendas con los filtros aplicados</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map((store) => (
                    <Card key={store.id} className="hover:shadow-lg transition-shadow duration-200 border-2">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-lg font-semibold mb-2">{store.name}</CardTitle>
                                    <Badge variant="secondary" className={`${statusConfig[store.status].color} text-white`}>
                                        {statusConfig[store.status].label}
                                    </Badge>
                                </div>
                                <Switch
                                    checked={store.status === "active"}
                                    onCheckedChange={() => onToggleStatus(store.id, store.status)}
                                    aria-label={`Toggle ${store.name} status`}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{store.region}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-medium text-foreground">${store.sales.toLocaleString()}</span>
                                <span>en ventas</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{store.employees} empleados</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Actualizado: {store.lastUpdated}</span>
                            </div>

                            <div className="flex gap-2 pt-3 border-t">
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onEdit(store)}>
                                    <Edit className="h-4 w-4 mr-1" />
                                    Editar
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteClick(store.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. La tienda será eliminada permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

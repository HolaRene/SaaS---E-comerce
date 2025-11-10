"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Mail, UserX, UserCheck, Trash2 } from "lucide-react"
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
import { toast } from "sonner"

interface BulkActionsProps {
    selectedCount: number
    onClearSelection: () => void
}

export function BulkActions({ selectedCount, onClearSelection }: BulkActionsProps) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [actionType, setActionType] = useState<"activate" | "deactivate" | "delete" | "resend">("activate")

    const handleAction = (type: typeof actionType) => {
        setActionType(type)
        setShowConfirmDialog(true)
    }

    const confirmAction = () => {
        const messages = {
            activate: `${selectedCount} usuario(s) activado(s) correctamente`,
            deactivate: `${selectedCount} usuario(s) desactivado(s) correctamente`,
            delete: `${selectedCount} usuario(s) eliminado(s) correctamente`,
            resend: `Invitaciones reenviadas a ${selectedCount} usuario(s)`,
        }

        toast(`Acción completada ${messages[actionType]}`)

        setShowConfirmDialog(false)
        onClearSelection()
    }

    if (selectedCount === 0) return null

    return (
        <>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium">{selectedCount} usuario(s) seleccionado(s)</span>
                <div className="flex gap-2 ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                Acciones en lote
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleAction("activate")}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activar usuarios
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("deactivate")}>
                                <UserX className="mr-2 h-4 w-4" />
                                Desactivar usuarios
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("resend")}>
                                <Mail className="mr-2 h-4 w-4" />
                                Reenviar invitaciones
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("delete")} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar usuarios
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="ghost" size="sm" onClick={onClearSelection}>
                        Cancelar
                    </Button>
                </div>
            </div>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Confirmar acción?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción afectará a {selectedCount} usuario(s) seleccionado(s).
                            {actionType === "delete" && " Esta acción no se puede deshacer."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmAction}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

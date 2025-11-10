"use client"

import { useState } from "react"
import { type Role, roles as initialRoles, roleHistory } from "@/lib/data-user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Plus, Copy, Edit, Trash2, History } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

export function RolesGrid() {
    const [roles, setRoles] = useState(initialRoles)
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showHistoryDialog, setShowHistoryDialog] = useState(false)


    const handleDuplicateRole = (role: Role) => {
        toast(`Se ha creado una copia de "${role.name}"`)
    }

    const handleDeleteRole = (roleId: string) => {
        if (roles.find((r) => r.id === roleId)?.type === "predefined") {
            toast("No se pueden eliminar roles predefinidos")
            return
        }

        toast("El rol personalizado ha sido eliminado")
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Roles del Sistema</h3>
                    <p className="text-sm text-muted-foreground">Gestiona roles predefinidos y personalizados</p>
                </div>
                <div className="flex md:flex-row flex-col gap-2">
                    <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <History className="mr-2 h-4 w-4" />
                                Historial
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Historial de Cambios</DialogTitle>
                                <DialogDescription>Registro de modificaciones en roles y permisos</DialogDescription>
                            </DialogHeader>
                            <div className="max-h-[400px] overflow-y-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Rol</TableHead>
                                            <TableHead>Acción</TableHead>
                                            <TableHead>Usuario</TableHead>
                                            <TableHead>Cambios</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {roleHistory.map((entry) => {
                                            const role = roles.find((r) => r.id === entry.roleId)
                                            return (
                                                <TableRow key={entry.id}>
                                                    <TableCell className="text-sm">
                                                        {new Date(entry.timestamp).toLocaleDateString("es-ES")}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{role?.name}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                entry.action === "created"
                                                                    ? "default"
                                                                    : entry.action === "updated"
                                                                        ? "secondary"
                                                                        : "destructive"
                                                            }
                                                        >
                                                            {entry.action}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-sm">{entry.userName}</TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">{entry.changes}</TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Crear Rol
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Crear Rol Personalizado</DialogTitle>
                                <DialogDescription>Define un nuevo rol con permisos específicos</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="role-name">Nombre del rol</Label>
                                    <Input id="role-name" placeholder="Ej: Analista de Ventas" />
                                </div>
                                <div>
                                    <Label htmlFor="role-description">Descripción</Label>
                                    <Textarea id="role-description" placeholder="Describe las responsabilidades de este rol" />
                                </div>
                                <Button
                                    onClick={() => {
                                        toast("El nuevo rol ha sido creado exitosamente")
                                        setShowCreateDialog(false)
                                    }}
                                >
                                    Crear Rol
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => (
                    <Card key={role.id} className="relative">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-base">{role.name}</CardTitle>
                                    <Badge variant={role.type === "predefined" ? "default" : "secondary"}>
                                        {role.type === "predefined" ? "Predefinido" : "Personalizado"}
                                    </Badge>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDuplicateRole(role)}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    {role.type === "custom" && (
                                        <>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive"
                                                onClick={() => handleDeleteRole(role.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <CardDescription>{role.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{role.usersCount} usuario(s)</span>
                            </div>

                            <div>
                                <div className="text-sm font-medium mb-2">Permisos:</div>
                                <div className="space-y-1">
                                    {Object.entries(role.permissions).map(([module, perms]) => {
                                        if (perms.length === 0) return null
                                        return (
                                            <div key={module} className="text-xs text-muted-foreground">
                                                <span className="font-medium capitalize">{module}:</span> {perms.join(", ")}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {role.createdBy && (
                                <div className="text-xs text-muted-foreground pt-2 border-t">Creado por {role.createdBy}</div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

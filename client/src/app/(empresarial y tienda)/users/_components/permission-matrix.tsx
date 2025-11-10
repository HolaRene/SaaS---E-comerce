"use client"

import { useState } from "react"
import { permissionModules, type Permission, getPermissionLabel, roles } from "@/lib/data-user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { toast } from "sonner"

export function PermissionMatrix() {
    const [selectedRole, setSelectedRole] = useState(roles[0].id)
    const [permissions, setPermissions] = useState(roles.find((r) => r.id === selectedRole)?.permissions || {})


    const handleRoleChange = (roleId: string) => {
        setSelectedRole(roleId)
        const role = roles.find((r) => r.id === roleId)
        setPermissions(role?.permissions || {})
    }

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

    const handleSave = () => {
        toast(`Los permisos del rol han sido guardados correctamente`)
    }

    const selectedRoleData = roles.find((r) => r.id === selectedRole)

    return (
        <div className="space-y-6">
            <div className="flex items-end gap-4">
                <div className="flex-1 space-y-1">
                    <Label htmlFor="role-select">Seleccionar rol para editar</Label>
                    <Select value={selectedRole} onValueChange={handleRoleChange}>
                        <SelectTrigger id="role-select">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                </Button>
            </div>

            {selectedRoleData && (
                <Card>
                    <CardHeader>
                        <CardTitle>Matriz de Permisos: {selectedRoleData.name}</CardTitle>
                        <CardDescription>{selectedRoleData.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {permissionModules.map((module) => (
                                <div key={module.id} className="space-y-3">
                                    <div>
                                        <h4 className="font-medium">{module.name}</h4>
                                        <p className="text-sm text-muted-foreground">{module.description}</p>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-4">
                                        {module.permissions.map((permission) => {
                                            const isChecked = permissions[module.id]?.includes(permission) || false
                                            return (
                                                <div key={permission} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`${module.id}-${permission}`}
                                                        checked={isChecked}
                                                        onCheckedChange={() => togglePermission(module.id, permission)}
                                                    />
                                                    <label
                                                        htmlFor={`${module.id}-${permission}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                    >
                                                        {getPermissionLabel(permission)}
                                                    </label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

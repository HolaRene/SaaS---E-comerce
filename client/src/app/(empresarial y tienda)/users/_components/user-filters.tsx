"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { UserRole, UserStatus } from "@/lib/data-user"

interface UserFiltersProps {
    selectedRole: UserRole | "all"
    selectedStore: string
    selectedStatus: UserStatus | "all"
    onRoleChange: (role: UserRole | "all") => void
    onStoreChange: (store: string) => void
    onStatusChange: (status: UserStatus | "all") => void
    onClearFilters: () => void
    stores: string[]
}

export function UserFilters({
    selectedRole,
    selectedStore,
    selectedStatus,
    onRoleChange,
    onStoreChange,
    onStatusChange,
    onClearFilters,
    stores,
}: UserFiltersProps) {
    const hasActiveFilters = selectedRole !== "all" || selectedStore !== "all" || selectedStatus !== "all"

    return (
        <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
                <Label htmlFor="role-filter">Rol</Label>
                <Select value={selectedRole} onValueChange={onRoleChange}>
                    <SelectTrigger id="role-filter">
                        <SelectValue placeholder="Todos los roles" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los roles</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="regional_manager">Gerente Regional</SelectItem>
                        <SelectItem value="store_manager">Admin. Tienda</SelectItem>
                        <SelectItem value="employee">Empleado</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
                <Label htmlFor="store-filter">Tienda</Label>
                <Select value={selectedStore} onValueChange={onStoreChange}>
                    <SelectTrigger id="store-filter">
                        <SelectValue placeholder="Todas las tiendas" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las tiendas</SelectItem>
                        {stores.map((store) => (
                            <SelectItem key={store} value={store}>
                                {store}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
                <Label htmlFor="status-filter">Estado</Label>
                <Select value={selectedStatus} onValueChange={onStatusChange}>
                    <SelectTrigger id="status-filter">
                        <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="suspended">Suspendido</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {hasActiveFilters && (
                <Button variant="outline" onClick={onClearFilters} className="gap-2 bg-transparent">
                    <X className="h-4 w-4" />
                    Limpiar filtros
                </Button>
            )}
        </div>
    )
}

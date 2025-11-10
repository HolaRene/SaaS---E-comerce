"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserSearch } from "./user-search"
import { UserFilters } from "./user-filters"
import { BulkActions } from "./buk-actions"
import { useCallback, useState } from "react"
import { UserTableSkeleton } from "./user-table-squeleton"
import { UserTable } from "./user-table"
import { availableStores, UserRole, users, UserStatus } from "@/lib/data-user"

const ListaUser = () => {
    const [isLoading, setIsLoading] = useState(false)
    // Estados para filtros y búsqueda
    const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all")
    const [selectedStore, setSelectedStore] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState<UserStatus | "all">("all")
    const [selectedUsers, setSelectedUsers] = useState<number[]>([])


    const [searchQuery, setSearchQuery] = useState("")

    // Filtrado de usuarios con optimización de rendimiento
    const filteredUsers = users.filter((user) => {
        // Filtro por rol
        if (selectedRole !== "all" && user.role !== selectedRole) return false

        // Filtro por tienda
        if (selectedStore !== "all" && !user.stores.includes(selectedStore)) return false

        // Filtro por estado
        if (selectedStatus !== "all" && user.status !== selectedStatus) return false

        return true
    })

    // Manejo de selección de usuarios
    const handleSelectUser = (userId: number) => {
        setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
    }

    const handleSelectAll = (selected: boolean) => {
        setSelectedUsers(selected ? filteredUsers.map((u) => u.id) : [])
    }

    const handleClearSelection = () => {
        setSelectedUsers([])
    }

    // Limpiar filtros
    const handleClearFilters = () => {
        setSelectedRole("all")
        setSelectedStore("all")
        setSelectedStatus("all")
    }
    // Búsqueda con debounce (manejado en el componente UserSearch)
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query)
    }, [])

    return (
        <div className=''>
            <Card>
                <CardHeader>
                    <CardTitle>Usuarios del Sistema</CardTitle>
                    <CardDescription>Vista consolidada de todos los usuarios con filtros avanzados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Búsqueda */}
                    <UserSearch onSearch={handleSearch} />

                    {/* Filtros */}
                    <UserFilters
                        selectedRole={selectedRole}
                        selectedStore={selectedStore}
                        selectedStatus={selectedStatus}
                        onRoleChange={setSelectedRole}
                        onStoreChange={setSelectedStore}
                        onStatusChange={setSelectedStatus}
                        onClearFilters={handleClearFilters}
                        stores={availableStores}
                    />

                    {/* Acciones en lote */}
                    <BulkActions selectedCount={selectedUsers.length} onClearSelection={handleClearSelection} />

                    {/* Tabla de usuarios con skeleton loading */}
                    {isLoading ? (
                        <UserTableSkeleton />
                    ) : (
                        <>
                            <div className="text-sm text-muted-foreground">
                                Mostrando {filteredUsers.length} de {users.length} usuarios
                            </div>
                            <UserTable
                                users={filteredUsers}
                                selectedUsers={selectedUsers}
                                onSelectUser={handleSelectUser}
                                onSelectAll={handleSelectAll}
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default ListaUser
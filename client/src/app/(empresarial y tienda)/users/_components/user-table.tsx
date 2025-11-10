"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowUpDown, Mail, UserX, Edit } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getLastAccessLabel, getRoleLabel, getStatusColor, getStatusLabel, User } from "@/lib/data-user"

interface UserTableProps {
    users: User[]
    selectedUsers: number[]
    onSelectUser: (userId: number) => void
    onSelectAll: (selected: boolean) => void
}

type SortField = "name" | "email" | "role" | "status" | "lastAccess"
type SortDirection = "asc" | "desc"

export function UserTable({ users, selectedUsers, onSelectUser, onSelectAll }: UserTableProps) {
    const [sortField, setSortField] = useState<SortField>("name")
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

    // Función para ordenar usuarios
    const sortedUsers = [...users].sort((a, b) => {
        let aValue: string | number = a[sortField]
        let bValue: string | number = b[sortField]

        if (sortField === "lastAccess") {
            aValue = new Date(a.lastAccess).getTime()
            bValue = new Date(b.lastAccess).getTime()
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
    })

    // Toggle de ordenamiento
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const allSelected = users.length > 0 && selectedUsers.length === users.length

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">
                            <Checkbox checked={allSelected} onCheckedChange={onSelectAll} aria-label="Seleccionar todos" />
                        </TableHead>
                        <TableHead>
                            <Button
                                variant="ghost"
                                onClick={() => handleSort("name")}
                                className="flex items-center gap-1 hover:bg-transparent p-0"
                            >
                                Usuario
                                <ArrowUpDown className="h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button
                                variant="ghost"
                                onClick={() => handleSort("role")}
                                className="flex items-center gap-1 hover:bg-transparent p-0"
                            >
                                Rol
                                <ArrowUpDown className="h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>Tiendas</TableHead>
                        <TableHead>
                            <Button
                                variant="ghost"
                                onClick={() => handleSort("status")}
                                className="flex items-center gap-1 hover:bg-transparent p-0"
                            >
                                Estado
                                <ArrowUpDown className="h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button
                                variant="ghost"
                                onClick={() => handleSort("lastAccess")}
                                className="flex items-center gap-1 hover:bg-transparent p-0"
                            >
                                Último Acceso
                                <ArrowUpDown className="h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead className="w-12"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedUsers.includes(user.id)}
                                    onCheckedChange={() => onSelectUser(user.id)}
                                    aria-label={`Seleccionar ${user.name}`}
                                />
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                        <AvatarFallback>
                                            {user.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{getRoleLabel(user.role)}</Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {user.stores.slice(0, 2).map((store) => (
                                        <Badge key={store} variant="secondary" className="text-xs">
                                            {store}
                                        </Badge>
                                    ))}
                                    {user.stores.length > 2 && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Badge variant="secondary" className="text-xs">
                                                        +{user.stores.length - 2}
                                                    </Badge>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <div className="space-y-1">
                                                        {user.stores.slice(2).map((store) => (
                                                            <div key={store}>{store}</div>
                                                        ))}
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${getStatusColor(user.status)}`} />
                                    <span className="text-sm">{getStatusLabel(user.status)}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <span className="text-sm text-muted-foreground">{getLastAccessLabel(user.lastAccess)}</span>
                                        </TooltipTrigger>
                                        <TooltipContent>{new Date(user.lastAccess).toLocaleString("es-ES")}</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Mail className="mr-2 h-4 w-4" />
                                            Reenviar invitación
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            <UserX className="mr-2 h-4 w-4" />
                                            Desactivar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

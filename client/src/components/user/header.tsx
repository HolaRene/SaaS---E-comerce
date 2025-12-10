"use client"

import { useSidebar } from "./sidebar-provider"
import { Bell, Search, Menu, ShoppingCart, User2, BadgePlus, Cog, LogOut, Store, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Badge } from "../ui/badge"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useClerk, useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useRouter } from "next/navigation"

export function Header() {
    const { toggle } = useSidebar()
    const { signOut } = useClerk()

    const ruta = useRouter()

    // Obtener usuario de Clerk
    const { user: clerkUser, isLoaded } = useUser();

    // Obtener usuario Convex
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    );

    const cartCount = useQuery(
        api.carrito.countCarritoItems,
        usuario?._id ? { usuarioId: usuario._id } : 'skip'
    ) ?? 0
    const notificacionesCount = useQuery(api.notificaciones.getUnreadCount)


    // Extraer ID de usuario Convex
    const idUser = usuario?._id;

    // Obtener tiendas del usuario
    const tiendaUser = useQuery(
        api.tiendas.getTiendasByPropietario,
        idUser ? { propietarioId: idUser } : "skip"
    );

    // Mientras carga o no hay usuario
    if (!isLoaded || !clerkUser) {
        return null; // o un skeleton
    }

    // Datos finales para mostrar
    const nombreCompleto = usuario
        ? `${usuario.nombre} ${usuario.apellido}`
        : clerkUser.fullName || "Usuario";

    const imagenUrl = usuario?.imgUrl
        || clerkUser.imageUrl
        || "/default-avatar.png";





    return (
        <header className="sticky top-0 z-40 border-b bg-background w-full overflow-hidden">
            <div className="flex h-14 items-center px-4 gap-4 overflow-x-auto no-scrollbar">
                {/* Botón para abrir/cerrar sidebar */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggle}
                    className="flex-shrink-0"
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Abrir o cerrar sidebar</span>
                </Button>

                {/* Buscador */}
                <div className="flex-1 min-w-[150px]">
                    <form className="w-full">
                        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar..."
                                className="w-full pl-8"
                            />
                        </div>
                    </form>
                </div>

                {/* Botones de acciones */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Notificaciones */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                    >
                        <Link href={'/user/notificacion'}>
                            <Bell className="h-5 w-5" />
                            {notificacionesCount > 0 && (
                                <Badge
                                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                                    variant="destructive"
                                >
                                    {notificacionesCount}
                                </Badge>
                            )}
                        </Link>
                    </Button>

                    {/* Carrito */}
                    <Link href={'/user/carrito'}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                                    {cartCount}
                                </Badge>
                            )}
                        </Button>
                    </Link>
                    {/* Usuario */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={imagenUrl} alt={nombreCompleto} />
                                    <AvatarFallback>
                                        {nombreCompleto.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{nombreCompleto}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {clerkUser.primaryEmailAddress?.emailAddress}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {tiendaUser?.map((t) => (
                                <DropdownMenuItem key={t._id}>
                                    <Link href={`/mi-tienda/${t._id}`} className="flex gap-2">
                                        <Store />
                                        {t.nombre}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href="/user/dashboard" className="flex gap-2">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Mi Tablero</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <BadgePlus className="mr-2 h-4 w-4" />
                                <Link href="/user/crear-tienda">Crear una tienda</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Cog className="mr-2 h-4 w-4" />
                                Configuración
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Button onClick={() => signOut(() => ruta.push('/'))}> <LogOut className="mr-2 h-4 w-4" />
                                    Cerrar sesión</Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

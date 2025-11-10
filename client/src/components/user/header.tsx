"use client"

import { useSidebar } from "./sidebar-provider"
import { Bell, Search, User, Menu, ShoppingCart, User2, BadgePlus, Cog, LogOut } from "lucide-react"
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

export function Header() {
    const [activeTab, setActiveTab] = useState("dashboard")
    const [cartCount] = useState(5)
    const [notificationCount] = useState(3)
    const { toggle } = useSidebar()

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
                        onClick={() => setActiveTab("notifications")}
                    >
                        <Bell className="h-5 w-5" />
                        {notificationCount > 0 && (
                            <Badge
                                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                                variant="destructive"
                            >
                                {notificationCount}
                            </Badge>
                        )}
                    </Button>

                    {/* Carrito */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        onClick={() => setActiveTab("cart")}
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 && (
                            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                                {cartCount}
                            </Badge>
                        )}
                    </Button>

                    {/* Usuario */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ana López</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><User2 />Mi perfil</DropdownMenuItem>
                            <DropdownMenuItem>
                                <BadgePlus />  <Link href={'/user/crear-tienda'}>Crear una tienda</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem><Cog />Configuración</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><LogOut />Cerrar sesión</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

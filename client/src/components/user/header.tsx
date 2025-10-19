"use client"

import { useSidebar } from "./sidebar-provider"
import { Bell, Search, User, Menu, ShoppingCart } from "lucide-react"
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

export function Header() {


    const [activeTab, setActiveTab] = useState("dashboard")
    const [cartCount] = useState(5)
    const [notificationCount] = useState(3)
    const { toggle } = useSidebar()

    return (
        <header className="sticky top-0 z-40 border-b bg-background">
            <div className="flex h-14 items-center px-4 gap-4">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggle}>
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Esconder/Aparecer sidebar</span>
                </Button>

                <div className="flex-1">
                    <form>
                        <div className="relative max-w-md">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Busqueda..."
                                className="w-full pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                            />
                        </div>
                    </form>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="relative" onClick={() => setActiveTab("notifications")}>
                        <Bell className="h-5 w-5" />
                        {notificationCount > 0 && (
                            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs" variant="destructive">
                                {notificationCount}
                            </Badge>
                        )}
                    </Button>
                    <Button variant="ghost" size="icon" className="relative" onClick={() => setActiveTab("cart")}>
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 && (
                            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">{cartCount}</Badge>
                        )}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ana López</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Mi perfil</DropdownMenuItem>
                            <DropdownMenuItem>Configuración</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

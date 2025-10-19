"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSidebar } from "./sidebar-provider"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Settings, HelpCircle, LogOut, Menu, Package, Heart, ShoppingCart, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
    const pathname = usePathname()
    const { isOpen, toggle } = useSidebar()

    return (
        <>
            <div
                className={cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden", isOpen ? "block" : "hidden")}
                onClick={toggle}
            />
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-background",
                    "transition-transform duration-300 ease-in-out",
                    "border-r",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    "lg:translate-x-0",
                )}
            >
                <div className="flex h-14 items-center border-b px-4">
                    <span className="text-lg font-semibold">Usuario</span>
                    <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={toggle}>
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
                <div className="flex flex-col h-[calc(100vh-3.5rem)]">
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid gap-1 px-2">
                            {navItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                        pathname === item.href ? "bg-blue-900 text-white" : "text-muted-foreground",
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                    {item.badge > 0 && (
                                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[0.625rem] font-medium text-primary-foreground">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="border-t p-2">
                        <nav className="grid gap-1">
                            {footerItems.map((item, index) => (
                                <div key={index}>
                                    {item.subItems ? (
                                        <div className="space-y-1">
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                                    pathname === item.href ? "bg-gray-600 text-accent-foreground" : "text-muted-foreground",
                                                )}
                                            >
                                                <item.icon className="h-5 w-5" />
                                                <span>{item.name}</span>
                                            </Link>
                                            <div className="pl-4 space-y-1">
                                                {item.subItems.map((subItem, subIndex) => (
                                                    <Link
                                                        key={subIndex}
                                                        href={subItem.href}
                                                        className={cn(
                                                            "flex items-center gap-3 rounded-md px-3 py-1.5 text-sm hover:bg-blue-500 hover:text-gray-300",
                                                            pathname === subItem.href ? "bg-blue-700 text-white" : "text-muted-foreground",
                                                        )}
                                                    >
                                                        <span>{subItem.name}</span>
                                                        {subItem.description && (
                                                            <span className="ml-auto text-xs text-gray-400">{subItem.description}</span>
                                                        )}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                            )}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.name}</span>
                                            {item.description && (
                                                <span className="ml-auto text-xs text-muted-foreground">{item.description}</span>
                                            )}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
        </>
    )
}

const navItems = [
    { name: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard, badge: 0 },
    { name: "Compras", href: "/user/dashboard/compras", icon: Package, badge: 52 },
    { name: "Favoritos", href: "/user/dashboard/favoritos", icon: Heart, badge: 6 },
    { name: "Carrito", href: "/user/dashboard/carrito", icon: ShoppingCart, badge: 5 },
    { name: "Notificaciones", href: "/user/dashboard/notificacion", icon: Bell, badge: 3 },
]

const footerItems = [
    {
        name: "Configuración",
        href: "/user/dashboard/configuracion",
        icon: Settings,
        subItems: [
            { name: "Perfil", href: "/user/dashboard/configuracion/perfil", description: "Update your details" },
            { name: "Seguridad", href: "/user/dashboard/configuracion/seguridad", description: "Manage your password" },
            { name: "Comunicación", href: "/user/dashboard/configuracion/comunicacion", description: "Correo y teléfono" },
            { name: "Permisos", href: "/user/dashboard/configuracion/permisos", description: "Permisos de control" },
        ],
    },
    { name: "Ayuda", href: "#", icon: HelpCircle, description: "Get support" },
    { name: "Salir/Inicio", href: "/", icon: LogOut, description: "Exit the app" },
]


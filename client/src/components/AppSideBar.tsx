"use client"
import {
    Home,
    ShoppingCart,
    Users,
    BarChart,
    Settings,
    LogOut,
    ChevronUp,
    User2,
    PackageOpen,
    StoreIcon,
    ToolCase,
} from "lucide-react";


import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarSeparator,
} from "./ui/sidebar";


import Link from "next/link";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";



const menuItems = [
    {
        title: "Mi negocio",
        url: "/mi-tienda",
        icon: StoreIcon,
        exact: true // Solo activo cuando es exactamente /mi-tienda
    },
    {
        title: "Panel de control",
        url: "/",
        icon: Home,
        exact: true // Solo activo cuando es exactamente /
    },
    {
        title: "Productos",
        url: "/mi-tienda/productos",
        icon: PackageOpen,
    },
    {
        title: "Ventas/Pedidos",
        url: "/mi-tienda/ventas",
        icon: ShoppingCart,
    },
    {
        title: "Clientes",
        url: "/mi-tienda/clientes",
        icon: Users,
    },
    {
        title: "Reportes",
        url: "/mi-tienda/reportes",
        icon: BarChart,
    },
    {
        title: "Herramientas",
        url: "/mi-tienda/herramientas",
        icon: ToolCase,
    },
];



const AppSideBar = () => {
    const pathname = usePathname()

    // Función corregida para detectar el item activo
    const isActive = (url: string, exact: boolean = false) => {
        if (exact) {
            return pathname === url;
        }
        // Para rutas no exactas, verifica si la ruta actual empieza con la URL del menú
        // pero excluye el caso donde la URL del menú es un substring de otra ruta
        return pathname === url ||
            (pathname.startsWith(url + '/') && pathname !== url + '/');
    };

    return (
        <Sidebar collapsible="icon">
            {/* HEADER */}
            <SidebarHeader className="mb-5">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={"/"}>
                                <Logo
                                    variant="minimal"
                                    width={32}
                                    height={32}
                                    showIcon={true}
                                    className="flex-shrink-0"
                                />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarSeparator />

            {/* CONTENT */}

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menú</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map(({ icon: Icon, title, url, exact }) => {
                                const active = isActive(url, exact);
                                return (
                                    <SidebarMenuItem key={title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={url}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                                                    active
                                                        ? "border-orange-400 border-r-2 border-b-2 font-bold shadow-md"
                                                        : "text-slate-600 hover:bg-gray-400 hover:text-slate-500"
                                                )}
                                            >
                                                <Icon className={cn(
                                                    "h-5 w-5 flex-shrink-0 transition-colors",

                                                )} />
                                                <span className={cn(
                                                    "font-medium transition-colors",

                                                )}>
                                                    {title}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>


            </SidebarContent>

            <SidebarSeparator />

            {/* FOOTER */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> donJoe{" "}
                                    <ChevronUp className="ml-auto opacity-70" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <User2 className="mr-2 h-4 w-4" />
                                    Cuenta
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Ajustes
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Cerrar sesión
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

        </Sidebar >
    );



};

export default AppSideBar;

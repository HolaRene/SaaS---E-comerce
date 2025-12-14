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
    BadgeInfo,
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
    SidebarSeparator,
} from "./ui/sidebar";


import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";



interface AppSideBarProps {
    idTienda?: string;
}

import { useClerk } from "@clerk/nextjs";

import { useQuery } from "convex/react";
import { Badge } from "@/components/ui/badge";
import { api } from "../../convex/_generated/api";

const AppSideBar = ({ idTienda }: AppSideBarProps) => {
    const pathname = usePathname()
    const { signOut } = useClerk()

    const pedidosPendientes = useQuery(api.ventas.getVentasPendientesCount, idTienda ? { tiendaId: idTienda as any } : "skip");

    // Construir las rutas dinámicamente con el idTienda
    const menuItems = [
        {
            title: "Perfil",
            url: idTienda ? `/mi-tienda/${idTienda}` : "/",
            icon: BadgeInfo,
            exact: true
        },
        {
            title: "Productos",
            url: idTienda ? `/mi-tienda/${idTienda}/productos` : "/mi-tienda/productos",
            icon: PackageOpen,
        },
        {
            title: "Ventas",
            url: idTienda ? `/mi-tienda/${idTienda}/ventas` : "/mi-tienda/ventas",
            icon: ShoppingCart,
        },
        {
            title: "Pedidos Web",
            url: idTienda ? `/mi-tienda/${idTienda}/pedidos` : "/mi-tienda/pedidos",
            icon: PackageOpen,
            badge: pedidosPendientes // Count to show
        },
        {
            title: "Clientes",
            url: idTienda ? `/mi-tienda/${idTienda}/clientes` : "/mi-tienda/clientes",
            icon: Users,
        },
        {
            title: "Equipo",
            url: idTienda ? `/mi-tienda/${idTienda}/equipo` : "/mi-tienda/equipo",
            icon: Users,
        },
        {
            title: "Reportes",
            url: idTienda ? `/mi-tienda/${idTienda}/reportes` : "/mi-tienda/reportes",
            icon: BarChart,
        },
        {
            title: "Herramientas",
            url: idTienda ? `/mi-tienda/${idTienda}/herramientas` : "/mi-tienda/herramientas",
            icon: ToolCase,
        },
    ];

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
                            {menuItems.map(({ icon: Icon, title, url, exact, badge }) => {
                                const active = isActive(url, exact);
                                return (
                                    <SidebarMenuItem key={title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={url}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                                                    active
                                                        ? "border-orange-400 border-r-2 border-b-2 font-bold shadow-md"
                                                        : "text-slate-600 hover:bg-gray-400 hover:text-slate-500"
                                                )}
                                            >
                                                <Icon className={cn(
                                                    "h-5 w-5 flex-shrink-0 transition-colors",

                                                )} />
                                                <span className={cn(
                                                    "font-medium transition-colors flex-1",

                                                )}>
                                                    {title}
                                                </span>
                                                {badge !== undefined && badge > 0 && (
                                                    <Badge variant="destructive" className="ml-auto h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]">
                                                        {badge}
                                                    </Badge>
                                                )}
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
                                    <Settings /> Ajustes{" "}
                                    <ChevronUp className="ml-auto opacity-70" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/mi-tienda/${idTienda}/configuracion`} className="w-full cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Ajustes de la tienda</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-red-500 cursor-pointer"
                                    onClick={() => signOut({ redirectUrl: '/' })}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar sesión</span>
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

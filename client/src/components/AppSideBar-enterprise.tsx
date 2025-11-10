"use client"
import {
    Users,
    BarChart,
    Settings,
    LogOut,
    ChevronUp,
    User2,
    PackageOpen,
    StoreIcon,
    RefreshCw,
    Tag,
} from "lucide-react";


import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
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
import { cn } from "@/lib/utils";
import { Logo } from "./logo";



const menuItemsEmpresarialSimple = [
    {
        title: "Dashboard",
        url: "/empresarial",
        icon: BarChart,
        exact: true
    },
    {
        title: "Mis Tiendas",
        url: "/stores",
        icon: StoreIcon,
        exact: true
    },
    {
        title: "Usuarios",
        url: "/users",
        icon: Users,
        exact: true
    },
    {
        title: "Transferencias",
        url: "/transferencias",
        icon: RefreshCw,
        exact: true
    },
    {
        title: "Inventario",
        url: "/inventory",
        icon: PackageOpen,
        exact: true
    },
    {
        title: "Promociones",
        url: "/marketing",
        icon: Tag,
        exact: true
    },
    {
        title: "Reportes",
        url: "/analiticas",
        icon: BarChart,
        exact: true
    },
    {
        title: "Configuración",
        url: "/configuracion",
        icon: Settings,
        exact: true
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
                            {menuItemsEmpresarialSimple.map(({ icon: Icon, title, url, exact }) => {
                                const active = isActive(url, exact);

                                return <SidebarMenuItem key={title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={url} className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                                            active
                                                ? "border-orange-400 border-r-2 border-b-2 font-bold shadow-md"
                                                : "text-slate-600 hover:bg-gray-400 hover:text-slate-500"
                                        )}>
                                            <Icon />
                                            {title}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
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

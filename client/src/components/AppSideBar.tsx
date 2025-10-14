"use client"
import {
    Home,
    Package,
    ShoppingCart,
    Users,
    BarChart,
    Settings,
    LogOut,
    ChevronUp,
    User2,
    Wallet,
    Receipt,
    Info, LogIn, UserPlus, Phone,
    PackageOpen,
    Layers,
    Map,
    StoreIcon,
    Plus,
    Shirt,
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

// import {
//     LayoutDashboard,
//     Store,
//     Package,
//     ShoppingCart,
//     Users,
//     BarChart3,
//     User,
//     Settings,
//     Clock,
//     List,
//     Tags,
//     Archive,
//     Monitor,
//     ShoppingBag,
//     History,
//     Receipt,
//     UserCheck,
//     CreditCard,
//     FileText,
//     TrendingUp,
//     DollarSign,
//     CircleDollarSign,
//     AlertCircle,
//     ChevronDown,
//     Layers,
//     Phone,
//     Info,
//     StoreIcon,
//     Home,
//     PackageOpen,
//     Wallet,
//     BarChart
// } from 'lucide-react'

import Link from "next/link";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetTrigger } from "./ui/sheet";

export const publicMenuItems = [
    {
        title: "Sobre DonPulpería",
        url: "/about",
        icon: Info,
        subItems: [
            {
                title: "Planes",
                url: "/pricing",
                icon: Package,
            },
            {
                title: "Funcionalidades",
                url: "/features",
                icon: Layers,
            },
            {
                title: "Mapa de Comercios",
                url: "/map",
                icon: Map,
            },
            {
                title: "Contacto",
                url: "/contact",
                icon: Phone,
            },
        ]
    },
];


export const isAuthenticated = true;


const menuItems = [
    {
        title: "Mi negocio",
        url: "/mi-tienda",
        icon: StoreIcon,
    },
    {
        title: "Panel de control",
        url: "/panel-control",
        icon: Home,
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

];

// export const navigation= [
//     {
//         title: "Dashboard",
//         href: "/dashboard",
//         icon: LayoutDashboard,
//         badge: 5 // alertas pendientes
//     },
//     {
//         title: "Mi Negocio",
//         href: "/business",
//         icon: Store,
//         children: [
//             {
//                 title: "Perfil Público",
//                 href: "/business/profile",
//                 icon: User
//             },
//             {
//                 title: "Configuración",
//                 href: "/business/settings",
//                 icon: Settings
//             },
//             {
//                 title: "Horarios",
//                 href: "/business/hours",
//                 icon: Clock
//             }
//         ]
//     },
//     {
//         title: "Productos",
//         href: "/products",
//         icon: Package,
//         children: [
//             {
//                 title: "Todos los Productos",
//                 href: "/products",
//                 icon: List
//             },
//             {
//                 title: "Categorías",
//                 href: "/products/categories",
//                 icon: Tags
//             },
//             {
//                 title: "Inventario",
//                 href: "/products/inventory",
//                 icon: Archive,
//                 badge: 3 // stock bajo
//             }
//         ]
//     },
//     {
//         title: "Ventas",
//         href: "/sales",
//         icon: ShoppingCart,
//         children: [
//             {
//                 title: "Punto de Venta",
//                 href: "/sales/pos",
//                 icon: Monitor
//             },
//             {
//                 title: "Pedidos Activos",
//                 href: "/sales/orders",
//                 icon: ShoppingBag,
//                 badge: 7 // pedidos pendientes
//             },
//             {
//                 title: "Historial de Ventas",
//                 href: "/sales/history",
//                 icon: History
//             },
//             {
//                 title: "Facturación",
//                 href: "/sales/invoicing",
//                 icon: Receipt
//             }
//         ]
//     },
//     {
//         title: "Clientes",
//         href: "/customers",
//         icon: Users,
//         children: [
//             {
//                 title: "Base de Clientes",
//                 href: "/customers",
//                 icon: UserCheck
//             },
//             {
//                 title: "Fiados Activos",
//                 href: "/customers/credits",
//                 icon: CreditCard,
//                 badge: 12 // fiados pendientes
//             },
//             {
//                 title: "Historial de Créditos",
//                 href: "/customers/credit-history",
//                 icon: FileText
//             }
//         ]
//     },
//     {
//         title: "Reportes",
//         href: "/reports",
//         icon: BarChart3,
//         children: [
//             {
//                 title: "Ventas",
//                 href: "/reports/sales",
//                 icon: TrendingUp
//             },
//             {
//                 title: "Productos",
//                 href: "/reports/products",
//                 icon: Package
//             },
//             {
//                 title: "Clientes",
//                 href: "/reports/customers",
//                 icon: Users
//             },
//             {
//                 title: "Financiero",
//                 href: "/reports/financial",
//                 icon: CircleDollarSign
//             }
//         ]
//     }
// ]


const AppSideBar = () => {


    const sinAutenticarTiendaItems = publicMenuItems[0].subItems

    return (
        <Sidebar collapsible="icon">
            {/* HEADER */}
            <SidebarHeader className="mb-5">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={"/"}>
                                <Image
                                    alt="logo"
                                    src={"/donjoe.jpg"}
                                    width={40}
                                    height={40}
                                    className="rounded-md"
                                />
                                <span className="font-semibold">donPulpería</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarSeparator />

            {/* CONTENT */}
            {isAuthenticated ? (
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Menú</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {menuItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url}>
                                                <item.icon />
                                                {item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>Productos</SidebarGroupLabel>
                        <SidebarGroupAction>
                            <Plus /> <span className="sr-only">Add Producto</span>
                        </SidebarGroupAction>
                        <SidebarGroupContent>
                            <SidebarMenu>

                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link href="/products">
                                            <Shirt />
                                            Ver todos los productos
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <SidebarMenuButton asChild>
                                                    <Link href="#">
                                                        <Plus />
                                                        Agregar producto
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SheetTrigger>
                                            <div>
                                                <p>Hola</p>
                                            </div>
                                        </Sheet>

                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <SidebarMenuButton asChild>
                                                    <Link href="#">
                                                        <Plus />
                                                        Agregar Categoria
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SheetTrigger>
                                            <div>
                                                <p>Hola</p>
                                            </div>
                                        </Sheet>

                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                </SidebarContent>) :
                (
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Inicio</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href={'/'}>
                                                <Home /> Inicio
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton>
                                            <Info /> Sobre DonPulpería
                                        </SidebarMenuButton>
                                        <SidebarMenuSub>
                                            {sinAutenticarTiendaItems?.map((k) => (<SidebarMenuSubItem key={k.title}>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={k.url}>
                                                        <k.icon />
                                                        {k.title}
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>))}
                                        </SidebarMenuSub>
                                    </SidebarMenuItem>
                                    {/* Separador */}
                                    <SidebarSeparator />

                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href={'/login'}>
                                                <LogIn /> Iniciar Sesión
                                            </Link>
                                        </SidebarMenuButton>
                                        <SidebarMenuButton asChild>
                                            <Link href={'/login'}>
                                                <UserPlus /> Registrase
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                    </SidebarContent>
                )}



            <SidebarSeparator />

            {/* FOOTER */}
            {
                isAuthenticated && (
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
                )
            }
        </Sidebar >
    );



};

export default AppSideBar;

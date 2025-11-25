"use client"
import Link from "next/link"
import { BadgePlus, Cog, LogOut, Moon, Store, Sun, User2 } from 'lucide-react';

// Componentes de shadcn
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { SidebarTrigger, } from "./ui/sidebar";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";



const Navegacion = () => {

    const { setTheme } = useTheme()
    // const { toggleSidebar } = useSidebar()
    // Obtener usuario de Clerk

    const ruta = useRouter()
    const { user: clerkUser, isLoaded } = useUser();
    const { signOut } = useClerk()

    // Obtener usuario de Convex usando el clerkId real
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    );
    const idUser = usuario?._id
    // Obtener tiendas del usuario
    const tiendaUser = useQuery(
        api.tienda.getTiendasByPropietario,
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
        <nav className='p-4 flex items-center justify-between sticky top-0 z-10 bg-background border-b-1 border-gray-500'>
            {/* lado izquierdo */}
            {/* Icono que colapsa el sidebar */}
            <SidebarTrigger />
            {/* <Button variant={"outline"} onClick={toggleSidebar}>Personalizar</Button> */}
            {/* lado derecho */}
            <div className="flex items-center gap-4">
                <Link href={'/'}>Inicio</Link>
                <Link href={'#'}>Comercio</Link>




                {/* Escojer un tema */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                            <span className="sr-only">Cambiar de modo</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Claro
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Oscuro
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            Sistema
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                {/* Componente de un dropdown para el usuario */}
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
                            <User2 className="mr-2 h-4 w-4" />
                            Mi perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <BadgePlus className="mr-2 h-4 w-4" />
                            <Link href="/user/crear-tienda">Crear otra tienda</Link>
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
        </nav>
    )
}

export default Navegacion
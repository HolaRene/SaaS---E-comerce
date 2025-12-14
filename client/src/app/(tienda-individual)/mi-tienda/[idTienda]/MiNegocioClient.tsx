"use client"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import Perfil from "../_components/Perfil";
import Horario from "../_components/Horario";
import Configuracion from "../_components/Configuracion";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MiNegocioClientProps {
    id: Id<"tiendas">
}

export default function MiNegocioClient({ id }: MiNegocioClientProps) {
    const { user: clerkUser, isLoaded } = useUser();

    // 1. Obtener datos de la tienda (Centralizado)
    const tienda = useQuery(api.tiendas.getTiendaById, { id });

    // 2. Obtener usuario Convex
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    );

    // Estado de carga
    if (!isLoaded || tienda === undefined || usuario === undefined) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Cargando tu negocio...</p>
            </div>
        );
    }

    // Tienda no encontrada
    if (tienda === null) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Card className="max-w-md border-destructive/20 bg-destructive/5">
                    <CardContent className="flex flex-col items-center p-6 text-center space-y-4">
                        <div className="rounded-full bg-destructive/10 p-3">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                        </div>
                        <h2 className="text-xl font-bold">Tienda no encontrada</h2>
                        <p className="text-muted-foreground">
                            La tienda que buscas no existe o ha sido eliminada.
                        </p>
                        <Button asChild variant="outline">
                            <Link href="/user/dashboard">Volver al Dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 3. Verificación de Permisos
    const isOwner = usuario?._id === tienda.propietario;

    // Verificar si es miembro activo en la lista de miembros
    const memberRecord = tienda.miembros?.find(m => m.usuarioId === usuario?._id);
    const isMember = !!memberRecord;

    // Si no tiene acceso (ni dueño ni miembro)
    if (!isOwner && !isMember) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Card className="max-w-md border-destructive/20 bg-destructive/5">
                    <CardContent className="flex flex-col items-center p-6 text-center space-y-4">
                        <div className="rounded-full bg-destructive/10 p-3">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                        </div>
                        <h2 className="text-xl font-bold">Acceso Denegado</h2>
                        <p className="text-muted-foreground">
                            No tienes permisos para administrar esta tienda.
                            Si crees que es un error, contacta al propietario.
                        </p>
                        <Button asChild>
                            <Link href="/user/dashboard">Volver a mis tiendas</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Datos del miembro (si es miembro)
    const memberRole = isOwner ? 'propietario' : memberRecord?.rol || 'vendedor';

    return (
        <Tabs defaultValue="perfil" className="w-full mt-3">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="perfil">Perfil Público</TabsTrigger>
                <TabsTrigger value="configuracion">Configuración</TabsTrigger>
                <TabsTrigger value="horarios">Horarios</TabsTrigger>
            </TabsList>

            {/* Pasamos los datos ya cargados a los componentes hijos */}

            <TabsContent value="perfil" className="space-y-6">
                <Perfil
                    id={id}
                    tiendaData={tienda}
                    usuarioData={usuario}
                    isOwner={isOwner}
                    role={memberRole}
                />
            </TabsContent>

            <TabsContent value="configuracion" className="space-y-6">
                <Configuracion
                    id={id}
                    tiendaData={tienda}
                    usuarioData={usuario}
                    isOwner={isOwner}
                    role={memberRole}
                />
            </TabsContent>

            <TabsContent value="horarios" className="space-y-6">
                <Horario
                    id={id}
                    tiendaData={tienda}
                    usuarioData={usuario}
                    isOwner={isOwner}
                    role={memberRole}
                />
            </TabsContent>

        </Tabs>
    );
}

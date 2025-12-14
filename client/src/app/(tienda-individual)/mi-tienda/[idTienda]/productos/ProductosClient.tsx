"use client"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Boxes, Package, Tags, Loader2, ShieldAlert } from "lucide-react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CatalogoCompleto from "./_components/CatalogoCompleto";
import ControlInventario from "./_components/ControlInventario";
import CategoriasEtiquetas from "./_components/CategoriasEtiquetas";

interface ProductosClientProps {
    idTienda: Id<"tiendas">;
}

const ProductosClient = ({ idTienda }: ProductosClientProps) => {
    const { user, isLoaded } = useUser();

    // 1. Cargar datos centralizados
    const tienda = useQuery(api.tiendas.getTiendaById, { id: idTienda });
    const usuario = useQuery(api.users.getUserById, {
        clerkId: user?.id || ""
    });
    const productos = useQuery(api.productos.getProductosByTienda, { tiendaId: idTienda });

    // 2. Estados de carga
    if (!isLoaded || tienda === undefined || usuario === undefined || productos === undefined) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Cargando inventario...</p>
            </div>
        );
    }

    // 3. Validaciones de existencia
    if (tienda === null) {
        return (
            <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>La tienda no existe o no se pudo cargar.</AlertDescription>
            </Alert>
        );
    }

    // 4. Lógica de Permisos
    const isOwner = usuario && String(tienda.propietario) === String(usuario._id);
    const miembroActual = !isOwner && usuario
        ? tienda.miembros?.find(m => String(m.usuarioId) === String(usuario._id))
        : null;
    const isMember = !!miembroActual;
    const role = isOwner ? 'owner' : (miembroActual?.rol || 'visitante');

    const canView = isOwner || isMember;

    if (!canView) {
        return (
            <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Acceso Denegado</AlertTitle>
                <AlertDescription>No tienes permisos para ver el inventario de esta tienda.</AlertDescription>
            </Alert>
        );
    }

    // Definir permisos específicos
    // Owner/Admin: Todo
    // Vendedor: Ver, Ajustar Stock (Inventario)
    // Asistente: Solo Ver
    const permisos = {
        canManageProducts: role === 'owner' || role === 'admin', // Crear, Editar, Eliminar
        canAdjustStock: role === 'owner' || role === 'admin' || role === 'vendedor', // Ajuste rápido
        role: role
    };

    return (
        <div className='flex flex-col gap-4'>
            {/* Header */}
            <header className="mt-2">
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Productos</h1>
                <p className="text-muted-foreground">Administra el inventario, categorías y catálogo de tu negocio.</p>
            </header>

            <Tabs defaultValue="catalogo">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="catalogo" >
                        <Boxes className="mr-2 h-4 w-4" />
                        Catálogo <span className="hidden md:block">Completo</span>
                    </TabsTrigger>
                    <TabsTrigger value="inventario"><Package className="mr-2 h-4 w-4" />Control <span className="hidden md:block">de Inventario</span></TabsTrigger>
                    <TabsTrigger value="categorias"><Tags className="mr-2 h-4 w-4" />Categorías <span className="hidden md:block">y Etiquetas</span></TabsTrigger>
                </TabsList>


                {/* 1. Catálogo Completo */}
                <TabsContent value="catalogo">
                    <CatalogoCompleto
                        idTienda={idTienda}
                        productos={productos}
                        permisos={permisos}
                    />
                </TabsContent>

                {/* 2. Control de Inventario */}
                <TabsContent value="inventario" >
                    <ControlInventario
                        idTienda={idTienda}
                        productos={productos}
                        permisos={permisos}
                    />
                </TabsContent>

                {/* 3. Categorías y Etiquetas */}
                <TabsContent value="categorias" >
                    <CategoriasEtiquetas
                        idTienda={idTienda}
                        productos={productos}
                        permisos={permisos}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default ProductosClient

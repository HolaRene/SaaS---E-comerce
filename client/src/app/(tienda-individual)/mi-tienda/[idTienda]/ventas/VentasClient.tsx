"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, FileDown, Loader2, ShieldAlert } from "lucide-react"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import PuntoVenta from "./_components/PuntoVenta"
import HistorialVentas from "./_components/HistorialVentas"

interface VentasClientProps {
    idTienda: Id<"tiendas">;
}

const VentasClient = ({ idTienda }: VentasClientProps) => {
    const { user, isLoaded } = useUser();

    // 1. Cargar datos centralizados
    const tienda = useQuery(api.tiendas.getTiendaById, { id: idTienda });
    const usuarioConvex = useQuery(api.users.getUserById, {
        clerkId: user?.id || ""
    });
    // Productos y Clientes necesarios para Punto de Venta
    const productos = useQuery(api.productos.getProductosByTienda, { tiendaId: idTienda });
    const clientes = useQuery(api.clientes.getClientesByTienda, { tiendaId: idTienda });

    // 2. Estados de carga
    if (!isLoaded || tienda === undefined || usuarioConvex === undefined || productos === undefined || clientes === undefined) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Cargando módulo de ventas...</p>
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
    const isOwner = usuarioConvex && String(tienda.propietario) === String(usuarioConvex._id);
    const miembroActual = !isOwner && usuarioConvex
        ? tienda.miembros?.find(m => String(m.usuarioId) === String(usuarioConvex._id))
        : null;
    const isMember = !!miembroActual;
    const role = isOwner ? 'owner' : (miembroActual?.rol || 'visitante');

    // Permisos para ver el módulo de ventas
    const canView = isOwner || role === 'admin' || role === 'vendedor';

    if (!canView) {
        return (
            <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Acceso Denegado</AlertTitle>
                <AlertDescription>No tienes permisos para acceder al módulo de ventas.</AlertDescription>
            </Alert>
        );
    }

    const permisos = {
        canSell: true, // Si puede ver, puede vender (por ahora)
        role: role
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="container">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Módulo de Ventas</h1>
                    <p className="text-muted-foreground">Gestiona ventas, pedidos y facturación de tu negocio</p>
                </header>

                <Tabs defaultValue="pos" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="pos">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Punto de Venta
                        </TabsTrigger>
                        <TabsTrigger value="historial">
                            <FileDown className="mr-2 h-4 w-4" />
                            Historial
                        </TabsTrigger>
                    </TabsList>

                    {/* Punto de Venta */}
                    <TabsContent value="pos">
                        <PuntoVenta
                            idTienda={idTienda}
                            productos={productos}
                            clientes={clientes}
                            usuario={usuarioConvex}
                            permisos={permisos}
                        />
                    </TabsContent>

                    {/* Historial de Ventas */}
                    <TabsContent value="historial">
                        <HistorialVentas
                            idTienda={idTienda}
                            permisos={permisos}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default VentasClient

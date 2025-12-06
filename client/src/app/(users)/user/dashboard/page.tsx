"use client"

import StatsCards from "./_components/StatsCards"
import OrdenesActivas from "./_components/OrdenesActivas"
import ActividadesNovedades from "./_components/ActividadesNovedades"
import Recomendaciones from "./_components/Recomendaciones"
import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { useClerk, useUser } from "@clerk/nextjs"
import { Spinner } from "@/components/ui/spinner"



const DashBoardUser = () => {
    // Obtener el ID del usuario desde el contexto (viene de la URL)
    const { user: clerkUser, isLoaded } = useUser();
    // const { signOut } = useClerk()

    // Obtener usuario de Convex usando el clerkId real
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    );
    const idUser = usuario?._id
    // Obtener tiendas del usuario
    const tiendaUser = useQuery(
        api.tiendas.getTiendasByPropietario,
        idUser ? { propietarioId: idUser } : "skip"
    );

    // Mientras carga o no hay usuario
    if (!isLoaded || !clerkUser) {
        return <div className="flex items-center justify-center h-screen">
            <Spinner className="h-16 w-16" />
        </div>;
    }

    // Mientras carga
    if (!usuario) {
        return <div className="flex items-center justify-center h-screen">
            No hay usuario
        </div>;
    }

    // Datos finales para mostrar
    const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`;

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-balance">¡Hola, {nombreCompleto}!</h2>
                <p className="text-muted-foreground">Bienvenido/a de vuelta a tu mercado local</p>
            </div>
            {/* Stats */}
            <StatsCards idUser={idUser} />
            {/* Ordenes activas */}
            <OrdenesActivas />
            {/* Actividades y novedades */}
            <ActividadesNovedades />
            {/* Recommendations */}
            <Recomendaciones />
        </div>
    )
}

export default DashBoardUser

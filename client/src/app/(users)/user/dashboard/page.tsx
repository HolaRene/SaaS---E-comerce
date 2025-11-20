"use client"

import StatsCards from "./_components/StatsCards"
import OrdenesActivas from "./_components/OrdenesActivas"
import ActividadesNovedades from "./_components/ActividadesNovedades"
import Recomendaciones from "./_components/Recomendaciones"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"




const DashBoardUser = () => {
    const { user: clerkUser, isLoaded } = useUser();

    // Obtener usuario de Convex usando el clerkId real
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    );

    // Mientras carga o no hay usuario
    if (!isLoaded || !clerkUser) {
        return null; // o un skeleton
    }

    // Datos finales para mostrar
    const nombreCompleto = usuario
        ? `${usuario.nombre} ${usuario.apellido}`
        : clerkUser.fullName || "Usuario";

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-balance">¡Hola, {nombreCompleto}!</h2>
                <p className="text-muted-foreground">Bienvenido/a de vuelta a tu mercado local</p>
            </div>
            {/* Stats */}
            <StatsCards />
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

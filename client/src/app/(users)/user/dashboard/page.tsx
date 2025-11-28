"use client"

import StatsCards from "./_components/StatsCards"
import OrdenesActivas from "./_components/OrdenesActivas"
import ActividadesNovedades from "./_components/ActividadesNovedades"
import Recomendaciones from "./_components/Recomendaciones"
import { useUserId } from "@/app/providers/UserIdProvider"
import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"



const DashBoardUser = () => {
    // Obtener el ID del usuario desde el contexto (viene de la URL)
    const idUser = useUserId();

    // Obtener datos del usuario usando el ID de Convex directamente
    const usuario = useQuery(api.users.getUser, { userId: idUser });

    // Mientras carga
    if (!usuario) {
        return null; // o un skeleton
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

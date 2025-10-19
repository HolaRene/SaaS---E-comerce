
import StatsCards from "./_components/StatsCards"
import OrdenesActivas from "./_components/OrdenesActivas"
import ActividadesNovedades from "./_components/ActividadesNovedades"
import Recomendaciones from "./_components/Recomendaciones"




const DashBoardUser = () => {
    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-balance">Hola, Ana López 👋</h2>
                <p className="text-muted-foreground">Bienvenida de vuelta a tu mercado local</p>
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

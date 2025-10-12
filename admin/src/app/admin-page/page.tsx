import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, DollarSignIcon, Layers, Users } from "lucide-react";
import NuevosComercios from "./components/NuevosComercios";
import IngresosTotales from "./components/IngresosTotales";

const metricasGlobales = [
    {
        title: "Comercios Activos",
        value: "120",
        icon: Building,
        description: "+14 este mes",
    },
    {
        title: "Usuarios Registrados",
        value: "4,350",
        icon: Users,
        description: "+180 este mes",
    },
    {
        title: "Ingresos Mensuales (MRR)",
        value: "C$125,000",
        icon: DollarSignIcon,
        description: "+5.2% vs mes anterior",
    },
    {
        title: "Planes Activos",
        value: "3 Tipos",
        icon: Layers,
        description: "Gratis, Pro, Premium",
    },
];

const AdminPage = () => {
    return (
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4 space-y-3'>
            {/* Métricas Globales */}
            {metricasGlobales.map((metric) => (
                <Card key={metric.title} className="mt-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
                        <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                        <metric.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </CardContent>
                </Card>
            ))}
            {/* Gráfico de Nuevos Comercios */}
            <NuevosComercios />
            {/* Gráfico de Ingresos Totales */}
            <IngresosTotales />
        </div>
    )
}

export default AdminPage
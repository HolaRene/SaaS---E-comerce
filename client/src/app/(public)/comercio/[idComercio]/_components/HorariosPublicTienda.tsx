"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, CalendarDays, Clock, Save } from "lucide-react";
import { DataTableHorario } from "./data-table";
import { columns } from "./columnsHorarioPublic";
import { diasFestivos } from "@/data/dias-festivos";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../convex/_generated/api";





const HorarioPublico = ({ id }: { id: Id<"tiendas"> }) => {
    const tienda = useQuery(
        api.tiendas.getTiendaPublicaById,
        { id }
    );

    if (!tienda) {
        return (
            <p className="text-center py-10 text-muted-foreground">
                Cargando datos de la tienda...
            </p>
        );
    }

    if (tienda === null) {
        return (
            <p className="text-center py-10 text-destructive">
                No se encontró la tienda.
            </p>
        );
    }



    return (
        <div className='space-y-3'>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Horarios Regulares de la tienda {tienda.nombre}</CardTitle>
                    <CardDescription>Horarios de apertura y cierre para cada día de la semana.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTableHorario columns={columns} data={tienda.horarios} />
                </CardContent>
            </Card>

        </div>
    )
}

export default HorarioPublico
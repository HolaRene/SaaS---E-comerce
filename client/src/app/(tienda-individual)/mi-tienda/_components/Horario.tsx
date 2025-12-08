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
import { columns } from "./columns";
import { diasFestivos } from "@/data/dias-festivos";
import { useQuery } from "convex/react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import EditarHorarioDialog from "./EditarHorarioDialog";





const Horario = ({ id }: { id: Id<"tiendas"> }) => {
    const tienda = useQuery(
        api.tiendas.getTiendaById,
        { id }
    );
    const { user: clerkUser } = useUser()

    // Obtener usuario Convex
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    );

    const isOwner = usuario?._id === tienda?.propietario

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
            {
                isOwner ? (
                    <>
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Horarios Regulares</CardTitle>
                                    <EditarHorarioDialog tienda={tienda} />
                                </div>
                                <CardDescription>Define las horas de apertura y cierre para cada día de la semana.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DataTableHorario columns={columns} data={tienda.horarios} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5" /> Días Festivos y Eventos</CardTitle>
                                <CardDescription>Gestiona horarios especiales para fechas importantes.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {diasFestivos.map(item => (
                                    <div key={item.evento} className="flex items-center justify-between rounded-lg border p-3">
                                        <div>
                                            <p className="font-semibold">{item.evento}</p>
                                            <p className="text-sm text-muted-foreground">{item.fecha}</p>
                                        </div>
                                        <Badge variant={item.estado === 'Cerrado' ? 'outline' : 'secondary'}>{item.estado}</Badge>
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline">Agregar Fecha Especial</Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Modo Ausente</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <Label htmlFor="modo-cerrado">Marcar como cerrado temporalmente</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Tu perfil público mostrará el negocio como cerrado.
                                        </p>
                                    </div>
                                    <Switch id="modo-cerrado" />
                                </div>
                                <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-500 bg-amber-50 p-4 text-amber-800">
                                    <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                                    <p className="text-sm">Tu negocio aparecerá como **CERRADO** hasta que desactives este modo.</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Notificaciones y Logs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start space-x-3">
                                    <Checkbox id="notificar-cambios" defaultChecked />
                                    <div className="grid gap-1.5 leading-none">
                                        <label htmlFor="notificar-cambios" className="text-sm font-medium">
                                            Notificar a seguidores
                                        </label>
                                        <p className="text-sm text-muted-foreground">
                                            Enviar una notificación por WhatsApp o email al cambiar los horarios.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 rounded-lg border bg-muted p-4">
                                    <p className="text-sm text-muted-foreground">📅 05/10/2025 U+2013 Se actualizó el horario de domingo a Cerrado.</p>
                                    <p className="text-sm text-muted-foreground">📅 01/09/2025 – Se agregó el feriado Día de la Independencia.</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button><Save className="mr-2 h-4 w-4" /> Guardar Cambios de Horario</Button>
                            </CardFooter>
                        </Card></>
                ) : (<p className="text-red-500 text-3xl">Esta tienda no es tuya jaja 🤣🤣</p>)
            }
        </div>
    )
}

export default Horario
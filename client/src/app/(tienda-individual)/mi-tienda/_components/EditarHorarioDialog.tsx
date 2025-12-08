"use client";

import { useMutation } from "convex/react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, CalendarClock } from "lucide-react";
import { useState } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const horarioSchema = z.object({
    horarios: z.array(z.object({
        dia: z.string(),
        apertura: z.string(),
        cierre: z.string(),
        cerrado: z.boolean(),
    }))
});

interface EditarHorarioDialogProps {
    tienda: {
        _id: Id<"tiendas">;
        horarios: {
            dia: string;
            apertura: string;
            cierre: string;
            cerrado: boolean;
            aperturaEspecial?: string;
            cierreEspecial?: string;
        }[];
    };
    trigger?: React.ReactNode;
}

export default function EditarHorarioDialog({ tienda, trigger }: EditarHorarioDialogProps) {
    const [open, setOpen] = useState(false);
    const updateTienda = useMutation(api.tiendas.updateTienda);

    const form = useForm<z.infer<typeof horarioSchema>>({
        resolver: zodResolver(horarioSchema),
        defaultValues: {
            horarios: tienda.horarios || [
                { dia: "Lunes", apertura: "08:00", cierre: "17:00", cerrado: false },
                { dia: "Martes", apertura: "08:00", cierre: "17:00", cerrado: false },
                { dia: "Miércoles", apertura: "08:00", cierre: "17:00", cerrado: false },
                { dia: "Jueves", apertura: "08:00", cierre: "17:00", cerrado: false },
                { dia: "Viernes", apertura: "08:00", cierre: "17:00", cerrado: false },
                { dia: "Sábado", apertura: "08:00", cierre: "12:00", cerrado: false },
                { dia: "Domingo", apertura: "00:00", cierre: "00:00", cerrado: true },
            ]
        },
    });

    const { fields } = useFieldArray({
        control: form.control,
        name: "horarios",
    });

    const onSubmit = async (values: z.infer<typeof horarioSchema>) => {
        try {
            await updateTienda({
                id: tienda._id,
                horarios: values.horarios,
            });

            toast.success("Horario actualizado correctamente");
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar el horario");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline">
                        <CalendarClock className="mr-2 h-4 w-4" /> Editar Horarios
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Editar Horario de Atención</DialogTitle>
                    <DialogDescription>
                        Define los horarios de apertura y cierre para cada día de la semana.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[60vh] px-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-6">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center border-b pb-4 last:border-0 pl-1">
                                    <div className="w-24 font-medium pt-2 sm:pt-0">
                                        {field.dia}
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name={`horarios.${index}.cerrado`}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2 shadow-sm min-w-[100px]">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        Cerrado
                                                    </FormLabel>
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex gap-2 items-center flex-1">
                                        <FormField
                                            control={form.control}
                                            name={`horarios.${index}.apertura`}
                                            render={({ field: inputField }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input
                                                            type="time"
                                                            {...inputField}
                                                            disabled={form.watch(`horarios.${index}.cerrado`)}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <span>-</span>
                                        <FormField
                                            control={form.control}
                                            name={`horarios.${index}.cierre`}
                                            render={({ field: inputField }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input
                                                            type="time"
                                                            {...inputField}
                                                            disabled={form.watch(`horarios.${index}.cerrado`)}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Guardar Cambios
                                </Button>
                            </div>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

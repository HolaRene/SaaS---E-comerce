"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, CheckCircle2, FileText, Globe, Save, XCircle } from "lucide-react";
import { tienda } from "@/lib/tiendas-datos";

const Configuracion = () => {
    const datosFiscales = tienda.configuracion
    return (
        <div className='space-y-3'>
            <Card>
                <CardHeader>
                    <CardTitle>Datos Fiscales</CardTitle>
                    <CardDescription>Información legal y fiscal de tu negocio.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nit">NIT</Label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="nit" defaultValue={datosFiscales.NIT} className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ruc">RUC</Label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="ruc" defaultValue={datosFiscales.RUC} className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="direccion-fiscal">Dirección Fiscal</Label>
                        <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="direccion-fiscal" defaultValue={datosFiscales.direccion} className="pl-10" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Preferencias del Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="moneda">Moneda Predeterminada</Label>
                            <Select defaultValue="NIO">
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NIO">Córdoba (NIO)</SelectItem>
                                    <SelectItem value="USD">Dólar (USD)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="formato-fecha">Formato de Fecha y Hora</Label>
                            <Input id="formato-fecha" defaultValue="DD/MM/YYYY hh:mm A" disabled />
                        </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label>Backup Automático</Label>
                            <p className="text-sm text-muted-foreground">{datosFiscales.backup}</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Integraciones</CardTitle>
                    <CardDescription>Conecta tu negocio con otras plataformas.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                            <div>
                                <p className="font-semibold">WhatsApp</p>
                                <p className="text-sm text-muted-foreground">{
                                    tienda.telefono ? 'Conectado' : 'no conectado'
                                }</p>
                            </div>
                        </div>
                        {/* <Button variant="secondary" size="sm">Configurar</Button> */}
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <XCircle className="h-6 w-6 text-red-500" />
                            <div>
                                <p className="font-semibold">SMS</p>
                                <p className="text-sm text-muted-foreground">No conectado</p>
                            </div>
                        </div>
                        <Button variant="secondary" size="sm">Conectar</Button>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="whatsapp-link">Enlace de WhatsApp</Label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="whatsapp-link" defaultValue="https://wa.me/50588888888" className="pl-10" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button><Save className="mr-2 h-4 w-4" /> Guardar Cambios</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Configuracion
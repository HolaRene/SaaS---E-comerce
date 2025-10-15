"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Copy, Edit, Megaphone, MessageCircle, Plus, Send, Upload } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "react-toastify"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface Recordatorio {
    id: number
    tipo: string
    descripcion: string
    fecha: string
    monto?: number
    completado: boolean
}
interface Plantilla {
    id: number
    nombre: string
    contenido: string
    categoria: string
}


const recordatoriosData: Recordatorio[] = [
    {
        id: 1,
        tipo: "Cobro",
        descripcion: "Cobro a Juan Pérez",
        fecha: "2025-10-06",
        monto: 350,
        completado: false,
    },
    {
        id: 2,
        tipo: "Stock",
        descripcion: "Revisión stock Pan Dulce",
        fecha: "2025-10-08",
        completado: false,
    },
    {
        id: 3,
        tipo: "Cobro",
        descripcion: "Cobro a María González",
        fecha: "2025-10-10",
        monto: 520,
        completado: false,
    },
    {
        id: 4,
        tipo: "Promoción",
        descripcion: "Fin de promoción refrescos",
        fecha: "2025-10-12",
        completado: false,
    },
]
const plantillasData: Plantilla[] = [
    {
        id: 1,
        nombre: "Promoción fin de semana",
        contenido:
            "¡Hola {nombre}! Este fin de semana tenemos ofertas especiales en {producto} a solo C${precio}. ¡No te lo pierdas!",
        categoria: "Promoción",
    },
    {
        id: 2,
        nombre: "Cobro amable",
        contenido:
            "Hola {nombre}, te recordamos que tienes un saldo pendiente de C${monto}. Puedes pasar cuando gustes. ¡Gracias!",
        categoria: "Cobro",
    },
    {
        id: 3,
        nombre: "Gracias por su compra",
        contenido: "¡Gracias por tu compra {nombre}! Te esperamos pronto en Don Pulpería. ¡Que tengas un excelente día!",
        categoria: "Agradecimiento",
    },
    {
        id: 4,
        nombre: "Nuevo producto",
        contenido: "¡Hola {nombre}! Tenemos nuevo en stock: {producto}. Ven a conocerlo, te va a encantar.",
        categoria: "Novedad",
    },
]

const Comunicacion = () => {


    const [recordatorios, setRecordatorios] = useState(recordatoriosData)
    const handleEnviarMensajeMasivo = () => {
        toast.success("Enviado por whatsapp")
    }

    const handleGuardarPromocion = () => {
        toast.success("Se ha guardado la promoción")
    }

    const handleEnviarPromocion = () => {
        toast.success("Se H enviado la promoción")
    }

    const handleAgregarRecordatorio = () => {
        toast.success("Recordatorio agregado")
    }
    const handleUsarPlantilla = (plantilla: Plantilla) => {
        toast.success("Plantilla cargada")
    }
    return (
        <div className='space-y-3 '>
            {/* Mensajes Masivos y Promociones */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Mensajes Masivos */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            Mensajes Masivos
                        </CardTitle>
                        <CardDescription>Envía mensajes a múltiples clientes por WhatsApp</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="mensaje">Mensaje</Label>
                            <Textarea id="mensaje" placeholder="Escribe tu mensaje aquí..." className="min-h-[100px]" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="clientes">Seleccionar clientes</Label>
                            <Select>
                                <SelectTrigger id="clientes">
                                    <SelectValue placeholder="Selecciona clientes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos los clientes</SelectItem>
                                    <SelectItem value="activos">Clientes activos</SelectItem>
                                    <SelectItem value="morosos">Clientes con fiados</SelectItem>
                                    <SelectItem value="vip">Clientes VIP</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleEnviarMensajeMasivo} className="w-full">
                            <Send className="h-4 w-4 mr-2" />
                            Enviar por WhatsApp
                        </Button>
                        <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-1">Ejemplo de mensaje:</p>
                            <p className="text-sm text-muted-foreground">
                                ¡Hola Juan! Tenemos oferta en Pan Dulce a C$20. ¡Visítanos hoy!
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Promociones */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Megaphone className="h-5 w-5" />
                            Promociones
                        </CardTitle>
                        <CardDescription>Crea y comparte promociones especiales</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="titulo-promo">Título</Label>
                            <Input id="titulo-promo" placeholder="Ej: Oferta de fin de semana" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="descripcion-promo">Descripción</Label>
                            <Textarea id="descripcion-promo" placeholder="Describe la promoción..." className="min-h-[80px]" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fecha-inicio">Fecha inicio</Label>
                                <Input id="fecha-inicio" type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fecha-fin">Fecha fin</Label>
                                <Input id="fecha-fin" type="date" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imagen-promo">Imagen</Label>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Subir imagen
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="publicar-sitio">Publicar en sitio público</Label>
                            <Switch id="publicar-sitio" />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleGuardarPromocion} variant="outline" className="flex-1 bg-transparent">
                                Guardar
                            </Button>
                            <Button onClick={handleEnviarPromocion} className="flex-1">
                                <Send className="h-4 w-4 mr-2" />
                                Enviar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recordatorios */}
            <Card>
                <CardHeader>
                    <div className="flex gap-4 flex-col md:flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Recordatorios
                            </CardTitle>
                            <CardDescription>Gestiona tus recordatorios y tareas pendientes</CardDescription>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar recordatorio
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Nuevo Recordatorio</DialogTitle>
                                    <DialogDescription>Crea un nuevo recordatorio para tu negocio</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="tipo-recordatorio">Tipo</Label>
                                        <Select>
                                            <SelectTrigger id="tipo-recordatorio">
                                                <SelectValue placeholder="Selecciona el tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cobro">Cobro</SelectItem>
                                                <SelectItem value="stock">Revisión de stock</SelectItem>
                                                <SelectItem value="promocion">Promoción</SelectItem>
                                                <SelectItem value="otro">Otro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="descripcion-recordatorio">Descripción</Label>
                                        <Input id="descripcion-recordatorio" placeholder="Ej: Cobro a Juan Pérez" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fecha-recordatorio">Fecha</Label>
                                        <Input id="fecha-recordatorio" type="date" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="monto-recordatorio">Monto (opcional)</Label>
                                        <Input id="monto-recordatorio" type="number" placeholder="C$" />
                                    </div>
                                </div>
                                <Button onClick={handleAgregarRecordatorio} className="">
                                    Agregar recordatorio
                                </Button>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Monto</TableHead>
                                <TableHead>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recordatorios.map((recordatorio) => (
                                <TableRow key={recordatorio.id}>
                                    <TableCell>
                                        <Badge variant="outline">{recordatorio.tipo}</Badge>
                                    </TableCell>
                                    <TableCell>{recordatorio.descripcion}</TableCell>
                                    <TableCell>{recordatorio.fecha}</TableCell>
                                    <TableCell>{recordatorio.monto ? `C$${recordatorio.monto.toFixed(2)}` : "-"}</TableCell>
                                    <TableCell>
                                        {recordatorio.completado ? (
                                            <Badge variant="default">Completado</Badge>
                                        ) : (
                                            <Badge variant="secondary">Pendiente</Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Plantillas Guardadas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Copy className="h-5 w-5" />
                        Plantillas Guardadas
                    </CardTitle>
                    <CardDescription>Usa plantillas predefinidas para mensajes rápidos</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {plantillasData.map((plantilla) => (
                            <Card key={plantilla.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-base">{plantilla.nombre}</CardTitle>
                                            <Badge variant="secondary" className="mt-1">
                                                {plantilla.categoria}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-muted-foreground">{plantilla.contenido}</p>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleUsarPlantilla(plantilla)}
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                        >
                                            Usar plantilla
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Comunicacion
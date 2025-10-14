"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle, Clock, Filter, Mail, MapPin, Phone, Search, UserPlus } from "lucide-react"
import { Label } from "@/components/ui/label"


// Tipos de datos
interface Cliente {
    id: number
    nombre: string
    telefono: string
    direccion: string
    email?: string
    totalCompras: number
    ultimaCompra: string
    estado: "activo" | "fiado"
    segmento: "frecuente" | "ocasional" | "mayorista"
    preferencias?: string
    historialCompras: {
        fecha: string
        total: number
        metodoPago: string
    }[]
}

// Datos estáticos
const clientes: Cliente[] = [
    {
        id: 1,
        nombre: "Juan Pérez",
        telefono: "8888-8888",
        direccion: "Barrio San Judas, de la rotonda 2c al sur",
        email: "juan.perez@email.com",
        totalCompras: 2450,
        ultimaCompra: "03/10/2025",
        estado: "activo",
        segmento: "frecuente",
        preferencias: "Prefiere productos de panadería, compra cada 3 días",
        historialCompras: [
            { fecha: "03/10/2025", total: 450, metodoPago: "Efectivo" },
            { fecha: "30/09/2025", total: 380, metodoPago: "Transferencia" },
            { fecha: "27/09/2025", total: 520, metodoPago: "Efectivo" },
        ],
    },
    {
        id: 2,
        nombre: "Ana López",
        telefono: "8877-5544",
        direccion: "Reparto Schick, frente al parque",
        totalCompras: 870,
        ultimaCompra: "05/10/2025",
        estado: "fiado",
        segmento: "ocasional",
        preferencias: "Compra productos de limpieza al por mayor",
        historialCompras: [
            { fecha: "05/10/2025", total: 320, metodoPago: "Fiado" },
            { fecha: "28/09/2025", total: 550, metodoPago: "Efectivo" },
        ],
    },
    {
        id: 3,
        nombre: "Carlos Méndez",
        telefono: "8399-4433",
        direccion: "Villa Fontana, casa 45",
        email: "carlos.m@email.com",
        totalCompras: 1320,
        ultimaCompra: "02/10/2025",
        estado: "activo",
        segmento: "frecuente",
        preferencias: "Cliente mayorista, compra bebidas y snacks",
        historialCompras: [
            { fecha: "02/10/2025", total: 680, metodoPago: "Transferencia" },
            { fecha: "25/09/2025", total: 640, metodoPago: "Efectivo" },
        ],
    },
    {
        id: 4,
        nombre: "María Rodríguez",
        telefono: "8765-3322",
        direccion: "Altamira, de la iglesia 1c abajo",
        totalCompras: 3200,
        ultimaCompra: "06/10/2025",
        estado: "activo",
        segmento: "mayorista",
        preferencias: "Compra productos de abarrotes para reventa",
        historialCompras: [
            { fecha: "06/10/2025", total: 1200, metodoPago: "Transferencia" },
            { fecha: "01/10/2025", total: 980, metodoPago: "Transferencia" },
            { fecha: "26/09/2025", total: 1020, metodoPago: "Efectivo" },
        ],
    },
    {
        id: 5,
        nombre: "Roberto Silva",
        telefono: "8234-5566",
        direccion: "Los Robles, contiguo al supermercado",
        totalCompras: 560,
        ultimaCompra: "04/10/2025",
        estado: "fiado",
        segmento: "ocasional",
        historialCompras: [
            { fecha: "04/10/2025", total: 280, metodoPago: "Fiado" },
            { fecha: "20/09/2025", total: 280, metodoPago: "Efectivo" },
        ],
    },
]

const BaseClientes = () => {


    const [searchTerm, setSearchTerm] = useState("")
    const [filterEstado, setFilterEstado] = useState("todos")
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)

    const clientesFiltrados = clientes.filter((cliente) => {
        const matchSearch =
            cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || cliente.telefono.includes(searchTerm)
        const matchFilter =
            filterEstado === "todos" ||
            (filterEstado === "frecuentes" && cliente.segmento === "frecuente") ||
            (filterEstado === "fiado" && cliente.estado === "fiado")
        return matchSearch && matchFilter
    })

    return (
        <div className='space-y-4'>
            {/* Barra de búsqueda y filtros */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative flex-1">
                            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Buscar por nombre o teléfono..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={filterEstado} onValueChange={setFilterEstado}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos</SelectItem>
                                    <SelectItem value="frecuentes">Frecuentes</SelectItem>
                                    <SelectItem value="fiado">Fiado activo</SelectItem>
                                </SelectContent>
                            </Select>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="gap-2">
                                        <UserPlus className="h-4 w-4" />
                                        Agregar Cliente
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                                        <DialogDescription>Completa la información del nuevo cliente</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Nombre completo</Label>
                                            <Input placeholder="Ej: Juan Pérez" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Teléfono</Label>
                                            <Input placeholder="8888-8888" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Dirección</Label>
                                            <Input placeholder="Barrio, referencias" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email (opcional)</Label>
                                            <Input type="email" placeholder="cliente@email.com" />
                                        </div>
                                        <Button className="w-full">Guardar Cliente</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabla de clientes */}
            <Card>
                <CardHeader>
                    <CardTitle>Clientes Registrados</CardTitle>
                    <CardDescription>{clientesFiltrados.length} clientes encontrados</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead>Total Compras</TableHead>
                                <TableHead>Última Compra</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clientesFiltrados.map((cliente) => (
                                <TableRow key={cliente.id}>
                                    <TableCell className="font-medium">{cliente.nombre}</TableCell>
                                    <TableCell>{cliente.telefono}</TableCell>
                                    <TableCell>C${cliente.totalCompras.toLocaleString()}</TableCell>
                                    <TableCell>{cliente.ultimaCompra}</TableCell>
                                    <TableCell>
                                        {cliente.estado === "activo" ? (
                                            <Badge variant="default" className="gap-1">
                                                <CheckCircle className="h-3 w-3" />
                                                Activo
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="gap-1">
                                                <Clock className="h-3 w-3" />
                                                Fiado
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" onClick={() => setSelectedCliente(cliente)}>
                                                    Ver Detalle
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>Detalle del Cliente</DialogTitle>
                                                </DialogHeader>
                                                {selectedCliente && (
                                                    <div className="space-y-6">
                                                        {/* Información básica */}
                                                        <div className="flex items-start gap-4">
                                                            <Avatar className="h-16 w-16">
                                                                <AvatarFallback className="text-lg">
                                                                    {selectedCliente.nombre
                                                                        .split(" ")
                                                                        .map((n) => n[0])
                                                                        .join("")}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1 space-y-3">
                                                                <div>
                                                                    <h3 className="text-xl font-semibold">{selectedCliente.nombre}</h3>
                                                                    <Badge variant="outline" className="mt-1">
                                                                        {selectedCliente.segmento}
                                                                    </Badge>
                                                                </div>
                                                                <div className="text-muted-foreground space-y-1 text-sm">
                                                                    <div className="flex items-center gap-2">
                                                                        <Phone className="h-4 w-4" />
                                                                        {selectedCliente.telefono}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <MapPin className="h-4 w-4" />
                                                                        {selectedCliente.direccion}
                                                                    </div>
                                                                    {selectedCliente.email && (
                                                                        <div className="flex items-center gap-2">
                                                                            <Mail className="h-4 w-4" />
                                                                            {selectedCliente.email}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Preferencias */}
                                                        {selectedCliente.preferencias && (
                                                            <div className="bg-muted rounded-lg p-4">
                                                                <h4 className="mb-2 font-medium">Preferencias y Datos</h4>
                                                                <p className="text-muted-foreground text-sm">{selectedCliente.preferencias}</p>
                                                            </div>
                                                        )}

                                                        {/* Historial de compras */}
                                                        <div>
                                                            <h4 className="mb-3 font-medium">Historial de Compras</h4>
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead>Fecha</TableHead>
                                                                        <TableHead>Total</TableHead>
                                                                        <TableHead>Método de Pago</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {selectedCliente.historialCompras.map((compra, idx) => (
                                                                        <TableRow key={idx}>
                                                                            <TableCell>{compra.fecha}</TableCell>
                                                                            <TableCell>C${compra.total.toLocaleString()}</TableCell>
                                                                            <TableCell>{compra.metodoPago}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </div>

                                                        {/* Segmentación */}
                                                        <div className="space-y-2">
                                                            <Label>Segmentación</Label>
                                                            <Select defaultValue={selectedCliente.segmento}>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="frecuente">Frecuente</SelectItem>
                                                                    <SelectItem value="ocasional">Ocasional</SelectItem>
                                                                    <SelectItem value="mayorista">Mayorista</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default BaseClientes
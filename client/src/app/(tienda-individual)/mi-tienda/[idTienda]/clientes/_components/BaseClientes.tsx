"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
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
import { Filter, Mail, MapPin, Phone, Search, UserPlus, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Id } from "../../../../../../../convex/_generated/dataModel"
import { api } from "../../../../../../../convex/_generated/api"

const BaseClientes = ({ idTienda }: { idTienda: Id<"tiendas"> }) => {
    const tiendaId = idTienda

    const [searchTerm, setSearchTerm] = useState("")
    const [filterEstado, setFilterEstado] = useState("todos")
    const [filterSegmento, setFilterSegmento] = useState<"frecuente" | "ocasional" | "mayorista" | undefined>(undefined)
    const [selectedClienteId, setSelectedClienteId] = useState<Id<"clientes"> | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        nombre: "",
        telefono: "",
        email: "",
        direccion: "",
        notas: "",
        segmento: "ocasional" as "frecuente" | "ocasional" | "mayorista"
    })

    // Queries
    const clientes = useQuery(api.clientes.getClientesByTienda, {
        tiendaId,
        searchTerm: searchTerm || undefined,
        segmento: filterSegmento,
        estado: filterEstado !== "todos" ? filterEstado : undefined,
    })

    const clienteDetalle = useQuery(
        api.clientes.getClienteDetalle,
        selectedClienteId ? { clienteId: selectedClienteId } : "skip"
    )

    // Mutations
    const createCliente = useMutation(api.clientes.createCliente)
    const updateSegmento = useMutation(api.clientes.updateSegmento)

    // Handlers
    const handleCreateCliente = async () => {
        try {
            if (!formData.nombre.trim()) {
                toast.error("El nombre es requerido")
                return
            }

            await createCliente({
                tiendaId,
                nombre: formData.nombre,
                telefono: formData.telefono || undefined,
                email: formData.email || undefined,
                direccion: formData.direccion || undefined,
                notas: formData.notas || undefined,
                segmento: formData.segmento,
            })

            toast.success("Cliente creado exitosamente")
            setIsDialogOpen(false)
            setFormData({
                nombre: "",
                telefono: "",
                email: "",
                direccion: "",
                notas: "",
                segmento: "ocasional"
            })
        } catch (error) {
            toast.error("Error al crear cliente")
            console.error(error)
        }
    }

    const handleUpdateSegmento = async (clienteId: Id<"clientes">, segmento: "frecuente" | "ocasional" | "mayorista") => {
        try {
            await updateSegmento({ clienteId, segmento })
            toast.success("Segmento actualizado")
        } catch (error) {
            toast.error("Error al actualizar segmento")
            console.error(error)
        }
    }

    const handleFilterSegmento = (value: string) => {
        if (value === "todos") {
            setFilterSegmento(undefined)
        } else {
            setFilterSegmento(value as "frecuente" | "ocasional" | "mayorista")
        }
    }

    const handleViewDetalle = (clienteId: Id<"clientes">) => {
        setSelectedClienteId(clienteId)
        setIsDetailDialogOpen(true)
    }

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
                                    <SelectItem value="fiado">Fiado activo</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={filterSegmento || "todos"}
                                onValueChange={handleFilterSegmento}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Segmento" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos</SelectItem>
                                    <SelectItem value="frecuente">Frecuentes</SelectItem>
                                    <SelectItem value="ocasional">Ocasionales</SelectItem>
                                    <SelectItem value="mayorista">Mayoristas</SelectItem>
                                </SelectContent>
                            </Select>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                                            <Label>Nombre completo *</Label>
                                            <Input
                                                placeholder="Ej: Juan Pérez"
                                                value={formData.nombre}
                                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Teléfono</Label>
                                            <Input
                                                placeholder="8888-8888"
                                                value={formData.telefono}
                                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Dirección</Label>
                                            <Input
                                                placeholder="Barrio, referencias"
                                                value={formData.direccion}
                                                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email (opcional)</Label>
                                            <Input
                                                type="email"
                                                placeholder="cliente@email.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Segmento</Label>
                                            <Select
                                                value={formData.segmento}
                                                onValueChange={(value: "frecuente" | "ocasional" | "mayorista") =>
                                                    setFormData({ ...formData, segmento: value })
                                                }
                                            >
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
                                        <div className="space-y-2">
                                            <Label>Notas (opcional)</Label>
                                            <Input
                                                placeholder="Preferencias, observaciones..."
                                                value={formData.notas}
                                                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                                            />
                                        </div>
                                        <Button className="w-full" onClick={handleCreateCliente}>
                                            Guardar Cliente
                                        </Button>
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
                    <CardDescription>
                        {clientes === undefined ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Cargando...
                            </span>
                        ) : (
                            `${clientes.length} clientes encontrados`
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {clientes === undefined ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : clientes.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No se encontraron clientes
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Teléfono</TableHead>
                                    <TableHead>Total Compras</TableHead>
                                    <TableHead>Última Compra</TableHead>
                                    <TableHead>Segmento</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clientes.map((cliente) => (
                                    <TableRow key={cliente._id}>
                                        <TableCell className="font-medium">{cliente.nombre}</TableCell>
                                        <TableCell>{cliente.telefono || "-"}</TableCell>
                                        <TableCell>C${cliente.totalCompras.toLocaleString()}</TableCell>
                                        <TableCell>
                                            {cliente.ultimaCompra
                                                ? new Date(cliente.ultimaCompra).toLocaleDateString('es-NI')
                                                : "-"
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {cliente.segmento || "ocasional"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDetalle(cliente._id)}
                                            >
                                                Ver Detalle
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Dialog de detalle del cliente */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detalle del Cliente</DialogTitle>
                    </DialogHeader>
                    {clienteDetalle === undefined ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : clienteDetalle === null ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Cliente no encontrado
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Información básica */}
                            <div className="flex items-start gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-lg">
                                        {clienteDetalle.nombre
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h3 className="text-xl font-semibold">{clienteDetalle.nombre}</h3>
                                        <Badge variant="outline" className="mt-1 capitalize">
                                            {clienteDetalle.segmento || "ocasional"}
                                        </Badge>
                                    </div>
                                    <div className="text-muted-foreground space-y-1 text-sm">
                                        {clienteDetalle.telefono && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4" />
                                                {clienteDetalle.telefono}
                                            </div>
                                        )}
                                        {clienteDetalle.direccion && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                {clienteDetalle.direccion}
                                            </div>
                                        )}
                                        {clienteDetalle.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4" />
                                                {clienteDetalle.email}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Notas/Preferencias */}
                            {clienteDetalle.notas && (
                                <div className="bg-muted rounded-lg p-4">
                                    <h4 className="mb-2 font-medium">Notas</h4>
                                    <p className="text-muted-foreground text-sm">{clienteDetalle.notas}</p>
                                </div>
                            )}

                            {/* Historial de compras */}
                            <div>
                                <h4 className="mb-3 font-medium">Historial de Compras</h4>
                                {clienteDetalle.historialCompras && clienteDetalle.historialCompras.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Fecha</TableHead>
                                                <TableHead>Total</TableHead>
                                                <TableHead>Método de Pago</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {clienteDetalle.historialCompras.map((compra, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>
                                                        {new Date(compra.fecha).toLocaleDateString('es-NI')}
                                                    </TableCell>
                                                    <TableCell>C${compra.total.toLocaleString()}</TableCell>
                                                    <TableCell className="capitalize">{compra.metodoPago}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-muted-foreground text-sm">No hay compras registradas</p>
                                )}
                            </div>

                            {/* Segmentación */}
                            <div className="space-y-2">
                                <Label>Segmentación</Label>
                                <Select
                                    defaultValue={clienteDetalle.segmento || "ocasional"}
                                    onValueChange={(value: "frecuente" | "ocasional" | "mayorista") =>
                                        handleUpdateSegmento(clienteDetalle._id, value)
                                    }
                                >
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
        </div>
    )
}

export default BaseClientes
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Minus, Plus, Printer, Search, UserPlus, X, Users, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Id, Doc } from "../../../../../../../convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../../../../convex/_generated/api"
import { toast } from "sonner"

// Tipo local para el carrito de compras
interface ProductoCarrito {
    id: Id<"productos">
    nombre: string
    cantidad: number
    precioUnitario: number
    stockDisponible: number
    imagen?: string
}

const PuntoVenta = ({ idTienda }: { idTienda: Id<"tiendas"> }) => {
    // Estados principales
    const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoCarrito[]>([])
    const [metodoPago, setMetodoPago] = useState("efectivo")
    const [mostrarTicket, setMostrarTicket] = useState(false)
    const [busquedaProducto, setBusquedaProducto] = useState("")
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Doc<"clientes"> | null>(null)
    const [mostrarSelectorCliente, setMostrarSelectorCliente] = useState(false)
    const [mostrarCrearCliente, setMostrarCrearCliente] = useState(false)
    const [busquedaCliente, setBusquedaCliente] = useState("")

    // Estado para nuevo cliente
    const [nuevoCliente, setNuevoCliente] = useState({
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        notas: ""
    })

    // Datos simulados para cajero (esto podría venir del auth)
    const [cajeroActual] = useState({ nombre: "Cajero Actual", rol: "Vendedor" })

    const tienda = useQuery(api.tienda.getTiendaById, { tiendaId: idTienda })
    // Obtener datos reales de Convex
    const productosDB = useQuery(api.productos.getProductosByTienda, { tiendaId: idTienda })
    const clientesDB = useQuery(api.clientes.getClientesByTienda, { tiendaId: idTienda })
    // Mutations
    const crearVentaMutation = useMutation(api.ventas.crearVenta)
    const crearClienteMutation = useMutation(api.clientes.crearCliente)


    /// Filtrar productos basado en la búsqueda (usando datos de Convex)
    const productosFiltrados = (productosDB || []).filter(producto =>
        producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
        producto.categoria.toLowerCase().includes(busquedaProducto.toLowerCase())
    ).slice(0, 5)

    // Filtrar clientes basado en la búsqueda (usando datos de Convex)
    const clientesFiltrados = (clientesDB || []).filter(cliente =>
        cliente.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
        cliente.telefono?.includes(busquedaCliente) ||
        cliente.email?.toLowerCase().includes(busquedaCliente.toLowerCase())
    )

    // Agregar producto a la venta
    const agregarProducto = (producto: Doc<"productos">) => {
        const existe = productosSeleccionados.find(p => p.id === producto._id)

        if (existe) {
            if (existe.cantidad < producto.cantidad) {
                setProductosSeleccionados(prev =>
                    prev.map(p =>
                        p.id === producto._id ? { ...p, cantidad: p.cantidad + 1 } : p
                    )
                )
            } else {
                toast.error("No hay suficiente stock")
            }
        } else {
            if (producto.cantidad > 0) {
                setProductosSeleccionados(prev => [
                    ...prev,
                    {
                        id: producto._id,
                        nombre: producto.nombre,
                        cantidad: 1,
                        precioUnitario: producto.precio,
                        stockDisponible: producto.cantidad,
                        imagen: producto.imagenes?.[0]
                    }
                ])
            } else {
                toast.error("Producto sin stock")
            }
        }
        setBusquedaProducto("")
    }

    // Actualizar cantidad de producto
    const actualizarCantidad = (productoId: Id<"productos">, nuevaCantidad: number) => {
        if (nuevaCantidad < 1) return

        const producto = productosSeleccionados.find(p => p.id === productoId)
        if (producto && nuevaCantidad <= producto.stockDisponible) {
            setProductosSeleccionados(prev =>
                prev.map(p =>
                    p.id === productoId ? { ...p, cantidad: nuevaCantidad } : p
                )
            )
        }
    }

    // Remover producto de la venta
    const removerProducto = (productoId: Id<"productos">) => {
        setProductosSeleccionados(prev =>
            prev.filter(p => p.id !== productoId)
        )
    }

    // Crear nuevo cliente
    const crearNuevoCliente = async () => {
        if (!nuevoCliente.nombre.trim()) {
            toast.error("El nombre del cliente es obligatorio")
            return
        }

        try {
            const clienteId = await crearClienteMutation({
                tiendaId: idTienda,
                nombre: nuevoCliente.nombre,
                email: nuevoCliente.email || undefined,
                telefono: nuevoCliente.telefono || undefined,
                direccion: nuevoCliente.direccion || undefined,
                notas: nuevoCliente.notas || undefined,
            })

            toast.success("Cliente creado exitosamente")
            setMostrarCrearCliente(false)

            setNuevoCliente({
                nombre: "",
                email: "",
                telefono: "",
                direccion: "",
                notas: ""
            })
        } catch (error) {
            toast.error("Error al crear cliente")
            console.error(error)
        }
    }

    // Cálculos
    const calcularSubtotal = () => {
        return productosSeleccionados.reduce((acc, prod) => acc + prod.cantidad * prod.precioUnitario, 0)
    }

    const calcularImpuesto = () => {
        return calcularSubtotal() * 0.05
    }

    const calcularTotal = () => {
        return calcularSubtotal() + calcularImpuesto()
    }

    const registrarVenta = async () => {
        if (productosSeleccionados.length === 0) {
            toast.error("Agrega al menos un producto para registrar la venta")
            return
        }

        try {
            await crearVentaMutation({
                tiendaId: idTienda,
                clienteId: clienteSeleccionado?._id,
                productos: productosSeleccionados.map(p => ({
                    productoId: p.id,
                    cantidad: p.cantidad,
                    precioUnitario: p.precioUnitario,
                    nombreProducto: p.nombre,
                })),
                metodoPago: metodoPago as any,
                subtotal: calcularSubtotal(),
                impuesto: calcularImpuesto(),
                total: calcularTotal(),
            })

            toast.success("Venta registrada exitosamente")
            setMostrarTicket(true)

            // Limpiar formulario después de unos segundos
            setTimeout(() => {
                setProductosSeleccionados([])
                setClienteSeleccionado(null)
                setBusquedaProducto("")
                setMostrarTicket(false)
            }, 3000)
        } catch (error) {
            toast.error("Error al registrar venta")
            console.error(error)
        }
    }

    // Obtener fecha actual formateada
    const obtenerFechaActual = () => {
        return new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    return (
        <div className="grid lg:grid-cols-3 gap-4 grid-cols-1">
            {/* Panel Principal - Búsqueda y Productos */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Nueva Venta</CardTitle>
                        <CardDescription>Registra productos y completa la transacción</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Cliente Seleccionado */}
                        {clienteSeleccionado && (
                            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Users className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-blue-900">{clienteSeleccionado.nombre}</div>
                                        <div className="text-sm text-blue-700">
                                            {clienteSeleccionado.telefono && clienteSeleccionado.telefono !== "N/A" && (
                                                <span>{clienteSeleccionado.telefono}</span>
                                            )}
                                            {clienteSeleccionado.email && (
                                                <span> • {clienteSeleccionado.email}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setClienteSeleccionado(null)}
                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {/* Búsqueda y Selección */}
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar producto por nombre o categoría..."
                                    className="pl-9"
                                    value={busquedaProducto}
                                    onChange={(e) => setBusquedaProducto(e.target.value)}
                                />

                                {/* Dropdown de resultados de búsqueda */}
                                {busquedaProducto && productosFiltrados.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-20 mt-1 max-h-60 overflow-auto">
                                        {productosFiltrados.map((producto) => (
                                            <div
                                                key={producto._id}
                                                className="flex items-center p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                                                onClick={() => agregarProducto(producto)}
                                            >
                                                <div className="w-10 h-10 rounded bg-muted overflow-hidden mr-3 flex-shrink-0">
                                                    {producto.imagenes && producto.imagenes.length > 0 ? (
                                                        <img
                                                            src={producto.imagenes[0]}
                                                            alt={producto.nombre}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs">
                                                            📦
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm truncate">
                                                        {producto.nombre}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span>C${producto.precio.toFixed(2)}</span>
                                                        <span>•</span>
                                                        <span>Stock: {producto.cantidad}</span>
                                                        <span>•</span>
                                                        <span className={`text-xs ${producto.estado === 'activo' && producto.cantidad > 0
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                            }`}>
                                                            {producto.estado === 'activo' && producto.cantidad > 0
                                                                ? 'Disponible'
                                                                : 'No disponible'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    disabled={producto.estado !== 'activo' || producto.cantidad === 0}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        agregarProducto(producto)
                                                    }}
                                                >
                                                    Agregar
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setMostrarSelectorCliente(true)}
                                className="whitespace-nowrap"
                            >
                                <Users className="h-4 w-4 mr-2" />
                                {clienteSeleccionado ? "Cambiar" : "Cliente"}
                            </Button>
                        </div>

                        {/* Lista de Productos en Venta */}
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead className="text-center">Cantidad</TableHead>
                                        <TableHead className="text-right">Precio Unit.</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {productosSeleccionados.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                No hay productos agregados. Busca y agrega productos para comenzar.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        productosSeleccionados.map((producto) => (
                                            <TableRow key={producto.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 rounded bg-muted overflow-hidden flex-shrink-0">
                                                            {producto.imagen ? (
                                                                <img
                                                                    src={producto.imagen}
                                                                    alt={producto.nombre}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-xs">
                                                                    📦
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div>{producto.nombre}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                Stock: {producto.stockDisponible}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-7 w-7"
                                                            onClick={() => actualizarCantidad(producto.id, producto.cantidad - 1)}
                                                            disabled={producto.cantidad <= 1}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-8 text-center font-medium">{producto.cantidad}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-7 w-7"
                                                            onClick={() => actualizarCantidad(producto.id, producto.cantidad + 1)}
                                                            disabled={producto.cantidad >= producto.stockDisponible}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">C${producto.precioUnitario.toFixed(2)}</TableCell>
                                                <TableCell className="text-right font-medium">
                                                    C${(producto.cantidad * producto.precioUnitario).toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => removerProducto(producto.id)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Panel Lateral - Resumen y Acciones */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Resumen de Venta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Información del Cliente */}
                        {clienteSeleccionado && (
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-sm font-medium text-blue-900">Cliente:</div>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                        Activo
                                    </Badge>
                                </div>
                                <div className="text-sm text-blue-800">{clienteSeleccionado.nombre}</div>
                                {clienteSeleccionado.telefono && clienteSeleccionado.telefono !== "N/A" && (
                                    <div className="text-xs text-blue-600 flex items-center mt-1">
                                        <Phone className="h-3 w-3 mr-1" />
                                        {clienteSeleccionado.telefono}
                                    </div>
                                )}
                                {clienteSeleccionado.email && (
                                    <div className="text-xs text-blue-600 flex items-center">
                                        <Mail className="h-3 w-3 mr-1" />
                                        {clienteSeleccionado.email}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Método de Pago */}
                        <div>
                            <Label className="text-sm font-medium mb-2 block">Método de Pago</Label>
                            <Select value={metodoPago} onValueChange={setMetodoPago}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="efectivo">Efectivo</SelectItem>
                                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                    <SelectItem value="transferencia">Transferencia</SelectItem>
                                    <SelectItem value="fiado">Fiado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Resumen de Montos */}
                        <div className="space-y-2 pt-4 border-t">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <span>C${calcularSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Impuesto (5%):</span>
                                <span>C${calcularImpuesto().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                <span>Total:</span>
                                <span className="text-primary">C${calcularTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="space-y-2 pt-4">
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={registrarVenta}
                                disabled={productosSeleccionados.length === 0}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Registrar Venta
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setMostrarTicket(true)}
                                disabled={productosSeleccionados.length === 0}
                            >
                                <Printer className="mr-2 h-4 w-4" />
                                Vista Previa Ticket
                            </Button>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => {
                                    setProductosSeleccionados([])
                                    setClienteSeleccionado(null)
                                    setBusquedaProducto("")
                                }}
                            >
                                Cancelar Venta
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Diálogo para Seleccionar Cliente */}
            <Dialog open={mostrarSelectorCliente} onOpenChange={setMostrarSelectorCliente}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Seleccionar Cliente</DialogTitle>
                        <DialogDescription>
                            Elige un cliente existente o crea uno nuevo para esta venta
                        </DialogDescription>
                    </DialogHeader>

                    {/* Búsqueda de clientes */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar cliente por nombre, teléfono o email..."
                            className="pl-9"
                            value={busquedaCliente}
                            onChange={(e) => setBusquedaCliente(e.target.value)}
                        />
                    </div>

                    {/* Lista de clientes */}
                    <div className="space-y-3 max-h-60 overflow-auto">
                        {clientesFiltrados.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                {busquedaCliente ? "No se encontraron clientes" : "No hay clientes registrados"}
                            </div>
                        ) : (
                            clientesFiltrados.map((cliente) => (
                                <div
                                    key={cliente._id}
                                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted ${clienteSeleccionado?._id === cliente._id ? 'bg-blue-50 border-blue-200' : ''
                                        }`}
                                    onClick={() => {
                                        setClienteSeleccionado(cliente)
                                        setMostrarSelectorCliente(false)
                                        setBusquedaCliente("")
                                    }}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Users className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{cliente.nombre}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {cliente.telefono && cliente.telefono !== "N/A" && (
                                                    <span>{cliente.telefono}</span>
                                                )}
                                                {cliente.email && (
                                                    <span> • {cliente.email}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {clienteSeleccionado?._id === cliente._id && (
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                            Seleccionado
                                        </Badge>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setMostrarSelectorCliente(false)}
                            className="sm:flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => {
                                setClienteSeleccionado(null) // Cliente General (null)
                                setMostrarSelectorCliente(false)
                                setBusquedaCliente("")
                            }}
                            variant="outline"
                            className="sm:flex-1"
                        >
                            Usar Cliente General
                        </Button>
                        <Button
                            onClick={() => {
                                setMostrarSelectorCliente(false)
                                setMostrarCrearCliente(true)
                            }}
                            className="sm:flex-1"
                        >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Crear Nuevo Cliente
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Diálogo para Crear Nuevo Cliente */}
            <Dialog open={mostrarCrearCliente} onOpenChange={setMostrarCrearCliente}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Crear Nuevo Cliente</DialogTitle>
                        <DialogDescription>
                            Completa la información del nuevo cliente
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre completo *</Label>
                            <Input
                                id="nombre"
                                placeholder="Ej: Juan Pérez García"
                                value={nuevoCliente.nombre}
                                onChange={(e) => setNuevoCliente(prev => ({ ...prev, nombre: e.target.value }))}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="telefono">Teléfono</Label>
                                <Input
                                    id="telefono"
                                    placeholder="8888-8888"
                                    value={nuevoCliente.telefono}
                                    onChange={(e) => setNuevoCliente(prev => ({ ...prev, telefono: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="cliente@email.com"
                                    value={nuevoCliente.email}
                                    onChange={(e) => setNuevoCliente(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="direccion">Dirección</Label>
                            <Input
                                id="direccion"
                                placeholder="Ej: Barrio San Luis, Managua"
                                value={nuevoCliente.direccion}
                                onChange={(e) => setNuevoCliente(prev => ({ ...prev, direccion: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notas">Notas adicionales</Label>
                            <Textarea
                                id="notas"
                                placeholder="Información adicional del cliente..."
                                value={nuevoCliente.notas}
                                onChange={(e) => setNuevoCliente(prev => ({ ...prev, notas: e.target.value }))}
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setMostrarCrearCliente(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={crearNuevoCliente}
                            disabled={!nuevoCliente.nombre.trim()}
                        >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Crear Cliente
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Diálogo del Ticket */}
            <Dialog open={mostrarTicket} onOpenChange={setMostrarTicket}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Ticket de Venta</DialogTitle>
                        <DialogDescription>Vista previa del comprobante</DialogDescription>
                    </DialogHeader>

                    <div className="border-2 border-dashed rounded-lg p-6 space-y-4 bg-muted/30">
                        <div className="text-center border-b pb-4">
                            <h3 className="font-bold text-lg">Pulpería San José</h3>
                            <p className="text-sm text-muted-foreground">Managua, Nicaragua</p>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Fecha:</span>
                                <span>{obtenerFechaActual()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Cajero:</span>
                                <span>{cajeroActual.nombre}</span>
                            </div>
                            {clienteSeleccionado && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Cliente:</span>
                                    <span>{clienteSeleccionado.nombre}</span>
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-4 space-y-2 text-sm">
                            {productosSeleccionados.map((prod) => (
                                <div key={prod.id} className="flex justify-between">
                                    <span>
                                        {prod.nombre} x{prod.cantidad}
                                    </span>
                                    <span>C${(prod.cantidad * prod.precioUnitario).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-1">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal:</span>
                                <span>C${calcularSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Impuesto:</span>
                                <span>C${calcularImpuesto().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Total:</span>
                                <span>C${calcularTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="text-center text-sm text-muted-foreground border-t pt-4">
                            ¡Gracias por su compra!
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setMostrarTicket(false)}>
                            Cerrar
                        </Button>
                        <Button>
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PuntoVenta
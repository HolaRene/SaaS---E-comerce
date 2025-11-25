"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock, Truck, ChefHat, MapPin, Phone, Mail, User, Package, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"

// Tipos mejorados para integrar con tu sistema
interface ProductoPedido {
    id: string;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    imagen?: string;
}

interface ClientePedido {
    id: string;
    nombre: string;
    telefono?: string;
    email?: string;
    direccion?: string;
}

interface Pedido {
    id: string;
    cliente: ClientePedido;
    monto: number;
    fecha: string;
    hora: string;
    estado: "pendiente" | "preparacion" | "entrega" | "completado";
    productos: ProductoPedido[];
    metodoPago: "efectivo" | "tarjeta" | "transferencia" | "fiado";
    notas?: string;
    tiempoPreparacion?: number; // en minutos
}

// Hook personalizado para gestionar pedidos
const usePedidos = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);

    // Cargar pedidos iniciales (en un caso real, esto vendría de tu API)
    useEffect(() => {
        const pedidosIniciales: Pedido[] = [
            {
                id: "00124",
                cliente: {
                    id: "1",
                    nombre: "María López",
                    telefono: "8888-8888",
                    direccion: "Barrio San Luis, Managua"
                },
                monto: 350.0,
                fecha: "05/10/2025",
                hora: "14:30",
                estado: "pendiente",
                metodoPago: "efectivo",
                productos: [
                    { id: "1", nombre: "Arroz 1kg", cantidad: 2, precioUnitario: 25.0 },
                    { id: "2", nombre: "Frijoles 1kg", cantidad: 1, precioUnitario: 30.0 },
                    { id: "3", nombre: "Aceite 1L", cantidad: 1, precioUnitario: 45.0 },
                ],
                tiempoPreparacion: 15
            },
            {
                id: "00125",
                cliente: {
                    id: "2",
                    nombre: "Carlos Martínez",
                    telefono: "7777-7777",
                    email: "carlos@email.com"
                },
                monto: 180.0,
                fecha: "05/10/2025",
                hora: "15:15",
                estado: "preparacion",
                metodoPago: "tarjeta",
                productos: [
                    { id: "4", nombre: "Pan Dulce", cantidad: 5, precioUnitario: 12.0 },
                    { id: "5", nombre: "Leche 1L", cantidad: 2, precioUnitario: 25.0 },
                ],
                tiempoPreparacion: 10
            },
            {
                id: "00126",
                cliente: {
                    id: "3",
                    nombre: "Ana Rodríguez",
                    telefono: "6666-6666",
                    direccion: "Residencial Bolonia, Managua"
                },
                monto: 520.0,
                fecha: "05/10/2025",
                hora: "16:00",
                estado: "entrega",
                metodoPago: "efectivo",
                productos: [
                    { id: "6", nombre: "Azúcar 2kg", cantidad: 3, precioUnitario: 40.0 },
                    { id: "7", nombre: "Café 500g", cantidad: 2, precioUnitario: 80.0 },
                ],
                notas: "Entregar en recepción"
            }
        ];
        setPedidos(pedidosIniciales);
    }, []);

    const actualizarEstadoPedido = (pedidoId: string, nuevoEstado: Pedido['estado']) => {
        setPedidos(prev => prev.map(pedido =>
            pedido.id === pedidoId
                ? {
                    ...pedido,
                    estado: nuevoEstado,
                    // Si se completa, actualizar hora
                    ...(nuevoEstado === 'completado' && {
                        hora: new Date().toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                    })
                }
                : pedido
        ));
    };

    const eliminarPedido = (pedidoId: string) => {
        setPedidos(prev => prev.filter(pedido => pedido.id !== pedidoId));
    };

    return {
        pedidos,
        actualizarEstadoPedido,
        eliminarPedido
    };
};

const PedidosActivos = () => {
    const { pedidos, actualizarEstadoPedido, eliminarPedido } = usePedidos();
    const [filtroEstado, setFiltroEstado] = useState<string>("todos");
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

    // Obtener estadísticas
    const estadisticas = {
        total: pedidos.length,
        pendientes: pedidos.filter(p => p.estado === 'pendiente').length,
        preparacion: pedidos.filter(p => p.estado === 'preparacion').length,
        entrega: pedidos.filter(p => p.estado === 'entrega').length,
        completados: pedidos.filter(p => p.estado === 'completado').length
    };

    const getEstadoBadge = (estado: string) => {
        const config = {
            pendiente: {
                color: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
                icon: <Clock className="mr-1 h-3 w-3" />,
                texto: "Pendiente"
            },
            preparacion: {
                color: "bg-blue-500/10 text-blue-700 border-blue-200",
                icon: <ChefHat className="mr-1 h-3 w-3" />,
                texto: "En preparación"
            },
            entrega: {
                color: "bg-orange-500/10 text-orange-700 border-orange-200",
                icon: <Truck className="mr-1 h-3 w-3" />,
                texto: "En entrega"
            },
            completado: {
                color: "bg-green-500/10 text-green-700 border-green-200",
                icon: "✅",
                texto: "Completado"
            }
        };
        return config[estado as keyof typeof config] || config.pendiente;
    };

    const getMetodoPagoBadge = (metodo: string) => {
        const config = {
            efectivo: "bg-green-500/10 text-green-700 border-green-200",
            tarjeta: "bg-blue-500/10 text-blue-700 border-blue-200",
            transferencia: "bg-purple-500/10 text-purple-700 border-purple-200",
            fiado: "bg-red-500/10 text-red-700 border-red-200"
        };
        return config[metodo as keyof typeof config] || config.efectivo;
    };

    const pedidosFiltrados = filtroEstado === "todos"
        ? pedidos
        : pedidos.filter((p) => p.estado === filtroEstado);

    const getSiguienteEstado = (estadoActual: string): Pedido['estado'] | null => {
        const flujo: Record<string, Pedido['estado']> = {
            pendiente: 'preparacion',
            preparacion: 'entrega',
            entrega: 'completado'
        };
        return flujo[estadoActual] || null;
    };

    return (
        <div className='space-y-6'>
            {/* Estadísticas Rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-700">{estadisticas.total}</div>
                        <div className="text-sm text-blue-600">Total Pedidos</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-yellow-700">{estadisticas.pendientes}</div>
                        <div className="text-sm text-yellow-600">Pendientes</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-700">{estadisticas.preparacion}</div>
                        <div className="text-sm text-blue-600">Preparación</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-orange-700">{estadisticas.entrega}</div>
                        <div className="text-sm text-orange-600">En Entrega</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-700">{estadisticas.completados}</div>
                        <div className="text-sm text-green-600">Completados</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-2 mb-6">
                <Button
                    variant={filtroEstado === "todos" ? "default" : "outline"}
                    onClick={() => setFiltroEstado("todos")}
                >
                    Todos ({estadisticas.total})
                </Button>
                <Button
                    variant={filtroEstado === "pendiente" ? "default" : "outline"}
                    onClick={() => setFiltroEstado("pendiente")}
                >
                    Pendientes ({estadisticas.pendientes})
                </Button>
                <Button
                    variant={filtroEstado === "preparacion" ? "default" : "outline"}
                    onClick={() => setFiltroEstado("preparacion")}
                >
                    En preparación ({estadisticas.preparacion})
                </Button>
                <Button
                    variant={filtroEstado === "entrega" ? "default" : "outline"}
                    onClick={() => setFiltroEstado("entrega")}
                >
                    Para entregar ({estadisticas.entrega})
                </Button>
                <Button
                    variant={filtroEstado === "completado" ? "default" : "outline"}
                    onClick={() => setFiltroEstado("completado")}
                >
                    Completados ({estadisticas.completados})
                </Button>
            </div>

            {/* Lista de Pedidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pedidosFiltrados.map((pedido) => {
                    const estadoBadge = getEstadoBadge(pedido.estado);
                    const siguienteEstado = getSiguienteEstado(pedido.estado);

                    return (
                        <Card key={pedido.id} className="hover:shadow-lg transition-shadow border-l-4"
                            style={{ borderLeftColor: getEstadoBadge(pedido.estado).color.split(' ')[0] }}>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Package className="h-5 w-5 text-muted-foreground" />
                                            Pedido #{pedido.id}
                                        </CardTitle>
                                        <CardDescription className="mt-1 flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            {pedido.cliente.nombre}
                                        </CardDescription>
                                    </div>
                                    <Badge className={estadoBadge.color}>
                                        {estadoBadge.icon}
                                        {estadoBadge.texto}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Información rápida */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" />
                                            Monto:
                                        </span>
                                        <span className="font-semibold">C${pedido.monto.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Hora:</span>
                                        <span>{pedido.hora}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Método:</span>
                                        <Badge variant="outline" className={getMetodoPagoBadge(pedido.metodoPago)}>
                                            {pedido.metodoPago}
                                        </Badge>
                                    </div>
                                    {pedido.tiempoPreparacion && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Tiempo estimado:</span>
                                            <span>{pedido.tiempoPreparacion} min</span>
                                        </div>
                                    )}
                                </div>

                                {/* Productos resumidos */}
                                <div className="text-sm">
                                    <div className="text-muted-foreground mb-1">Productos:</div>
                                    <div className="space-y-1">
                                        {pedido.productos.slice(0, 2).map((prod, index) => (
                                            <div key={index} className="flex justify-between">
                                                <span className="truncate">{prod.nombre}</span>
                                                <span className="text-muted-foreground">x{prod.cantidad}</span>
                                            </div>
                                        ))}
                                        {pedido.productos.length > 2 && (
                                            <div className="text-muted-foreground text-xs">
                                                +{pedido.productos.length - 2} más...
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="flex gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="flex-1 bg-transparent">
                                                Actualizar estado
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => actualizarEstadoPedido(pedido.id, 'pendiente')}>
                                                <Clock className="mr-2 h-4 w-4" />
                                                Pendiente
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => actualizarEstadoPedido(pedido.id, 'preparacion')}>
                                                <ChefHat className="mr-2 h-4 w-4" />
                                                En preparación
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => actualizarEstadoPedido(pedido.id, 'entrega')}>
                                                <Truck className="mr-2 h-4 w-4" />
                                                Para entregar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => actualizarEstadoPedido(pedido.id, 'completado')}>
                                                ✅ Completado
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button
                                        variant="outline"
                                        onClick={() => setPedidoSeleccionado(pedido)}
                                        className="flex-1"
                                    >
                                        Ver detalle
                                    </Button>
                                </div>

                                {/* Botón de acción rápida si hay siguiente estado */}
                                {siguienteEstado && (
                                    <Button
                                        className="w-full"
                                        onClick={() => actualizarEstadoPedido(pedido.id, siguienteEstado)}
                                        size="sm"
                                    >
                                        Marcar como {getEstadoBadge(siguienteEstado).texto.toLowerCase()}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Diálogo: Detalle de Pedido Mejorado */}
            <Dialog open={!!pedidoSeleccionado} onOpenChange={() => setPedidoSeleccionado(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Pedido #{pedidoSeleccionado?.id}
                        </DialogTitle>
                        <DialogDescription>Información completa del pedido</DialogDescription>
                    </DialogHeader>

                    {pedidoSeleccionado && (
                        <div className="space-y-6">
                            {/* Información del Cliente */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Información del Cliente
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{pedidoSeleccionado.cliente.nombre}</span>
                                            </div>
                                            {pedidoSeleccionado.cliente.telefono && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    <span>{pedidoSeleccionado.cliente.telefono}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            {pedidoSeleccionado.cliente.email && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    <span>{pedidoSeleccionado.cliente.email}</span>
                                                </div>
                                            )}
                                            {pedidoSeleccionado.cliente.direccion && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span>{pedidoSeleccionado.cliente.direccion}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Información del Pedido */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Detalles del Pedido</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <div className="text-muted-foreground">Fecha</div>
                                            <div className="font-medium">{pedidoSeleccionado.fecha}</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground">Hora</div>
                                            <div className="font-medium">{pedidoSeleccionado.hora}</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground">Estado</div>
                                            <Badge className={getEstadoBadge(pedidoSeleccionado.estado).color}>
                                                {getEstadoBadge(pedidoSeleccionado.estado).texto}
                                            </Badge>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground">Método de Pago</div>
                                            <Badge variant="outline" className={getMetodoPagoBadge(pedidoSeleccionado.metodoPago)}>
                                                {pedidoSeleccionado.metodoPago}
                                            </Badge>
                                        </div>
                                    </div>

                                    {pedidoSeleccionado.notas && (
                                        <div>
                                            <div className="text-muted-foreground text-sm mb-1">Notas especiales:</div>
                                            <div className="p-3 bg-muted rounded-md text-sm">
                                                {pedidoSeleccionado.notas}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Productos */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Productos</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {pedidoSeleccionado.productos.map((producto) => (
                                            <div key={producto.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                                                        <Package className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{producto.nombre}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            C${producto.precioUnitario.toFixed(2)} c/u
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium">x{producto.cantidad}</div>
                                                    <div className="text-sm font-semibold">
                                                        C${(producto.cantidad * producto.precioUnitario).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t mt-4 pt-4">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total:</span>
                                            <span className="text-primary">C${pedidoSeleccionado.monto.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setPedidoSeleccionado(null)}
                            className="sm:flex-1"
                        >
                            Cerrar
                        </Button>
                        {pedidoSeleccionado && getSiguienteEstado(pedidoSeleccionado.estado) && (
                            <Button
                                onClick={() => {
                                    actualizarEstadoPedido(pedidoSeleccionado.id, getSiguienteEstado(pedidoSeleccionado.estado)!);
                                    setPedidoSeleccionado(null);
                                }}
                                className="sm:flex-1"
                            >
                                Marcar como {getEstadoBadge(getSiguienteEstado(pedidoSeleccionado.estado)!).texto.toLowerCase()}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PedidosActivos
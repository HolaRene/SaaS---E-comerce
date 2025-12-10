"use client"
import { useQuery, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../../../convex/_generated/api";
// Adjust Id import based on project structure if needed, or stick to loose types if generic
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, ShoppingBag, MapPin, Phone, User, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function PedidosPage() {
    const params = useParams();
    const idTienda = params.idTienda as Id<"tiendas">;

    // Fetch pending sales
    const pedidos = useQuery(api.ventas.getVentasPendientes, { tiendaId: idTienda });

    const confirmarVenta = useMutation(api.ventas.confirmarVentaOnline);
    const rechazarVenta = useMutation(api.ventas.rechazarVentaOnline);

    const [processingId, setProcessingId] = useState<Id<"ventas"> | null>(null);

    const handleConfirm = async (ventaId: Id<"ventas">) => {
        setProcessingId(ventaId);
        try {
            await confirmarVenta({ ventaId });
            toast.success("Pedido aceptado y confirmado");
        } catch (error) {
            console.error(error);
            toast.error("Error al confirmar el pedido");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (ventaId: Id<"ventas">) => {
        setProcessingId(ventaId);
        try {
            // Simplification: Not asking for reason in this UI version yet
            await rechazarVenta({ ventaId, motivo: "Rechazado por la tienda" });
            toast.info("Pedido rechazado y cancelado");
        } catch (error) {
            console.error(error);
            toast.error("Error al rechazar el pedido");
        } finally {
            setProcessingId(null);
        }
    };

    if (pedidos === undefined) {
        return <div className="p-8 text-center text-gray-500">Cargando pedidos...</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pedidos Web</h1>
                    <p className="text-gray-500 mt-1">Gestiona las órdenes pendientes de aprobación</p>
                </div>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                    {pedidos.length} Pendientes
                </Badge>
            </div>

            {pedidos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No hay pedidos pendientes</h3>
                    <p className="text-gray-500">Las nuevas órdenes aparecerán aquí.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {pedidos.map((pedido) => (
                        <PedidoCard
                            key={pedido._id}
                            pedido={pedido}
                            onConfirm={handleConfirm}
                            onReject={handleReject}
                            isProcessing={processingId === pedido._id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function PedidoCard({ pedido, onConfirm, onReject, isProcessing }: {
    pedido: any,
    onConfirm: (id: Id<"ventas">) => void,
    onReject: (id: Id<"ventas">) => void,
    isProcessing: boolean
}) {
    // Calcular tiempo transcurrido
    const fecha = new Date(pedido.fecha);
    const tiempo = fecha.toLocaleString();

    // Obtener detalles desde la venta (Assuming backend returns simplified info or we parse notes)
    // Actually, `getVentasPendientes` returns the sale object.
    // To show details, we might need another query or component.
    // Let's create a sub-component that fetches details for this sale.

    return (
        <Card className="overflow-hidden border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50/50 pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                <Clock className="w-3 h-3 mr-1" /> Pendiente
                            </Badge>
                            <span className="text-xs text-gray-500 font-mono">ID: {pedido._id.slice(-6)}</span>
                        </div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            C$ {pedido.total.toFixed(2)}
                            <span className="text-sm font-normal text-gray-500">via {pedido.metodoPago}</span>
                        </CardTitle>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center text-sm text-gray-600 justify-end gap-1">
                            <Calendar className="w-4 h-4" /> {fecha.toLocaleDateString()}
                        </div>
                        <div className="text-sm font-medium text-gray-900">{fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cliente Info */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                            <User className="w-4 h-4" /> Cliente
                        </h4>
                        <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                            <p className="font-medium text-gray-900">{pedido.clienteNombre}</p>
                            {/* Assuming we might want to fetch more contact details from a separate query if not in 'pedido' */}
                            {/* For now, relying on what we have. If notas contains info, show it */}
                        </div>
                        {pedido.notas && (
                            <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                <p className="font-medium text-yellow-800 text-xs uppercase mb-1">Notas / Envío</p>
                                {pedido.notas}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col justify-center items-end gap-3 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => onConfirm(pedido._id)}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Procesando..." : <><Check className="mr-2 h-4 w-4" /> Aceptar Pedido</>}
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                                    disabled={isProcessing}
                                >
                                    <X className="mr-2 h-4 w-4" /> Rechazar
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Rechazar este pedido?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción cancelará la venta y devolverá los productos al inventario. No se puede deshacer.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => onReject(pedido._id)} className="bg-red-600 hover:bg-red-700">
                                        Sí, Rechazar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <Separator className="my-4" />

                <DetallePedido ventaId={pedido._id} />

            </CardContent>
        </Card>
    );
}

function DetallePedido({ ventaId }: { ventaId: Id<"ventas"> }) {
    const detalle = useQuery(api.ventas.getDetalleVenta, { ventaId });

    if (!detalle) return <div className="text-sm text-gray-400">Cargando productos...</div>;

    return (
        <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Productos ({detalle.detalles.length})
            </h4>
            <div className="space-y-2">
                {detalle.detalles.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1 border-b last:border-0 border-gray-100">
                        <span className="text-gray-600">
                            <span className="font-semibold text-gray-900">{item.cantidad}x</span> {item.nombreProducto}
                        </span>
                        <span className="font-medium text-gray-900">C$ {item.subtotal.toFixed(2)}</span>
                    </div>
                ))}
            </div>
            {detalle.datosEnvio && (
                <div className="mt-4 text-xs text-gray-500 flex items-start gap-2">
                    <MapPin className="w-3 h-3 mt-0.5" />
                    <span>Envío a: {detalle.datosEnvio.direccionEntrega} {detalle.datosEnvio.telefonoComprador && `(${detalle.datosEnvio.telefonoComprador})`}</span>
                </div>
            )}
        </div>
    )
}

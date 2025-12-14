"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, FileText, Lock } from "lucide-react"
import { DataTableControlInventario } from "./data-tableCInventario"
import { columnsControlInventario } from "./columnsCInventario"
import { Id, Doc } from "../../../../../../../convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../../../../convex/_generated/api"
import { useMemo, useState } from "react"
import { toast } from "sonner"

interface Permisos {
    canManageProducts: boolean;
    canAdjustStock: boolean;
    role: string;
}

interface ControlInventarioProps {
    idTienda: Id<"tiendas">;
    productos: Doc<"productos">[];
    permisos: Permisos;
}

const ControlInventario = ({ idTienda, productos, permisos }: ControlInventarioProps) => {

    const [cargando, setCargando] = useState(false)
    const [productoSeleccionado, setProductoSeleccionado] = useState<string>("")
    const [nuevaCantidad, setNuevaCantidad] = useState<number>(0)

    const registrarMovimiento = useMutation(api.movimientos.registrarMovimiento);

    // Calcular productos con stock bajo (cantidad <= 10)
    const stockBajoData = useMemo(() => {
        if (!productos) return [];
        return productos
            .filter(producto => producto.cantidad <= 10)
            .map(producto => ({
                _id: producto._id,
                nombre: producto.nombre,
                cantidad: producto.cantidad,
            }));
    }, [productos]);

    const historial = useQuery(api.movimientos.getMovimientosByTienda, {
        tiendaId: idTienda,
        limit: 20
    });

    const manejoAjusteStock = async () => {
        if (!permisos.canAdjustStock) {
            toast.error("No tienes permisos para ajustar inventario");
            return;
        }

        try {
            if (!productoSeleccionado || nuevaCantidad === 0) {
                toast.error("Selecciona un producto y una cantidad válida");
                return;
            }

            setCargando(true);

            const producto = productos?.find(p => p._id === productoSeleccionado);
            if (!producto) {
                toast.error("Producto no encontrado");
                return;
            }

            const diferencia = nuevaCantidad - producto.cantidad;

            if (diferencia === 0) {
                toast.info("La cantidad es la misma, no hay cambios");
                return;
            }

            const tipo = diferencia > 0 ? "ENTRADA" : diferencia < 0 ? "SALIDA" : "AJUSTE";
            const razon = diferencia > 0
                ? `Ajuste manual: incremento de ${Math.abs(diferencia)} unidades`
                : `Ajuste manual: reducción de ${Math.abs(diferencia)} unidades`;

            await registrarMovimiento({
                productoId: productoSeleccionado as Id<"productos">,
                tiendaId: idTienda,
                tipo: tipo as "ENTRADA" | "SALIDA" | "AJUSTE",
                cantidad: diferencia,
                razon: razon,
                notas: "Ajuste rápido desde Control de Inventario"
            });

            toast.success(`Stock ajustado correctamente a ${nuevaCantidad} unidades`);

            setProductoSeleccionado("");
            setNuevaCantidad(0);

        } catch (error) {
            console.error(error);
            toast.error("Error al ajustar el stock");
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className='grid gap-2 grid-cols-1 md:grid-cols-2 py-3'>
            <div className="lg:col-span-2 space-y-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive" /> Alertas de Stock Bajo</CardTitle>
                        <CardDescription>Productos que requieren atención inmediata.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2 sm:grid-cols-1 lg:grid-cols-3">
                        {stockBajoData.length !== 0 ? (
                            stockBajoData.map(item => (
                                <Card key={item._id} className="p-4 flex justify-between bg-destructive/10 border-destructive max-w-screen">
                                    <div className="flex justify-between">
                                        <p className="font-semibold">{item.nombre}</p>
                                        <p className="text-sm text-destructive">Stock: {item.cantidad}</p>
                                    </div>
                                </Card>
                            ))
                        ) : (<p className="text-2xl text-center col-span-3">No hay productos en stock bajo</p>)}
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card className={!permisos.canAdjustStock ? "opacity-75" : ""}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Ajuste Rápido de Stock
                            {!permisos.canAdjustStock && <Lock className="h-4 w-4 text-muted-foreground" />}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select
                            value={productoSeleccionado}
                            onValueChange={setProductoSeleccionado}
                            disabled={!permisos.canAdjustStock}
                        >
                            <SelectTrigger><SelectValue placeholder="Seleccionar producto..." /></SelectTrigger>
                            <SelectContent>
                                {productos.length === 0 ? (
                                    <SelectItem value="empty" disabled>No hay productos</SelectItem>
                                ) : (
                                    productos.map(p => <SelectItem key={p._id} value={p._id}>{p.nombre} (Stock actual: {p.cantidad})</SelectItem>)
                                )}
                            </SelectContent>
                        </Select>
                        <Input
                            type="number"
                            placeholder="Cantidad nueva en stock"
                            value={nuevaCantidad || ""}
                            onChange={(e) => setNuevaCantidad(parseInt(e.target.value) || 0)}
                            disabled={!permisos.canAdjustStock}
                        />
                        <Button
                            className="w-full"
                            onClick={manejoAjusteStock}
                            disabled={cargando || !productoSeleccionado || !permisos.canAdjustStock}
                        >
                            {cargando ? "Ajustando..." : "Guardar Ajuste"}
                        </Button>
                        {!permisos.canAdjustStock && (
                            <p className="text-xs text-muted-foreground text-center">Permiso requerido: Propietario o Vendedor</p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Historial de Cambios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {historial === undefined ? (
                            <p className="text-muted-foreground">Cargando historial...</p>
                        ) : historial.length === 0 ? (
                            <p className="text-muted-foreground">No hay cambios registrados</p>
                        ) : (
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {historial.slice(0, 5).map((h) => (
                                    <li key={h._id} className="flex items-start gap-2">
                                        <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <span>{new Date(h.fecha).toLocaleDateString()} – {h.razon} - {h.productoNombre}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Movimientos de Inventario</CardTitle>
                </CardHeader>
                <CardContent>
                    {historial === undefined ? (
                        <p className="text-center py-4 text-muted-foreground">Cargando movimientos...</p>
                    ) : historial.length === 0 ? (
                        <p className="text-center py-4 text-muted-foreground">No hay movimientos registrados</p>
                    ) : (
                        <DataTableControlInventario columns={columnsControlInventario} data={historial} />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default ControlInventario
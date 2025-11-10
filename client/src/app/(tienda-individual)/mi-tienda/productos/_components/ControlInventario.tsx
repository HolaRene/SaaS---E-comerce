"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, FileText } from "lucide-react"
import { DataTableControlInventario } from "./data-tableCInventario"
import { columnsControlInventario } from "./columnsCInventario"
import { productos } from "@/lib/tiendas-datos"
import { Producto } from "@/types/tipado_comercio"
import { productoActualizado, productoagregar, productoEliminado } from "@/services/historial-cambios-tienda"

// productos
const productosData = productos

function getStockBajoData(products: Producto[], limiteStock: number = 10) {
    return products
        .filter(producto => producto.stock <= limiteStock)
        .map(producto => ({
            id: parseInt(producto.id) || producto.id, // Maneja IDs no numéricos
            nombre: producto.nombre,
            stock: producto.stock,
            //   estado: producto.estado // Opcional: agregar estado
        }));
}

// Uso
const stockBajoData = getStockBajoData(productosData, 10);
const w = productoActualizado
const x = productoEliminado
console.log(w)
const yy = productoagregar
console.log(yy)
console.log(x)

const historialCambiosData = [
    "03/10/2025 – Se actualizó el stock de Pan Dulce de 40 a 50 unidades.",
    "02/10/2025 – Producto nuevo agregado: Café Tradicional.",
    "01/10/2025 – Se eliminó el producto 'Galletas ChocoChip'.",
];


const movimientosData = [
    { id: 1, fecha: "05/10/2025", producto: "Pan Dulce", tipo: "Entrada", cantidad: 20, usuario: "José Espinoza" },
    { id: 2, fecha: "04/10/2025", producto: "Refresco 1L", tipo: "Salida", cantidad: 15, usuario: "María López" },
    { id: 3, fecha: "04/10/2025", producto: "Arroz 5 Lbs", tipo: "Entrada", cantidad: 50, usuario: "José Espinoza" },
    { id: 4, fecha: "03/10/2025", producto: "Café Tradicional", tipo: "Ajuste", cantidad: -2, usuario: "Admin" },
];

const ControlInventario = () => {
    return (
        <div className='grid gap-2 grid-cols-1 md:grid-cols-2 py-3'>
            <div className="lg:col-span-2 space-y-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive" /> Alertas de Stock Bajo</CardTitle>
                        <CardDescription>Productos que requieren atención inmediata.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2 sm:grid-cols-1 lg:grid-cols-3">
                        {
                            stockBajoData.length !== 0 ? (
                                stockBajoData.map(item => (
                                    <Card key={item.id} className="p-4 flex justify-between bg-destructive/10 border-destructive max-w-screen">
                                        <div className="flex justify-between">
                                            <p className="font-semibold">{item.nombre}</p>
                                            <p className="text-sm text-destructive">Stock: {item.stock}</p>
                                        </div>
                                        <Button size="sm" variant="secondary" className="cursor-pointer">Reabastecer</Button>
                                    </Card>
                                ))
                            ) : (<p className="text-2xl text-center">No hay productos en stock bajo</p>)
                        }
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Ajuste Rápido de Stock</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Seleccionar producto..." /></SelectTrigger>
                            <SelectContent>
                                {productosData.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.nombre}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Input type="number" placeholder="Cantidad nueva en stock" />
                        <Button className="w-full" onClick={() => alert("Stock actualizado con éxito.")}>Guardar Ajuste</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Historial de Cambios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {historialCambiosData.map((item, i) => <li key={i} className="flex items-start gap-2"><FileText className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>{item}</span></li>)}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Movimientos de Inventario</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTableControlInventario columns={columnsControlInventario} data={movimientosData} />
                </CardContent>
            </Card>
        </div>
    )
}

export default ControlInventario
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, FileText } from "lucide-react"
import { DataTableControlInventario } from "./data-tableCInventario"
import { columnsControlInventario } from "./columnsCInventario"

// --- Datos Estáticos ---
const stockBajoData = [
    { id: 1, nombre: "Refresco 1L", stock: 0 },
    { id: 2, nombre: "Café Tradicional", stock: 5 },
    { id: 3, nombre: "Jabón de Baño", stock: 8 },
];

const historialCambiosData = [
    "03/10/2025 – Se actualizó el stock de Pan Dulce de 40 a 50 unidades.",
    "02/10/2025 – Producto nuevo agregado: Café Tradicional.",
    "01/10/2025 – Se eliminó el producto 'Galletas ChocoChip'.",
];


const catalogoData = [
    { id: 1, img: "https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg", nombre: "Pan Dulce", categoria: "Panadería", precio: 25.00, stock: 50, estado: "Disponible" },
    { id: 2, img: "https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg", nombre: "Refresco 1L", categoria: "Bebidas", precio: 35.00, stock: 0, estado: "Agotado" },
    { id: 3, img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg", nombre: "Café Tradicional", categoria: "Abarrotes", precio: 120.00, stock: 12, estado: "Disponible" },
    { id: 4, img: "https://images.pexels.com/photos/5946968/pexels-photo-5946968.jpeg", nombre: "Arroz 5 Lbs", categoria: "Abarrotes", precio: 85.00, stock: 150, estado: "Disponible" },
    { id: 5, img: "https://images.pexels.com/photos/7624423/pexels-photo-7624423.jpeg", nombre: "Jabón de Baño", categoria: "Limpieza", precio: 40.00, stock: 8, estado: "Stock bajo" },
];

const movimientosData = [
    { id: 1, fecha: "05/10/2025", producto: "Pan Dulce", tipo: "Entrada", cantidad: 20, usuario: "José Espinoza" },
    { id: 2, fecha: "04/10/2025", producto: "Refresco 1L", tipo: "Salida", cantidad: 15, usuario: "María López" },
    { id: 3, fecha: "04/10/2025", producto: "Arroz 5 Lbs", tipo: "Entrada", cantidad: 50, usuario: "José Espinoza" },
    { id: 4, fecha: "03/10/2025", producto: "Café Tradicional", tipo: "Ajuste", cantidad: -2, usuario: "Admin" },
];

const ControlInventario = () => {
    return (
        <div className='grid gap-2 grid-cols-1 md:grid-cols-2'>
            <div className="lg:col-span-2 space-y-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive" /> Alertas de Stock Bajo</CardTitle>
                        <CardDescription>Productos que requieren atención inmediata.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2 sm:grid-cols-1 lg:grid-cols-3">
                        {stockBajoData.map(item => (
                            <Card key={item.id} className="p-4 flex justify-between bg-destructive/10 border-destructive max-w-screen">
                                <div className="flex justify-between">
                                    <p className="font-semibold">{item.nombre}</p>
                                    <p className="text-sm text-destructive">Stock: {item.stock}</p>
                                </div>
                                <Button size="sm" variant="secondary" className="cursor-pointer">Reabastecer</Button>
                            </Card>
                        ))}
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
                                {catalogoData.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.nombre}</SelectItem>)}
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
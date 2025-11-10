"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Calendar } from "lucide-react"

// Rotación de inventario con entradas, salidas y días en stock
const rotacionInventario = [
    { producto: "Pan Dulce", entradas: 200, salidas: 190, stock: 10, dias: 2 },
    { producto: "Refresco 1L", entradas: 300, salidas: 295, stock: 5, dias: 1 },
    { producto: "Arroz 1kg", entradas: 150, salidas: 140, stock: 10, dias: 3 },
    { producto: "Café 500g", entradas: 80, salidas: 75, stock: 5, dias: 2 },
    { producto: "Aceite 1L", entradas: 100, salidas: 85, stock: 15, dias: 5 },
]

// Productos sin movimiento (stock estancado)
const stockEstancado = [
    { producto: "Aceite Vegetal 1L", unidades: 15, diasSinVenta: 20 },
    { producto: "Salsa de Tomate", unidades: 8, diasSinVenta: 15 },
    { producto: "Galletas Premium", unidades: 12, diasSinVenta: 18 },
]
// Comparación de precios con el mercado
const comparacionPrecios = [
    { producto: "Pan Dulce", miPrecio: 25.0, promedioMercado: 27.0, diferencia: -2.0 },
    { producto: "Refresco 1L", miPrecio: 35.0, promedioMercado: 33.5, diferencia: 1.5 },
    { producto: "Arroz 1kg", miPrecio: 42.0, promedioMercado: 43.0, diferencia: -1.0 },
    { producto: "Café 500g", miPrecio: 85.0, promedioMercado: 87.0, diferencia: -2.0 },
]

const DesenpenioProductos = () => {
    return (
        <div className='space-y-3'>
            {/* Rotación de inventario */}
            <Card>
                <CardHeader>
                    <CardTitle>Rotación de Inventario</CardTitle>
                    <CardDescription>Movimiento de productos en el período</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead className="text-center">Entradas</TableHead>
                                <TableHead className="text-center">Salidas</TableHead>
                                <TableHead className="text-center">Stock Actual</TableHead>
                                <TableHead className="text-right">Días en Inventario</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rotacionInventario.map((item) => (
                                <TableRow key={item.producto}>
                                    <TableCell className="font-medium">{item.producto}</TableCell>
                                    <TableCell className="text-center">{item.entradas}</TableCell>
                                    <TableCell className="text-center">{item.salidas}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={item.stock < 10 ? "destructive" : "secondary"}>{item.stock}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{item.dias} días</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Stock estancado */}
                <Card>
                    <CardHeader>
                        <CardTitle>Stock Estancado</CardTitle>
                        <CardDescription>Productos sin movimiento reciente</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {stockEstancado.map((item) => (
                            <div key={item.producto} className="flex items-start gap-4 p-4 border rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium">{item.producto}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {item.unidades} unidades — {item.diasSinVenta} días sin venta
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Comparación de precios */}
                <Card>
                    <CardHeader>
                        <CardTitle>Precios vs Competencia</CardTitle>
                        <CardDescription>Comparación con el promedio del mercado</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead className="text-right">Mi Precio</TableHead>
                                    <TableHead className="text-right">Mercado</TableHead>
                                    <TableHead className="text-right">Diferencia</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {comparacionPrecios.map((item) => (
                                    <TableRow key={item.producto}>
                                        <TableCell className="font-medium">{item.producto}</TableCell>
                                        <TableCell className="text-right">C${item.miPrecio.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">C${item.promedioMercado.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={item.diferencia < 0 ? "default" : "secondary"}>
                                                {item.diferencia > 0 ? "+" : ""}C${item.diferencia.toFixed(2)}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Productos estacionales */}
            <Card>
                <CardHeader>
                    <CardTitle>Productos Estacionales</CardTitle>
                    <CardDescription>Productos con demanda variable según temporada</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                <h4 className="font-semibold">Rosquillas</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">Alta demanda en agosto-septiembre</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                <h4 className="font-semibold">Nacatamales</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">Picos de venta en diciembre</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default DesenpenioProductos
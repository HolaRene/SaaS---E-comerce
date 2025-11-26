"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "lucide-react"
import { Id } from "../../../../../../../convex/_generated/dataModel"

import { useQuery } from "convex/react"
import { api } from "../../../../../../../convex/_generated/api"
import StockEstancado from "./StockEstancado"
import RotacionInventario from "./RotacionInventario"

// Valores por defecto mientras cargan las queries
const emptyPrices: Array<{ producto: string; miPrecio: number; promedioMercado: number; diferencia: number }> = []

const DesenpenioProductos = ({ idTienda }: { idTienda: Id<"tiendas"> }) => {
    const id = idTienda

    // Queries Convex
    const comparacionPreciosQuery = useQuery(api.productos.getComparacionPreciosByTienda, { tiendaId: id, limit: 10 })

    const comparacionPrecios = comparacionPreciosQuery ?? emptyPrices

    return (
        <div className='space-y-3'>
            {/* Rotación de inventario: tabla reutilizable */}
            <Card>
                <CardHeader>
                    <CardTitle>Rotación de Inventario</CardTitle>
                    <CardDescription>Movimiento de productos en el período</CardDescription>
                </CardHeader>
                <CardContent>
                    <RotacionInventario idTienda={id} />
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Stock estancado: tabla reutilizable */}
                <Card>
                    <CardHeader>
                        <CardTitle>Stock Estancado</CardTitle>
                        <CardDescription>Productos sin movimiento reciente</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <StockEstancado idTienda={id} />
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
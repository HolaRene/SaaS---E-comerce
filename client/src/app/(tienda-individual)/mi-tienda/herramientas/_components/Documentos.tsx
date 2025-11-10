"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DollarSign, Edit, FileDown, FileSignature, FileText, Layout, Share2 } from "lucide-react"
import { toast } from "react-toastify"


interface Producto {
    nombre: string
    precio: number
    ultimaActualizacion: string
}

const productosLista: Producto[] = [
    { nombre: "Pan Dulce", precio: 25.0, ultimaActualizacion: "05/10/2025" },
    { nombre: "Refresco 1L", precio: 35.0, ultimaActualizacion: "04/10/2025" },
    { nombre: "Arroz 1lb", precio: 18.0, ultimaActualizacion: "03/10/2025" },
    { nombre: "Frijoles 1lb", precio: 22.0, ultimaActualizacion: "03/10/2025" },
    { nombre: "Aceite 1L", precio: 95.0, ultimaActualizacion: "02/10/2025" },
    { nombre: "Azúcar 1lb", precio: 15.0, ultimaActualizacion: "02/10/2025" },
    { nombre: "Café molido 250g", precio: 65.0, ultimaActualizacion: "01/10/2025" },
    { nombre: "Leche 1L", precio: 45.0, ultimaActualizacion: "05/10/2025" },
]

const Documentos = () => {

    const handleGenerarPDF = () => {
        toast.success("El documento PDF ha sido generado exitosamente.")
    }

    const handleGenerarContrato = () => {
        toast.success("El contrato ha sido generado exitosamente.")
    }

    const handleExportarListaPrecios = () => {
        toast.success("La lista de precios ha sido exportada a PDF.")
    }

    const handleCompartirListaPrecios = () => {
        toast.success("La lista de precios ha sido compartida por WhatsApp.")
    }

    return (
        <Tabs defaultValue="pdf" className="space-y-6">
            <div className="w-full overflow-x-auto pl-4 pr-6">
                <TabsList className="flex w-max py-2 [&>button]:flex-shrink-0">
                    <TabsTrigger value="pdf" className="whitespace-nowrap px-3">
                        <FileText className="h-4 w-4 mr-1" />
                        PDFs
                    </TabsTrigger>
                    <TabsTrigger value="formatos" className="whitespace-nowrap px-3">
                        <Layout className="h-4 w-4 mr-1" />
                        Formatos
                    </TabsTrigger>
                    <TabsTrigger value="contratos" className="whitespace-nowrap px-3">
                        <FileSignature className="h-4 w-4 mr-1" />
                        Contratos
                    </TabsTrigger>
                    <TabsTrigger value="precios" className="whitespace-nowrap px-3">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Precios
                    </TabsTrigger>
                </TabsList>
            </div>

            {/* Sub-tab: Generador de PDF */}
            <TabsContent value="pdf">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Generador de PDF
                        </CardTitle>
                        <CardDescription>Crea documentos PDF personalizados</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="titulo-pdf">Título del documento</Label>
                            <Input id="titulo-pdf" placeholder="Ej: Factura de venta" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contenido-pdf">Contenido</Label>
                            <Textarea
                                id="contenido-pdf"
                                placeholder="Escribe el contenido del documento..."
                                className="min-h-[200px]"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleGenerarPDF} className="flex-1">
                                <FileDown className="h-4 w-4 mr-2" />
                                Generar PDF
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Vista previa</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Vista Previa del Documento</DialogTitle>
                                    </DialogHeader>
                                    <div className="border rounded-lg p-6 bg-white dark:bg-gray-900">
                                        <div className="space-y-4">
                                            <div className="text-center border-b pb-4">
                                                <h2 className="text-2xl font-bold">Don Pulpería</h2>
                                                <p className="text-sm text-muted-foreground">Managua, Nicaragua</p>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg mb-2">Factura de Venta</h3>
                                                <p className="text-sm">Fecha: 05/10/2025</p>
                                                <p className="text-sm">Cliente: Juan Pérez</p>
                                            </div>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Producto</TableHead>
                                                        <TableHead>Cantidad</TableHead>
                                                        <TableHead>Precio</TableHead>
                                                        <TableHead>Total</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>Pan Dulce</TableCell>
                                                        <TableCell>5</TableCell>
                                                        <TableCell>C$25.00</TableCell>
                                                        <TableCell>C$125.00</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Refresco 1L</TableCell>
                                                        <TableCell>2</TableCell>
                                                        <TableCell>C$35.00</TableCell>
                                                        <TableCell>C$70.00</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                            <div className="text-right border-t pt-4">
                                                <p className="font-bold text-lg">Total: C$195.00</p>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Sub-tab: Formatos Pre-diseñados */}
            <TabsContent value="formatos">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Factura Simple</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm text-muted-foreground">Formato básico de factura con productos y totales</p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                    Usar formato
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Recibo de Compra</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm text-muted-foreground">Recibo simple para compras al contado</p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                    Usar formato
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Lista de Productos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm text-muted-foreground">Catálogo de productos con precios actualizados</p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                    Usar formato
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            {/* Sub-tab: Contratos Simples */}
            <TabsContent value="contratos">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Contratos Simples
                        </CardTitle>
                        <CardDescription>Genera contratos básicos para tu negocio</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="nombre-contrato">Nombre del contrato</Label>
                                <Input id="nombre-contrato" placeholder="Ej: Acuerdo de crédito" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cliente-contrato">Cliente</Label>
                                <Input id="cliente-contrato" placeholder="Nombre del cliente" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="monto-contrato">Monto</Label>
                                <Input id="monto-contrato" type="number" placeholder="C$" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fecha-contrato">Fecha</Label>
                                <Input id="fecha-contrato" type="date" />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2">
                            <Button onClick={handleGenerarContrato} className="flex-1">
                                <FileDown className="h-4 w-4 mr-2" />
                                Generar contrato
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Vista previa</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Vista Previa del Contrato</DialogTitle>
                                    </DialogHeader>
                                    <div className="border rounded-lg p-6 bg-white dark:bg-gray-900 space-y-4">
                                        <div className="text-center">
                                            <h2 className="text-xl font-bold">ACUERDO DE CRÉDITO</h2>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <p>
                                                En la ciudad de Managua, Nicaragua, a los 05 días del mes de octubre del año 2025, entre:
                                            </p>
                                            <p>
                                                <strong>EL ACREEDOR:</strong> Don Pulpería, representado por su propietario.
                                            </p>
                                            <p>
                                                <strong>EL DEUDOR:</strong> Juan Pérez, mayor de edad, con cédula de identidad
                                                001-010180-0001N.
                                            </p>
                                            <p>Ambas partes acuerdan lo siguiente:</p>
                                            <p>
                                                <strong>PRIMERO:</strong> El acreedor otorga al deudor un crédito por la suma de C$500.00
                                                (Quinientos córdobas netos).
                                            </p>
                                            <p>
                                                <strong>SEGUNDO:</strong> El deudor se compromete a pagar la suma total en un plazo máximo
                                                de 30 días calendario.
                                            </p>
                                            <p>
                                                <strong>TERCERO:</strong> En caso de incumplimiento, se aplicarán los términos acordados
                                                verbalmente entre las partes.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8 pt-8">
                                            <div className="text-center">
                                                <div className="border-t border-gray-400 pt-2">
                                                    <p className="text-sm font-medium">Firma del Acreedor</p>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="border-t border-gray-400 pt-2">
                                                    <p className="text-sm font-medium">Firma del Deudor</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Sub-tab: Listas de Precios */}
            <TabsContent value="precios">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Listas de Precios
                                </CardTitle>
                                <CardDescription>Gestiona y comparte tus precios actualizados</CardDescription>
                            </div>
                            <div className="flex flex-col md:flex-row gap-2">
                                <Button onClick={handleExportarListaPrecios} variant="outline">
                                    <FileDown className="h-4 w-4 mr-2" />
                                    Exportar PDF
                                </Button>
                                <Button onClick={handleCompartirListaPrecios}>
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Compartir
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Precio Actual</TableHead>
                                    <TableHead>Última Actualización</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productosLista.map((producto, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{producto.nombre}</TableCell>
                                        <TableCell>C${producto.precio.toFixed(2)}</TableCell>
                                        <TableCell className="text-muted-foreground">{producto.ultimaActualizacion}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}

export default Documentos
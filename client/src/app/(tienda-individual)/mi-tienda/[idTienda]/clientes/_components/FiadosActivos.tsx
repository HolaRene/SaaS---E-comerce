"use client"

import { AlertTriangle, CheckCircle, Clock, DollarSign, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Fiado {
    id: number
    clienteId: number
    clienteNombre: string
    limiteCredito: number
    saldoActual: number
    ultimoPago: string
    estado: "pendiente" | "pagado" | "atrasado"
    historialPagos: {
        fecha: string
        monto: number
        nota?: string
    }[]
}

const fiados: Fiado[] = [
    {
        id: 1,
        clienteId: 1,
        clienteNombre: "Juan Pérez",
        limiteCredito: 1000,
        saldoActual: 350,
        ultimoPago: "03/10/2025",
        estado: "pendiente",
        historialPagos: [
            { fecha: "02/10/2025", monto: 200, nota: "Abono parcial" },
            { fecha: "04/10/2025", monto: 150, nota: "Abono" },
        ],
    },
    {
        id: 2,
        clienteId: 4,
        clienteNombre: "María Rodríguez",
        limiteCredito: 500,
        saldoActual: 0,
        ultimoPago: "04/10/2025",
        estado: "pagado",
        historialPagos: [
            { fecha: "28/09/2025", monto: 300, nota: "Pago completo" },
            { fecha: "04/10/2025", monto: 200, nota: "Liquidación" },
        ],
    },
    {
        id: 3,
        clienteId: 3,
        clienteNombre: "Carlos López",
        limiteCredito: 800,
        saldoActual: 420,
        ultimoPago: "01/10/2025",
        estado: "atrasado",
        historialPagos: [
            { fecha: "15/09/2025", monto: 180, nota: "Abono" },
            { fecha: "01/10/2025", monto: 200, nota: "Abono parcial" },
        ],
    },
    {
        id: 4,
        clienteId: 2,
        clienteNombre: "Ana López",
        limiteCredito: 600,
        saldoActual: 320,
        ultimoPago: "05/10/2025",
        estado: "pendiente",
        historialPagos: [{ fecha: "28/09/2025", monto: 230, nota: "Abono" }],
    },
    {
        id: 5,
        clienteId: 5,
        clienteNombre: "Roberto Silva",
        limiteCredito: 400,
        saldoActual: 280,
        ultimoPago: "04/10/2025",
        estado: "pendiente",
        historialPagos: [{ fecha: "20/09/2025", monto: 120, nota: "Abono inicial" }],
    },
]

const FiadosActivos = () => {

    const totalAdeudado = fiados.reduce((sum, f) => sum + f.saldoActual, 0)
    const creditosActivos = fiados.filter((f) => f.saldoActual > 0).length
    const promedioCliente = creditosActivos > 0 ? totalAdeudado / creditosActivos : 0

    return (
        <div className='space-y-6'>
            {/* Resumen de créditos */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Créditos Activos</CardTitle>
                        <Users className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{creditosActivos} clientes</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Adeudado</CardTitle>
                        <DollarSign className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">C${totalAdeudado.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Promedio por Cliente</CardTitle>
                        <TrendingUp className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">C${promedioCliente.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Alertas de vencimiento */}
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Alertas de Vencimiento
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                            <div>
                                <p className="font-medium">Carlos López</p>
                                <p className="text-muted-foreground text-sm">Saldo: C$420</p>
                            </div>
                            <Badge variant="destructive">Vencido</Badge>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-3">
                            <div>
                                <p className="font-medium">Ana López</p>
                                <p className="text-muted-foreground text-sm">Saldo: C$320</p>
                            </div>
                            <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                                Por vencer en 2 días
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabla de fiados */}
            <Card>
                <CardHeader>
                    <CardTitle>Control de Créditos</CardTitle>
                    <CardDescription>Gestión de cuentas por cobrar</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Límite de Crédito</TableHead>
                                <TableHead>Saldo Actual</TableHead>
                                <TableHead>Último Pago</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fiados.map((fiado) => (
                                <TableRow key={fiado.id}>
                                    <TableCell className="font-medium">{fiado.clienteNombre}</TableCell>
                                    <TableCell>C${fiado.limiteCredito.toLocaleString()}</TableCell>
                                    <TableCell>C${fiado.saldoActual.toLocaleString()}</TableCell>
                                    <TableCell>{fiado.ultimoPago}</TableCell>
                                    <TableCell>
                                        {fiado.estado === "pagado" && (
                                            <Badge variant="default" className="gap-1">
                                                <CheckCircle className="h-3 w-3" />
                                                Pagado
                                            </Badge>
                                        )}
                                        {fiado.estado === "pendiente" && (
                                            <Badge variant="secondary" className="gap-1">
                                                <Clock className="h-3 w-3" />
                                                Pendiente
                                            </Badge>
                                        )}
                                        {fiado.estado === "atrasado" && (
                                            <Badge variant="destructive" className="gap-1">
                                                <AlertTriangle className="h-3 w-3" />
                                                Atrasado
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        divulo
                                        {/* <Drawer>
                            <DrawerTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedFiado(fiado)}>
                                Ver Cuenta
                              </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                              <DrawerHeader>
                                <DrawerTitle>Cuenta de {fiado.clienteNombre}</DrawerTitle>
                                <DrawerDescription>Historial de pagos y gestión de crédito</DrawerDescription>
                              </DrawerHeader>
                              {selectedFiado && (
                                <div className="space-y-6 p-4"> */}
                                        {/* Resumen de cuenta */}
                                        {/* <div className="grid gap-4 md:grid-cols-3">
                                    <Card>
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">Límite de Crédito</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <p className="text-2xl font-bold">
                                          C${selectedFiado.limiteCredito.toLocaleString()}
                                        </p>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">Saldo Actual</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <p className="text-2xl font-bold text-destructive">
                                          C${selectedFiado.saldoActual.toLocaleString()}
                                        </p>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">Crédito Disponible</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <p className="text-2xl font-bold text-green-600">
                                          C${(selectedFiado.limiteCredito - selectedFiado.saldoActual).toLocaleString()}
                                        </p>
                                      </CardContent>
                                    </Card>
                                  </div> */}

                                        {/* Historial de pagos */}
                                        {/* <div>
                                    <h4 className="mb-3 font-medium">Historial de Pagos</h4>
                                    <div className="space-y-3">
                                      {selectedFiado.historialPagos.map((pago, idx) => (
                                        <div key={idx} className="flex items-start gap-3 rounded-lg border p-3">
                                          <div className="bg-primary/10 text-primary rounded-full p-2">
                                            <Calendar className="h-4 w-4" />
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                              <p className="font-medium">{pago.fecha}</p>
                                              <p className="text-lg font-bold text-green-600">
                                                +C${pago.monto.toLocaleString()}
                                              </p>
                                            </div>
                                            {pago.nota && <p className="text-muted-foreground text-sm">{pago.nota}</p>}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div> */}

                                        {/* Registrar nuevo pago */}
                                        {/* <div className="space-y-3">
                                    <Label>Registrar Nuevo Pago</Label>
                                    <div className="flex gap-2">
                                      <Input
                                        type="number"
                                        placeholder="Monto"
                                        value={nuevoPago}
                                        onChange={(e) => setNuevoPago(e.target.value)}
                                      />
                                      <Button onClick={handleRegistrarPago}>Registrar</Button>
                                    </div>
                                  </div>
                                </div> */}
                                        {/* )} */}
                                        {/* <DrawerFooter>
                                <DrawerClose asChild>
                                  <Button variant="outline">Cerrar</Button>
                                </DrawerClose>
                              </DrawerFooter>
                            </DrawerContent>
                          </Drawer> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default FiadosActivos
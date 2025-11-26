"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { AlertTriangle, CheckCircle, Clock, DollarSign, TrendingUp, Users, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { api } from "../../../../../../../convex/_generated/api"
import { Id } from "../../../../../../../convex/_generated/dataModel"

const FiadosActivos = ({ idTienda }: { idTienda: Id<"tiendas"> }) => {
  const [selectedCreditoId, setSelectedCreditoId] = useState<Id<"creditos"> | null>(null)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "tarjeta" | "transferencia">("efectivo")
  const [paymentNotes, setPaymentNotes] = useState("")

  // Queries
  const creditos = useQuery(api.creditos.getCreditosByTienda, {
    tiendaId: idTienda,
    estado: "activo"
  })

  const estadisticas = useQuery(api.creditos.getEstadisticasCreditos, {
    tiendaId: idTienda
  })

  const creditoDetalle = useQuery(
    api.creditos.getCreditoDetalle,
    selectedCreditoId ? { creditoId: selectedCreditoId } : "skip"
  )

  // Mutations
  const registrarPago = useMutation(api.creditos.registrarPago)

  // Handlers
  const handleRegistrarPago = async () => {
    if (!selectedCreditoId) return

    try {
      const monto = parseFloat(paymentAmount)
      if (isNaN(monto) || monto <= 0) {
        toast.error("Ingresa un monto válido")
        return
      }

      await registrarPago({
        creditoId: selectedCreditoId,
        monto,
        metodoPago: paymentMethod,
        notas: paymentNotes || undefined
      })

      toast.success("Pago registrado exitosamente")
      setIsPaymentDialogOpen(false)
      setPaymentAmount("")
      setPaymentNotes("")
      setSelectedCreditoId(null)
    } catch (error) {
      toast.error("Error al registrar el pago")
      console.error(error)
    }
  }

  const handleOpenPaymentDialog = (creditoId: Id<"creditos">) => {
    setSelectedCreditoId(creditoId)
    setIsPaymentDialogOpen(true)
  }

  // Determinar si un crédito está vencido
  const isVencido = (fechaVencimiento?: string) => {
    if (!fechaVencimiento) return false
    return new Date(fechaVencimiento) < new Date()
  }

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
            {estadisticas === undefined ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{estadisticas.totalCreditosActivos} clientes</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Adeudado</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            {estadisticas === undefined ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">C${estadisticas.totalAdeudado.toLocaleString()}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Cliente</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            {estadisticas === undefined ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">C${estadisticas.promedioCliente.toFixed(2)}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alertas de vencimiento */}
      {estadisticas && estadisticas.creditosVencidos > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Vencimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {creditos?.filter(c => isVencido(c.fechaVencimiento)).map((credito) => (
                <div key={credito._id} className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                  <div>
                    <p className="font-medium">{credito.clienteNombre}</p>
                    <p className="text-muted-foreground text-sm">Saldo: C${credito.saldoActual.toLocaleString()}</p>
                  </div>
                  <Badge variant="destructive">Vencido</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de fiados */}
      <Card>
        <CardHeader>
          <CardTitle>Control de Créditos</CardTitle>
          <CardDescription>Gestión de cuentas por cobrar</CardDescription>
        </CardHeader>
        <CardContent>
          {creditos === undefined ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : creditos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay créditos activos
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Límite de Crédito</TableHead>
                  <TableHead>Saldo Actual</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditos.map((credito) => (
                  <TableRow key={credito._id}>
                    <TableCell className="font-medium">{credito.clienteNombre}</TableCell>
                    <TableCell>C${credito.limiteCredito.toLocaleString()}</TableCell>
                    <TableCell>C${credito.saldoActual.toLocaleString()}</TableCell>
                    <TableCell>
                      {credito.fechaVencimiento
                        ? new Date(credito.fechaVencimiento).toLocaleDateString('es-NI')
                        : "-"
                      }
                    </TableCell>
                    <TableCell>
                      {isVencido(credito.fechaVencimiento) ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Vencido
                        </Badge>
                      ) : credito.saldoActual === 0 ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Pagado
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Activo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenPaymentDialog(credito._id)}
                      >
                        Registrar Pago
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de registro de pago */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pago</DialogTitle>
            <DialogDescription>
              {creditoDetalle && `Cliente: ${creditoDetalle.cliente?.nombre} - Saldo: C$${creditoDetalle.saldoActual.toLocaleString()}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Monto del pago *</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                min="0"
                step="0.01"
              />
              {creditoDetalle && (
                <p className="text-sm text-muted-foreground">
                  Saldo actual: C${creditoDetalle.saldoActual.toLocaleString()}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Método de pago</Label>
              <Select value={paymentMethod} onValueChange={(value: "efectivo" | "tarjeta" | "transferencia") => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="tarjeta">Tarjeta</SelectItem>
                  <SelectItem value="transferencia">Transferencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notas (opcional)</Label>
              <Input
                placeholder="Abono parcial, pago completo, etc."
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
              />
            </div>

            {/* Historial de pagos */}
            {creditoDetalle && creditoDetalle.historialPagos && creditoDetalle.historialPagos.length > 0 && (
              <div className="space-y-2">
                <Label>Historial de pagos</Label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {creditoDetalle.historialPagos.map((pago, idx) => (
                    <div key={idx} className="flex justify-between text-sm border-b pb-2">
                      <div>
                        <p className="font-medium">{new Date(pago.fecha).toLocaleDateString('es-NI')}</p>
                        {pago.notas && <p className="text-muted-foreground text-xs">{pago.notas}</p>}
                      </div>
                      <p className="font-bold text-green-600">+C${pago.monto.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button className="w-full" onClick={handleRegistrarPago}>
              Registrar Pago
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FiadosActivos
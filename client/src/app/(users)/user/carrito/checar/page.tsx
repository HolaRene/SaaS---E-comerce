"use client"

import { useState, useEffect, Suspense } from "react"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { useUser } from "@clerk/nextjs"
import { api } from "../../../../../../convex/_generated/api"
import { toast } from "sonner"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// Zod schemas
const shippingSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    telefono: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
    direccion: z.string().min(10, "La dirección debe tener al menos 10 caracteres"),
    ciudad: z.string().min(3, "La ciudad debe tener al menos 3 caracteres"),
    notas: z.string().optional(),
})

const paymentSchema = z.object({
    metodoPago: z.enum(["efectivo", "transferencia", "fiado"]),
})

type ShippingFormData = z.infer<typeof shippingSchema>
type PaymentFormData = z.infer<typeof paymentSchema>

function CheckoutContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const selectedStore = searchParams.get("tienda") || "all"

    const [step, setStep] = useState(1)
    const { user: clerkUser } = useUser()

    // Obtener usuario primero
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : 'skip'
    )

    // Forms
    const shippingForm = useForm<ShippingFormData>({
        resolver: zodResolver(shippingSchema),
        defaultValues: {
            nombre: "",
            telefono: "",
            direccion: "",
            ciudad: "",
            notas: "",
        },
    })

    const paymentForm = useForm<PaymentFormData>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            metodoPago: "transferencia",
        },
    })

    // Pre-llenar formulario con datos del usuario
    useEffect(() => {
        if (usuario) {
            shippingForm.setValue("nombre", `${usuario.nombre} ${usuario.apellido}`);
            shippingForm.setValue("telefono", usuario.numTelefono || "");
        }
    }, [usuario, shippingForm])

    const carritoItems = useQuery(
        api.carrito.getCarritoByUsuario,
        usuario?._id ? { usuarioId: usuario._id } : 'skip'
    )

    // Mutations
    const crearVentaOnline = useMutation(api.ventas.crearVentaOnline)
    const vaciarCarritoPorTienda = useMutation(api.carrito.vaciarCarritoPorTienda)

    // Filter items by selected store
    const filteredItems = selectedStore === "all"
        ? carritoItems || []
        : (carritoItems || []).filter((item) => item.tienda?.nombre === selectedStore)

    const subtotal = filteredItems.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0)
    const shipping = 20.0
    const total = subtotal + shipping

    // Get store ID from first item
    const tiendaId = filteredItems[0]?.tiendaId

    const [ordenId, setOrdenId] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // useEffect(() => {
    //     // Redirect if no items or no store selected
    //     if (carritoItems !== undefined && filteredItems.length === 0) {
    //         router.push('/user/carrito')
    //     }
    // }, [carritoItems, filteredItems, router])

    const handleShippingSubmit = (data: ShippingFormData) => {
        setStep(2)
    }

    const handlePaymentSubmit = async (data: PaymentFormData) => {
        if (!usuario || !tiendaId) {
            toast.error("Error: datos de usuario o tienda no disponibles")
            return
        }

        setIsSubmitting(true)

        try {
            const shippingData = shippingForm.getValues()

            const result = await crearVentaOnline({
                tiendaId,
                productos: filteredItems.map(item => ({
                    productoId: item.productoId,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                    nombreProducto: item.producto?.nombre || "Producto",
                })),
                metodoPago: data.metodoPago,
                subtotal,
                costoEnvio: shipping,
                total,
                nombreComprador: shippingData.nombre,
                telefonoComprador: shippingData.telefono,
                direccionEntrega: shippingData.direccion,
                ciudadEntrega: shippingData.ciudad,
                notasEntrega: shippingData.notas,
            })

            // Vaciar solo los items de esta tienda del carrito
            await vaciarCarritoPorTienda({
                usuarioId: usuario._id,
                tiendaId
            })

            setOrdenId(result.numeroOrden)
            setStep(3)
            toast.success("¡Pedido realizado exitosamente!")
            // router.push('/user/compras')
        } catch (error: any) {
            toast.error(error.message || "Error al procesar el pedido")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (carritoItems === undefined) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const renderStep1 = () => (
        <form onSubmit={shippingForm.handleSubmit(handleShippingSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Información de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="nombre">Nombre Completo *</Label>
                        <Input
                            id="nombre"
                            {...shippingForm.register("nombre")}
                            placeholder="Juan Pérez"
                        />
                        {shippingForm.formState.errors.nombre && (
                            <p className="text-sm text-red-600 mt-1">
                                {shippingForm.formState.errors.nombre.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="telefono">Teléfono *</Label>
                        <Input
                            id="telefono"
                            {...shippingForm.register("telefono")}
                            placeholder="88888888"
                        />
                        {shippingForm.formState.errors.telefono && (
                            <p className="text-sm text-red-600 mt-1">
                                {shippingForm.formState.errors.telefono.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="direccion">Dirección de Entrega *</Label>
                        <Input
                            id="direccion"
                            {...shippingForm.register("direccion")}
                            placeholder="Barrio San Luis, casa #123"
                        />
                        {shippingForm.formState.errors.direccion && (
                            <p className="text-sm text-red-600 mt-1">
                                {shippingForm.formState.errors.direccion.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="ciudad">Ciudad *</Label>
                        <Input
                            id="ciudad"
                            {...shippingForm.register("ciudad")}
                            placeholder="Managua"
                        />
                        {shippingForm.formState.errors.ciudad && (
                            <p className="text-sm text-red-600 mt-1">
                                {shippingForm.formState.errors.ciudad.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="notas">Notas (Opcional)</Label>
                        <Textarea
                            id="notas"
                            {...shippingForm.register("notas")}
                            placeholder="Referencias adicionales para la entrega..."
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/user/carrito')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al Carrito
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Continuar
                </Button>
            </div>
        </form>
    )

    const renderStep2 = () => (
        <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Método de Pago</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <RadioGroup
                        value={paymentForm.watch("metodoPago")}
                        onValueChange={(value) => paymentForm.setValue("metodoPago", value as any)}
                    >
                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                            <RadioGroupItem value="transferencia" id="transferencia" />
                            <Label htmlFor="transferencia" className="flex-1 cursor-pointer">
                                <div className="font-medium">Transferencia Bancaria</div>
                                <p className="text-sm text-gray-600">Pago mediante transferencia</p>
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                            <RadioGroupItem value="efectivo" id="efectivo" />
                            <Label htmlFor="efectivo" className="flex-1 cursor-pointer">
                                <div className="font-medium">Efectivo</div>
                                <p className="text-sm text-gray-600">Pago contra entrega</p>
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                            <RadioGroupItem value="fiado" id="fiado" />
                            <Label htmlFor="fiado" className="flex-1 cursor-pointer">
                                <div className="font-medium">Fiado</div>
                                <p className="text-sm text-gray-600">Pago a crédito</p>
                            </Label>
                        </div>
                    </RadioGroup>

                    {paymentForm.watch("metodoPago") === "transferencia" && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                                Recibirás los detalles de transferencia por correo después de confirmar el pedido.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                >
                    Anterior
                </Button>
                <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Procesando...
                        </>
                    ) : (
                        'Confirmar Pedido'
                    )}
                </Button>
            </div>
        </form>
    )

    const renderStep3 = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                        <Check className="w-5 h-5" />
                        ¡Pedido Confirmado!
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">¡Gracias por tu compra!</h3>
                        <p className="text-gray-600 mb-4">Orden #{ordenId}</p>
                        <p className="text-sm text-gray-600">
                            Recibirás un correo de confirmación con los detalles de tu pedido.
                        </p>
                        <div className="flex gap-3 justify-center mt-6">
                            <Button
                                variant="outline"
                                onClick={() => router.push('/user/productos')}
                            >
                                Seguir Comprando
                            </Button>
                            <Button
                                onClick={() => router.push('/user/compras')}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Ir a Mis Compras
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold">Finalizar Compra</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Tienda: {selectedStore !== "all" ? selectedStore : "Todas"}
                    </p>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Progress Steps */}
                        <div className="flex items-center mb-8">
                            {[1, 2, 3].map((stepNumber) => (
                                <div key={stepNumber} className="flex items-center">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= stepNumber ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                                            }`}
                                    >
                                        {step > stepNumber ? <Check className="w-4 h-4" /> : stepNumber}
                                    </div>
                                    <div className={`ml-2 text-sm ${step >= stepNumber ? "text-blue-600 font-medium" : "text-gray-600"}`}>
                                        {stepNumber === 1 ? "Entrega" : stepNumber === 2 ? "Pago" : "Confirmación"}
                                    </div>
                                    {stepNumber < 3 && (
                                        <div className={`w-16 h-0.5 mx-4 ${step > stepNumber ? "bg-blue-600" : "bg-gray-200"}`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Step Content */}
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>Resumen del Pedido</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Cart Items */}
                                <div className="space-y-3">
                                    {filteredItems.map((item) => (
                                        <div key={item._id} className="flex gap-3">
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium line-clamp-1">{item.producto?.nombre}</h4>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-xs text-gray-600">x{item.cantidad}</span>
                                                    <span className="text-sm font-medium">C$ {(item.precioUnitario * item.cantidad).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                {/* Pricing Breakdown */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>C$ {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Envío</span>
                                        <span>C$ {shipping.toFixed(2)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total</span>
                                        <span className="text-primary">C$ {total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Wrapper con Suspense para fix el error de useSearchParams
export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    )
}
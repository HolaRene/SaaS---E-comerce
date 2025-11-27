"use client"

import { useState, useEffect } from "react"
import { useMutation, useQuery } from "convex/react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Loader2, Save, Trash2 } from "lucide-react"
import { toast } from "react-toastify"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { api } from "../../../../../../convex/_generated/api"

const PageConfiguracion = () => {
    const params = useParams()
    const router = useRouter()
    const idTienda = params.idTienda as Id<"tiendas">

    const tienda = useQuery(api.tiendas.getTiendaById, { id: idTienda })
    const updateTienda = useMutation(api.tiendas.updateTienda)
    const deleteTienda = useMutation(api.tiendas.deleteTienda)

    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        direccion: "",
        telefono: "",
        departamento: "",
    })

    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [confirmName, setConfirmName] = useState("")
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    useEffect(() => {
        if (tienda) {
            setFormData({
                nombre: tienda.nombre || "",
                descripcion: tienda.descripcion || "",
                direccion: tienda.direccion || "",
                telefono: tienda.telefono || "",
                departamento: tienda.departamento || "",
            })
        }
    }, [tienda])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            await updateTienda({
                id: idTienda,
                ...formData
            })
            toast.success("Tienda actualizada correctamente")
        } catch (error) {
            console.error(error)
            toast.error("Error al actualizar la tienda")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (confirmName !== tienda?.nombre) {
            toast.error("El nombre de la tienda no coincide")
            return
        }

        setIsDeleting(true)
        try {
            await deleteTienda({ id: idTienda })
            toast.success("Tienda eliminada correctamente")
            router.push("/") // Redirigir al inicio o lista de tiendas
        } catch (error) {
            console.error(error)
            toast.error("Error al eliminar la tienda")
            setIsDeleting(false)
        }
    }

    if (!tienda) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="container mx-auto p-6 space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold">Configuración de la Tienda</h1>
                <p className="text-muted-foreground">Administra la información general y opciones de tu tienda</p>
            </div>

            {/* Formulario de Edición */}
            <Card>
                <CardHeader>
                    <CardTitle>Información General</CardTitle>
                    <CardDescription>Actualiza los detalles visibles de tu negocio</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre de la Tienda</Label>
                                <Input
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ej: Don Pulpería"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="telefono">Teléfono</Label>
                                <Input
                                    id="telefono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    placeholder="+505 0000 0000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                placeholder="Breve descripción de tu negocio..."
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="direccion">Dirección</Label>
                                <Input
                                    id="direccion"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    placeholder="Dirección exacta"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="departamento">Departamento</Label>
                                <Input
                                    id="departamento"
                                    name="departamento"
                                    value={formData.departamento}
                                    onChange={handleChange}
                                    placeholder="Ej: Managua"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Guardar Cambios
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Zona de Peligro */}
            <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Zona de Peligro
                    </CardTitle>
                    <CardDescription className="text-destructive/80">
                        Acciones irreversibles que afectan a tu tienda
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Advertencia</AlertTitle>
                        <AlertDescription>
                            Eliminar la tienda borrará permanentemente todos los productos, ventas, clientes y registros asociados. Esta acción no se puede deshacer.
                        </AlertDescription>
                    </Alert>

                    <div className="flex justify-end">
                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar Tienda
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>¿Estás absolutamente seguro?</DialogTitle>
                                    <DialogDescription>
                                        Esta acción no se puede deshacer. Esto eliminará permanentemente la tienda <strong>{tienda.nombre}</strong> y todos sus datos asociados.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-name">
                                            Escribe <strong>{tienda.nombre}</strong> para confirmar:
                                        </Label>
                                        <Input
                                            id="confirm-name"
                                            value={confirmName}
                                            onChange={(e) => setConfirmName(e.target.value)}
                                            placeholder={tienda.nombre}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDelete}
                                        disabled={confirmName !== tienda.nombre || isDeleting}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Eliminando...
                                            </>
                                        ) : (
                                            "Eliminar Tienda"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default PageConfiguracion

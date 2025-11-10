"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabsContent } from "@radix-ui/react-tabs"
import { Shield, UserPlus, Users } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import ListaUser from "./_components/ListaUser"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateUserForm } from "./_components/create-user-form"
import { RolesGrid } from "./_components/roles-grid"
import { PermissionMatrix } from "./_components/permission-matrix"

const Page = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const activeTab = searchParams.get("tab") || "list"

    // Cambiar pestaña con URL
    const handleTabChange = (value: string) => {
        router.push(`/users?tab=${value}`)
    }
    return (
        <div className="container mx-auto py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
                <p className="text-muted-foreground">Administra usuarios, roles y permisos del sistema</p>
            </div>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="list" className="gap-2">
                        <Users className="h-4 w-4" />
                        Lista <span className="md:block hidden">de Usuarios</span>
                    </TabsTrigger>
                    <TabsTrigger value="create" className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Agregar <span className="md:block hidden">Usuario</span>
                    </TabsTrigger>
                    <TabsTrigger value="roles" className="gap-2">
                        <Shield className="h-4 w-4" />
                        Roles <span className="md:block hidden">y Permisos</span>
                    </TabsTrigger>
                </TabsList>
                {/* Pestaña 1: Lista de Usuarios */}
                <TabsContent value="list" className="space-y-4">
                    <ListaUser />
                </TabsContent>
                {/* Pestaña 2: Agregar Usuario */}
                <TabsContent value="create">
                    <Card>
                        <CardHeader >
                            <CardTitle>Crear Nuevo Usuario</CardTitle>
                            <CardDescription>
                                Completa el formulario paso a paso para agregar un nuevo usuario al sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CreateUserForm />
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* Pestaña 3: Roles y Permisos */}
                <TabsContent value="roles" className="space-y-3">
                    <RolesGrid />
                    <Card>
                        <CardHeader>
                            <CardTitle>Matriz de Permisos</CardTitle>
                            <CardDescription>Configura permisos granulares por módulo para cada rol</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PermissionMatrix />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Page
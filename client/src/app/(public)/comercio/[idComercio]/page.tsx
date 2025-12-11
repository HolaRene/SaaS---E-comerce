
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Id } from "../../../../../convex/_generated/dataModel"
import PerfilPublico from "./_components/perfilPublico"
import { ErrorBoundary } from "@/components/error/ErrorBoundery"
import { notFound } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeftIcon } from "lucide-react";
import HorarioPublico from "./_components/HorariosPublicTienda";
import ResenasTienda from "./_components/ResenasTienda";


const Page = async ({ params }: { params: Promise<{ idComercio: Id<"tiendas"> }> }) => {
    const { idComercio } = await params

    if (!idComercio) notFound()


    return (
        <ErrorBoundary>
            <Tabs defaultValue="perfil" className="w-full mt-3 md:px-3 px-1">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/comercios" className="flex gap-2 items-center">
                                <ArrowLeftIcon className="w-4 h-4" /> Comercios</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Tienda</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="perfil">Perfil Público</TabsTrigger>
                    <TabsTrigger value="horarios">Horarios</TabsTrigger>
                    <TabsTrigger value="resenas">Reseñas</TabsTrigger>
                </TabsList>

                {/* 1. Perfil Público */}
                <TabsContent value="perfil" className="space-y-6">
                    <PerfilPublico id={idComercio} />
                </TabsContent>

                {/* 3. Horarios de Atención */}
                <TabsContent value="horarios" className="space-y-6">
                    {/* <Horario id={idComercio} /> */}
                    <HorarioPublico id={idComercio} />
                </TabsContent>

                {/* 4. Reseñas */}
                <TabsContent value="resenas" className="space-y-6">
                    <ResenasTienda id={idComercio} />
                </TabsContent>
            </Tabs>
        </ErrorBoundary>
    )
}

// Metadata dinámica mínima (puede mejorarse después de obtener datos en cliente)
export async function generateMetadata({ params }: { params: Promise<{ idComercio: Id<"tiendas"> }> }) {
    const { idComercio } = await params
    if (!idComercio) {
        return { title: "Tienda no encontrada | Marketplace Tiendas" }
    }

    return {
        title: `Tienda | Marketplace Tiendas`,
    }
}

export default Page
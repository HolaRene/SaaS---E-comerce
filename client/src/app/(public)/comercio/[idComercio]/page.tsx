
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Id } from "../../../../../convex/_generated/dataModel"
import PerfilPublico from "./_components/perfilPublico"
import { ErrorBoundary } from "@/components/error/ErrorBoundery"
import { Metadata } from "next";
import { notFound } from "next/navigation";


const Page = async ({ params }: { params: Promise<{ idComercio: Id<"tiendas"> }> }) => {
    const { idComercio } = await params

    if (!idComercio) notFound()


    return (
        <ErrorBoundary>
            <Tabs defaultValue="perfil" className="w-full mt-3 md:px-3 px-1">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="perfil">Perfil Público</TabsTrigger>

                    <TabsTrigger value="horarios">Horarios</TabsTrigger>
                </TabsList>

                {/* 1. Perfil Público */}
                <TabsContent value="perfil" className="space-y-6">
                    <PerfilPublico id={idComercio} />
                </TabsContent>

                {/* 3. Horarios de Atención */}
                <TabsContent value="horarios" className="space-y-6">
                    {/* <Horario id={idComercio} /> */}
                    Horario
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
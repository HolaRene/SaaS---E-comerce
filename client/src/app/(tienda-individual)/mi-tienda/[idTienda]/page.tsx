import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import Perfil from "../_components/Perfil";
import Horario from "../_components/Horario";
import Configuracion from "../_components/Configuracion";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Metadata } from "next";
import { ErrorBoundary } from "@/components/error/ErrorBoundery";

export const metadata: Metadata = {
    title: "Tu tienda flexi",
    description: "El mero don",
    icons: {
        icon: "/favicon-32x32.png",
    },
};

// --- Componente Principal ---
const MiNegocio = async ({ params }: { params: { idTienda: Id<"tiendas"> } }) => {

    const id = await params.idTienda
    return (
        <ErrorBoundary>
            <Tabs defaultValue="perfil" className="w-full mt-3">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="perfil">Perfil Público</TabsTrigger>
                    <TabsTrigger value="configuracion">Configuración</TabsTrigger>
                    <TabsTrigger value="horarios">Horarios</TabsTrigger>
                </TabsList>

                {/* 1. Perfil Público */}
                <TabsContent value="perfil" className="space-y-6">
                    <Perfil id={id} />
                </TabsContent>

                {/* 2. Configuración General */}
                <TabsContent value="configuracion" className="space-y-6">
                    <Configuracion id={id} />
                </TabsContent>

                {/* 3. Horarios de Atención */}
                <TabsContent value="horarios" className="space-y-6">
                    <Horario id={id} />
                </TabsContent>
            </Tabs>
        </ErrorBoundary>
    );
}

export default MiNegocio

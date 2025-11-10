import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import Perfil from "./_components/Perfil";
import Horario from "./_components/Horario";
import Configuracion from "./_components/Configuracion";

export const generateMetadata = async ({
    params,
}: {
    params: { id: string };
}) => {
    return {
        title: "Pulpería san José",
        describe: "Este comercio es fleci",
    };
};


// --- Componente Principal ---
export default function MiNegocio() {

    return (
        <Tabs defaultValue="perfil" className="w-full mt-3">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="perfil">Perfil Público</TabsTrigger>
                <TabsTrigger value="configuracion">Configuración</TabsTrigger>
                <TabsTrigger value="horarios">Horarios</TabsTrigger>
            </TabsList>

            {/* 1. Perfil Público */}
            <TabsContent value="perfil" className="space-y-6">
                <Perfil />
            </TabsContent>

            {/* 2. Configuración General */}
            <TabsContent value="configuracion" className="space-y-6">
                <Configuracion />
            </TabsContent>

            {/* 3. Horarios de Atención */}
            <TabsContent value="horarios" className="space-y-6">
                <Horario />
            </TabsContent>
        </Tabs>
    );
}

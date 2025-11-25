import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, FileText, MessageCircle } from "lucide-react"
import Comunicacion from "./_components/Comunicacion"
import Automatizaciones from "./_components/Automatizaciones"
import Documentos from "./_components/Documentos"

const PageHerramientas = () => {
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Encabezado */}
            <div>
                <h1 className="text-3xl font-bold">Herramientas</h1>
                <p className="text-muted-foreground">Automatiza tareas, comunícate con clientes y genera documentos</p>
            </div>
            {/* Tabs */}
            <Tabs defaultValue="comunicacion" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="comunicacion">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        <span className="hidden md:block">Comunicación</span>
                    </TabsTrigger>
                    <TabsTrigger value="automatizaciones">
                        <Bot className="h-4 w-4 mr-2" />
                        <span className="hidden md:block">Automatizaciones</span>
                    </TabsTrigger>
                    <TabsTrigger value="documentos">
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="hidden md:block">Documentos</span>
                    </TabsTrigger>
                </TabsList>
                {/* TAB: COMUNICACIÓN */}
                <TabsContent value="comunicacion">
                    <Comunicacion />
                </TabsContent>
                {/* TAB: AUTOMATIZACIONES */}
                <TabsContent value="automatizaciones">
                    <Automatizaciones />
                </TabsContent>
                {/* Documentos */}
                <TabsContent value="documentos">
                    <Documentos />
                </TabsContent>
            </Tabs>

        </div>
    )
}

export default PageHerramientas
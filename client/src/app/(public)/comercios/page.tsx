import { ResizablePanels } from "@/components/negocios/resizable-panels"
import ListaNegocios from "@/components/public-negocios/lista-tiendas"

const Page = () => {
    return (
        <div className="h-screen flex flex-col bg-background">

            {/* Contenido principal */}
            <main className="flex-1 overflow-hidden">
                {/* Contenedor para pantallas grandes deslizantes */}
                <div className="hidden md:block h-full">
                    <ResizablePanels
                        leftPanel={<h1>Mapa</h1>}
                        rightPanel={<ListaNegocios />}
                        defaultLeftWidth={60}
                        minLeftWidth={45}
                        maxLeftWidth={75}
                    />
                </div>

                {/* Contenedor para pantallas pequeñas */}
                <div className="md:hidden h-full overflow-y-auto">
                    {/* Listas de negocios */}
                    <div className="min-h-[50vh]">
                        <ListaNegocios />
                    </div>
                    {/* Mapa */}
                    <div className="h-[60vh] border-t">Hola don</div>
                </div>

            </main>
        </div>
    )
}

export default Page

import ListaNegocios from "@/components/public-negocios/lista-tiendas"
import MapPanelClient from '@/components/public-negocios/MapPanelClient'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

const Page = ({ searchParams: { busqueda } }: { searchParams: { busqueda?: string } }) => {

    return (
        <div className="h-screen flex flex-col bg-background">

            {/* Contenido principal */}
            <main className="flex-1 overflow-hidden">
                {/* Contenedor para pantallas grandes deslizantes */}
                <div className="hidden md:block h-full">
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={60} minSize={45} maxSize={75}>
                            <MapPanelClient embedded />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={40} minSize={25} maxSize={55}>
                            <ListaNegocios busqueda={busqueda} />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>

                {/* Contenedor para pantallas pequeñas */}
                <div className="md:hidden h-full overflow-y-auto">
                    {/* Listas de negocios */}
                    <div className="min-h-[50vh]">
                        <ListaNegocios busqueda={busqueda} />
                    </div>
                    {/* Mapa (móvil) */}
                    <div className="h-[60vh] border-t">
                        <MapPanelClient embedded />
                    </div>
                </div>

            </main>
        </div>
    )
}

export default Page
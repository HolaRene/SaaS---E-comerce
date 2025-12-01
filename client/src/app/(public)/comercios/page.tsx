import { ResizablePanels } from "@/components/negocios/resizable-panels"
import ListaNegocios from "@/components/public-negocios/lista-tiendas"
import MapPanelClient from '@/components/public-negocios/MapPanelClient'

const Page = ({ searchParams: { busqueda } }: { searchParams: { busqueda?: string } }) => {

    return (
        <div className="h-screen flex flex-col bg-background">

            {/* Contenido principal */}
            <main className="flex-1 overflow-hidden">
                {/* Contenedor para pantallas grandes deslizantes */}
                <div className="hidden md:block h-full">
                    <ResizablePanels
                        leftPanel={<MapPanelClient />}
                        rightPanel={<ListaNegocios busqueda={busqueda} />}
                        defaultLeftWidth={60}
                        minLeftWidth={45}
                        maxLeftWidth={75}
                    />
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
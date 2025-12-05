import ListaNegocios from "@/components/public-negocios/lista-tiendas"
import MapPanelClient from '@/components/public-negocios/MapPanelClient'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

const Page = async ({ searchParams }: { searchParams: Promise<{ busqueda?: string }> }) => {
    const { busqueda } = await searchParams

    return (
        <div className="h-screen flex flex-col bg-background">
            <main className="flex-1 overflow-hidden">
                {/* ✅ DESKTOP: QUITA 'embedded' para usar sticky normal */}
                <div className="hidden md:block h-full">
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={60} minSize={45} maxSize={75}>
                            <MapPanelClient />  {/* SIN embedded */}
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={40} minSize={25} maxSize={55}>
                            <div className="h-full flex flex-col min-h-0">
                                <ListaNegocios busqueda={busqueda} />
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>

                {/* ✅ MOBILE: SÍ usa 'embedded' */}
                <div className="md:hidden h-full overflow-hidden flex flex-col">
                    <div className="flex-1 h-full min-h-0 overflow-y-auto">
                        <ListaNegocios busqueda={busqueda} />
                    </div>
                    <div className="h-[45vh] border-t">
                        <MapPanelClient embedded />  {/* SÓLO AQUÍ */}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Page
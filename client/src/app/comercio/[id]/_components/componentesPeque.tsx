"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageCircle } from "lucide-react"


import { useState } from "react";
import { reseñasMock } from "@/data/resenas";
import ResenaCard from "./ResenaCard";
import ProductCard from "./ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productos } from "@/data/mockProductos";
import { useRouter } from "next/navigation";

export const ComponentesPeque = () => {



    const handleWhatsAppClick = () => {
        window.open(`https://wa.me/50588555555`, "_blank");
    };
    return (
        <div className="flex flex-col gap-3 lg:min-w-48">
            <Button
                onClick={handleWhatsAppClick}
                className="bg-green-600 hover:bg-green-700 gap-2"
            >
                <MessageCircle className="h-4 w-4" />
                Contactar por WhatsApp
            </Button>
        </div>
    )
}


export const Tabsa = () => {


    const rese = reseñasMock
    const comercio = productos
    const [activeTab, setActiveTab] = useState("productos");
    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList className="grid w-full grid-cols-2 lg:w-96">
                <TabsTrigger value="productos">Productos</TabsTrigger>
                <TabsTrigger value="reseñas">Reseñas</TabsTrigger>
            </TabsList>

            <TabsContent value="productos" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {comercio.map((producto) => (
                        <ProductCard key={producto.id} producto={producto} />
                    ))}
                </div>
            </TabsContent>
            <TabsContent value="reseñas" className="mt-6">
                <div className="space-y-4">
                    {
                        rese.sort(
                            (a, b) =>
                                new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
                        )
                            .map((reseña) => (
                                <ResenaCard key={reseña.id} resenas={reseña} />
                            ))}
                </div>
            </TabsContent>
        </Tabs>
    )
}

const HeaderFlexi = () => {

    const router = useRouter();

    return (
        <header className=" shadow-sm p-4 mt-2">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/comercio")}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                </Button>
                <h1 className="font-semibold">Perfil del comercio</h1>
            </div>
        </header>
    )
}

export default HeaderFlexi

"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, ImageIcon, Phone, Star } from "lucide-react";
import Link from "next/link";
import { Comercio } from "@/types/tipado_comercio";
import { productos, tienda } from "@/lib/tiendas-datos";



const handleWhatsAppChat = () => {
    window.open("https://wa.me/50588888888", "_blank");
};


const Perfil = () => {
    const datosTienda: Comercio = tienda
    return (
        <div className='space-y-3'>
            <Card className="overflow-hidden">
                <div className="relative">
                    <Image
                        src={datosTienda.imgBanner}
                        alt="Banner de Pulpería San José"
                        className="h-48 w-full object-cover"
                        width={800}
                        height={400}
                    />
                    <div className="absolute left-6 top-24">
                        <Avatar className="h-32 w-32 border-4 border-background">
                            <AvatarImage src={datosTienda.avatar} />
                            <AvatarFallback>SJ</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
                <CardHeader className="pt-20">
                    <CardTitle className="text-3xl font-bold">{datosTienda.nombre}</CardTitle>
                    <Badge variant="secondary" className="w-fit">{datosTienda.categoria}</Badge>
                    <CardDescription className="pt-2 text-base">
                        {datosTienda.descripcion}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Button><Edit className="mr-2 h-4 w-4" /> Editar Perfil</Button>
                        <Button variant="outline" onClick={handleWhatsAppChat}><Phone className="mr-2 h-4 w-4" /> Chatear por WhatsApp</Button>
                        <Button variant="outline"><Star className="mr-2 h-4 w-4" />Ver Reseñas</Button>
                        <Button variant="ghost"><Eye className="mr-2 h-4 w-4" /> Vista Pública</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" />Productos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {productos.map((src) => (
                            <div key={src.id} className="cursor-pointer hover:opacity-80 transition">
                                <Link href={'/mi-tienda/productos'} >
                                    <Image src={src.imagen[0]} alt={src.nombre} className="rounded-lg object-cover aspect-square"
                                        width={200} height={200}
                                    />
                                </Link>
                                <h1 className="font-bold">{src.nombre}</h1>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Perfil
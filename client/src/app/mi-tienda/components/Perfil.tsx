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

// --- Datos Estáticos ---
const galleryImages = [
    "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg",
    "https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg",
    "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
    "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
];

const handleWhatsAppChat = () => {
    window.open("https://wa.me/50588888888", "_blank");
};


const Perfil = () => {
    return (
        <div className=''>
            <Card className="overflow-hidden">
                <div className="relative">
                    <Image
                        src="https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg"
                        alt="Banner de Pulpería San José"
                        className="h-48 w-full object-cover"
                        width={800}
                        height={400}
                    />
                    <div className="absolute left-6 top-24">
                        <Avatar className="h-32 w-32 border-4 border-background">
                            <AvatarImage src="https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg" />
                            <AvatarFallback>SJ</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
                <CardHeader className="pt-20">
                    <CardTitle className="text-3xl font-bold">Pulpería San José</CardTitle>
                    <Badge variant="secondary" className="w-fit">Abarrotes y Panadería</Badge>
                    <CardDescription className="pt-2 text-base">
                        Comercio familiar con más de 10 años ofreciendo productos frescos y de calidad en Boaco.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Button><Edit className="mr-2 h-4 w-4" /> Editar Perfil</Button>
                        <Button variant="outline" onClick={handleWhatsAppChat}><Phone className="mr-2 h-4 w-4" /> Chatear por WhatsApp</Button>
                        <Button variant="outline"><Star className="mr-2 h-4 w-4" /> Ver Reseñas</Button>
                        <Button variant="ghost"><Eye className="mr-2 h-4 w-4" /> Vista Pública</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Galería de Imágenes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {galleryImages.map((src, index) => (
                            <div key={index} className="cursor-pointer hover:opacity-80 transition">
                                <Link href={'/mi-tienda/productos'} >
                                    <Image src={src} alt={`Galería ${index + 1}`} className="rounded-lg object-cover aspect-square"
                                        width={200} height={200}
                                    />
                                </Link>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Perfil
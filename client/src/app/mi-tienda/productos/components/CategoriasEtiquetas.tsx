"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowDown, ArrowUp } from "lucide-react";

const etiquetasData = ["Ofertas", "Nuevo", "Popular", "SinBromato", "Importado"];
const categoriasData = [
    { id: 'cat1', nombre: 'Panadería', subcategorias: ['Pan Dulce', 'Pan Baguette', 'Pan Integral'] },
    { id: 'cat2', nombre: 'Bebidas', subcategorias: ['Gaseosas', 'Jugos', 'Agua'] },
    { id: 'cat3', nombre: 'Abarrotes', subcategorias: ['Granos Básicos', 'Enlatados', 'Aceites'] },
    { id: 'cat4', nombre: 'Limpieza', subcategorias: ['Detergentes', 'Desinfectantes'] },
];

const CategoriasEtiquetas = () => {


    return (
        <div className='grid md:grid-cols-2 gap-4 grid-cols-1'>
            <Card>
                <CardHeader>
                    <CardTitle>Gestión de Categorías</CardTitle>
                    <CardDescription>Organiza tus productos en categorías y subcategorías.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {categoriasData.map(cat => (
                            <AccordionItem key={cat.id} value={cat.id}>
                                <AccordionTrigger>{cat.nombre}</AccordionTrigger>
                                <AccordionContent className="pl-4">
                                    <ul className="space-y-2">
                                        {cat.subcategorias.map(sub => <li key={sub} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                                            <span>{sub}</span>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <ArrowUp className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <ArrowDown className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </li>)}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
                <CardFooter>
                    <Button variant="outline">Agregar Categoría</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Etiquetas de Búsqueda</CardTitle>
                    <CardDescription>Ayuda a tus clientes a encontrar productos fácilmente.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {etiquetasData.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                    </div>
                    <div className="flex gap-2">
                        <Input placeholder="Nueva etiqueta..." />
                        <Button>Agregar</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CategoriasEtiquetas
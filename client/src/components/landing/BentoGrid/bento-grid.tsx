"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Tagline } from "../tagline";

export function BentoGrid6() {
    return (
        <section className="bg-background section-padding-y border-b" id="features">
            <div className="container-padding-x container mx-auto flex flex-col gap-10 md:gap-12">
                {/* Título de la sección */}
                <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center">
                    <Tagline>Funciones principales</Tagline>
                    <h2 className="heading-lg">
                        Todo lo que tu Tienda necesita, en un solo lugar
                    </h2>
                </div>

                {/* Cuadrícula de características */}
                <div className="grid grid-cols-1 gap-3 md:gap-6 lg:grid-cols-3 lg:grid-rows-2">
                    {/* Tarjeta ancha - Arriba izquierda */}
                    <Card className="bg-muted/80 gap-0 overflow-hidden rounded-xl border-none p-0 shadow-none lg:col-span-2">
                        <Image
                            src="/ai-meeting-notes.png"
                            alt="Control de ventas y fiados"
                            width={813}
                            height={332}
                            className="hidden h-auto w-full object-cover md:block md:h-[332px]"
                        />
                        <Image
                            src="/ai-meeting-notes_mobile.png"
                            alt="Control de ventas y fiados"
                            width={480}
                            height={332}
                            className="block h-auto w-full md:hidden"
                        />
                        <CardContent className="flex flex-col gap-2 p-6">
                            <h3 className="text-foreground text-lg font-semibold">
                                Control de ventas y fiados
                            </h3>
                            <p className="text-muted-foreground">
                                Registra tus ventas al instante y lleva el control de quién te debe, sin perder ningún detalle.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Tarjeta regular - Arriba derecha */}
                    <Card className="bg-muted/80 gap-0 overflow-hidden rounded-xl border-none p-0 shadow-none lg:col-span-1">
                        <Image
                            src="/universal-search.png"
                            alt="Reportes automáticos"
                            width={480}
                            height={332}
                            className="h-auto w-full object-cover md:h-[332px]"
                        />
                        <CardContent className="flex flex-col gap-2 p-6">
                            <h3 className="text-foreground text-lg font-semibold">
                                Reportes automáticos
                            </h3>
                            <p className="text-muted-foreground">
                                Obtén tus ganancias diarias y semanales de forma clara y automática desde tu celular.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Tarjeta regular - Abajo izquierda */}
                    <Card className="bg-muted/80 gap-0 overflow-hidden rounded-xl border-none p-0 shadow-none lg:col-span-1">
                        <Image
                            src="/smart-tags.png"
                            alt="Gestión de clientes"
                            width={480}
                            height={332}
                            className="h-auto w-full object-cover md:h-[332px]"
                        />
                        <CardContent className="flex flex-col gap-2 p-6">
                            <h3 className="text-foreground text-lg font-semibold">
                                Gestión de clientes
                            </h3>
                            <p className="text-muted-foreground">
                                Guarda la información de tus clientes y envíales recordatorios o promociones automáticamente.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Tarjeta ancha - Abajo derecha */}
                    <Card className="bg-muted/80 gap-0 overflow-hidden rounded-xl border-none p-0 shadow-none lg:col-span-2">
                        <Image
                            src="/team-insights.png"
                            alt="Inventario inteligente"
                            width={813}
                            height={332}
                            className="hidden h-[332px] w-full object-cover md:block"
                        />
                        <Image
                            src="/team-insights_mobile.png"
                            alt="Inventario inteligente"
                            width={480}
                            height={332}
                            className="block h-auto w-full object-cover md:hidden md:h-[332px]"
                        />
                        <CardContent className="flex flex-col gap-2 p-6">
                            <h3 className="text-foreground text-lg font-semibold">
                                Inventario inteligente
                            </h3>
                            <p className="text-muted-foreground">
                                Mantén tu stock siempre actualizado y recibe alertas cuando un producto esté por agotarse.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}


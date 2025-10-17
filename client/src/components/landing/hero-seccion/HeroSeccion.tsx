"use client";

import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Tagline } from "../tagline";

export function HeroSection2() {
    return (
        <section
            className="bg-secondary section-padding-y"
            aria-labelledby="hero-heading"
        >
            <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
                {/* Columna Izquierda */}
                <div className="flex flex-1 flex-col gap-6 lg:gap-8">
                    {/* Título de sección */}
                    <div className="section-title-gap-xl flex flex-col">
                        {/* Tagline */}
                        <Tagline>MiPulpería Digital</Tagline>

                        {/* Encabezado principal */}
                        <h1 id="hero-heading" className="heading-xl">
                            Tu tienda conectada y siempre bajo control
                        </h1>

                        {/* Descripción */}
                        <p className="text-muted-foreground text-base lg:text-lg">
                            Transforma tu negocio tradicional en un comercio moderno.
                            Desde ventas rápidas hasta control de fiados, reportes y mensajes automáticos,
                            todo desde tu celular o computadora.
                        </p>
                    </div>

                    {/* Lista de características */}
                    <div className="flex flex-col gap-2 md:gap-3">
                        <div className="flex items-start gap-3">
                            <div className="pt-0.5">
                                <Check className="text-primary h-5 w-5" />
                            </div>
                            <span className="text-card-foreground text-base leading-6 font-medium">
                                Control de ventas y fiados
                            </span>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="pt-0.5">
                                <Check className="text-primary h-5 w-5" />
                            </div>
                            <span className="text-card-foreground text-base leading-6 font-medium">
                                Reportes automáticos y claros
                            </span>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="pt-0.5">
                                <Check className="text-primary h-5 w-5" />
                            </div>
                            <span className="text-card-foreground text-base leading-6 font-medium">
                                Comunicación directa con tus clientes
                            </span>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button>Probar ahora</Button>
                        <Button variant="ghost">
                            Ver cómo funciona
                            <ArrowRight />
                        </Button>
                    </div>
                </div>

                {/* Columna Derecha (imagen) */}
                <div className="w-full flex-1">
                    <AspectRatio ratio={1 / 1}>
                        <Image
                            src="/Hero.png"
                            alt="Vista previa de MiPulpería Digital"
                            fill
                            priority
                            className="h-full w-full rounded-xl object-cover"
                        />
                    </AspectRatio>
                </div>
            </div>
        </section>
    );
}

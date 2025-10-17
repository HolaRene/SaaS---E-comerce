"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Tagline } from "../tagline";

export function FaqSection2() {
    return (
        <section
            className="bg-background section-padding-y border-b"
            aria-labelledby="faq-heading"
            id="faq"
        >
            <div className="container-padding-x container mx-auto">
                <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
                    {/* Left Column */}
                    <div className="section-title-gap-lg flex flex-1 flex-col">
                        <Tagline>Preguntas Frecuentes</Tagline>
                        <h1 id="faq-heading" className="heading-lg text-foreground">
                            Respuestas a las preguntas más comunes
                        </h1>
                        <p className="text-muted-foreground">
                            Aquí encontrarás información importante sobre nuestros planes y funcionalidades.
                            ¿No encuentras lo que buscas?{" "}
                            <Link href="#" className="text-primary underline">
                                Contáctanos
                            </Link>
                            .
                        </p>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-1 flex-col gap-8">
                        {/* General FAQ */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-foreground text-lg font-semibold md:text-xl">
                                General
                            </h2>
                            <Accordion type="single" collapsible aria-label="General FAQ items">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-left">
                                        ¿Qué es nuestra plataforma de negocios?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        Es un sistema que te permite gestionar productos, ventas, clientes y generar reportes de manera fácil y rápida, todo en un solo lugar.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-left">
                                        ¿Puedo usar más de un usuario?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        Sí, dependiendo del plan que elijas. El plan Básico permite hasta 50 usuarios, mientras que el Premium es ilimitado.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-left">
                                        ¿Cuántos productos puedo registrar?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        El plan Básico permite hasta 50 productos, mientras que el plan Premium permite productos ilimitados.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-4">
                                    <AccordionTrigger className="text-left">
                                        ¿Cómo se generan los documentos y reportes?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        Puedes generar hasta 4 documentos/mes en el plan Básico (1 por semana), mientras que en Premium son ilimitados. Incluye reportes de ventas, inventario y clientes.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        {/* Billing FAQ */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-foreground text-lg font-semibold md:text-xl">
                                Facturación y Planes
                            </h2>
                            <Accordion type="single" collapsible aria-label="Billing FAQ items">
                                <AccordionItem value="billing-1">
                                    <AccordionTrigger className="text-left">
                                        ¿Puedo cambiar de plan en cualquier momento?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        Sí, puedes actualizar, degradar o cancelar tu plan en cualquier momento. Los cambios se aplican de inmediato y los cargos se ajustan proporcionalmente.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="billing-2">
                                    <AccordionTrigger className="text-left">
                                        ¿Qué métodos de pago se aceptan?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        Aceptamos tarjetas de crédito, PayPal y transferencias bancarias. Todos los pagos son procesados de manera segura.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="billing-3">
                                    <AccordionTrigger className="text-left">
                                        ¿Ofrecen descuentos por pagos anuales?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        Sí, ofrecemos un descuento del 20% al elegir la facturación anual para los planes de pago.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="billing-4">
                                    <AccordionTrigger className="text-left">
                                        ¿Necesito tarjeta de crédito para el plan Básico?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        No, el plan Básico es gratuito y no requiere tarjeta de crédito para comenzar.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

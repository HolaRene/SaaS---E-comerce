"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Check, Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { VariantProps } from "class-variance-authority";
import { Tagline } from "../tagline";

const pricingData = {
    plans: [
        {
            name: "Básico",
            description:
                "Para negocios que desean controlar su tienda y generar reportes limitados.",
            features: [
                { name: "Hasta 50 productos", tooltip: "Limite de productos en tu catálogo." },
                { name: "Hasta 50 usuarios", tooltip: "Cantidad máxima de usuarios administradores." },
                { name: "Documentos y reportes 4/mes (1 por semana)", tooltip: "Generación limitada de documentos y reportes avanzados." },
            ],
            price: 0,
            period: "/mes",
            variant: "outline",
        },
        {
            name: "Premium",
            description:
                "Todo ilimitado: productos, usuarios, documentos y reportes avanzados.",
            features: [
                { name: "Productos ilimitados", tooltip: "Agrega todos los productos que necesites." },
                { name: "Usuarios ilimitados", tooltip: "Todos tus administradores sin límite." },
                { name: "Documentos y reportes ilimitados", tooltip: "Genera reportes avanzados cuando quieras." },
                { name: "Soporte prioritario", tooltip: "Atención rápida y personalizada." },
            ],
            price: 20,
            period: "/mes",
            variant: "default",
            highlighted: true,
        },
    ],
};

export function PricingSection3() {
    return (
        <section
            className="bg-secondary section-padding-y border-b"
            aria-labelledby="pricing-section-title-3"
            id="pricing"
        >
            <div className="container-padding-x container mx-auto">
                <div className="flex flex-col items-center gap-10 md:gap-12">
                    <div className="section-title-gap-lg flex max-w-xl flex-col items-center text-center">
                        <Tagline>Planes y Precios</Tagline>
                        <h2
                            id="pricing-section-title-3"
                            className="heading-lg text-foreground"
                        >
                            Elige el plan que mejor se adapte a tu negocio
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Organiza tu tienda, productos y reportes con facilidad.
                        </p>
                    </div>

                    <div className="flex w-full flex-col items-center gap-4 md:max-w-3xl md:flex-row md:gap-0">
                        {pricingData.plans.map((plan, index) => (
                            <Card
                                key={plan.name}
                                className={`p-6 shadow-none sm:p-12 md:rounded-tl-xl md:rounded-tr-none md:rounded-br-none md:rounded-bl-xl md:border-r-0 ${plan.highlighted
                                    ? "shadow-[0px_0px_0px_6px_rgba(7,46,106,0.05)] md:rounded-xl md:border-r-1"
                                    : ""
                                    }`}
                            >
                                <CardContent className="flex flex-col gap-8 p-0">
                                    <div className="flex flex-col gap-6">
                                        <div className="relative flex flex-col gap-3">
                                            <h3
                                                className={`text-lg font-semibold ${plan.highlighted ? "text-primary" : ""
                                                    }`}
                                            >
                                                {plan.name}
                                            </h3>
                                            <p className="text-muted-foreground text-sm">
                                                {plan.description}
                                            </p>
                                        </div>

                                        <div className="flex items-end gap-0.5">
                                            <span className="text-4xl font-semibold">
                                                ${plan.price}
                                            </span>
                                            <span className="text-muted-foreground text-base">
                                                {plan.period}
                                            </span>
                                        </div>

                                        <Button
                                            variant={
                                                plan.variant as VariantProps<typeof buttonVariants>["variant"]
                                            }
                                            className="w-full"
                                        >
                                            {plan.name === "Básico" ? "Comenzar gratis" : "Actualizar a Premium"}
                                        </Button>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <p className="text-sm font-medium">
                                            {index === 0
                                                ? "Incluye:"
                                                : `Todo lo del plan ${pricingData.plans[index - 1].name}, más:`}
                                        </p>
                                        <div className="flex flex-col gap-4">
                                            {plan.features.map((feature, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <Check className="text-primary h-5 w-5" />
                                                    <span className="text-muted-foreground flex-1 text-sm">
                                                        {feature.name}
                                                    </span>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Info className="text-muted-foreground h-4 w-4 cursor-pointer opacity-70 hover:opacity-100" />
                                                            </TooltipTrigger>
                                                            <TooltipContent className="max-w-xs">
                                                                <p>{feature.tooltip}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

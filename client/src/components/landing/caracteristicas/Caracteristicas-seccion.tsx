"use client";

import { Store, Package, ShoppingCart, Users } from "lucide-react";
import { Tagline } from "../tagline";

export function FeatureSection9() {
    return (
        <section
            className="bg-secondary section-padding-y border-b"
            id="how-it-works"
        >
            <div className="container-padding-x container mx-auto flex flex-col gap-10 md:gap-12">
                {/* Encabezado */}
                <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center">
                    <Tagline>Cómo funciona</Tagline>
                    <h2 className="heading-lg text-foreground">
                        Administra tu tienda en pocos pasos
                    </h2>
                    <p className="text-muted-foreground text-base">
                        MiPulpería Digital te permite controlar tu negocio, productos, ventas y clientes desde un solo lugar.
                        Todo pensado para simplificar tu día y aumentar tus ingresos.
                    </p>
                </div>

                {/* Sección de características */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
                    {/* 1. Negocio */}
                    <div className="flex flex-col items-center gap-5 text-center">
                        <div className="bg-background flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-[0px_0px_0px_4px_rgba(7,46,106,0.05)]">
                            <Store className="text-primary h-5 w-5" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-foreground font-semibold">1. Configura tu negocio</h3>
                            <p className="text-muted-foreground">
                                Personaliza la información de tu tienda, horarios, logo, impuestos y mensajes automáticos.
                            </p>
                        </div>
                    </div>

                    {/* 2. Productos */}
                    <div className="flex flex-col items-center gap-5 text-center">
                        <div className="bg-background flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-[0px_0px_0px_4px_rgba(7,46,106,0.05)]">
                            <Package className="text-primary h-5 w-5" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-foreground font-semibold">2. Agrega tus productos</h3>
                            <p className="text-muted-foreground">
                                Crea tu catálogo con fotos, precios, categorías y control de inventario automático.
                            </p>
                        </div>
                    </div>

                    {/* 3. Ventas */}
                    <div className="flex flex-col items-center gap-5 text-center">
                        <div className="bg-background flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-[0px_0px_0px_4px_rgba(7,46,106,0.05)]">
                            <ShoppingCart className="text-primary h-5 w-5" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-foreground font-semibold">3. Registra tus ventas</h3>
                            <p className="text-muted-foreground">
                                Usa el punto de venta rápido, genera facturas y envíalas a tus clientes por WhatsApp.
                            </p>
                        </div>
                    </div>

                    {/* 4. Clientes */}
                    <div className="flex flex-col items-center gap-5 text-center">
                        <div className="bg-background flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-[0px_0px_0px_4px_rgba(7,46,106,0.05)]">
                            <Users className="text-primary h-5 w-5" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-foreground font-semibold">4. Gestiona tus clientes</h3>
                            <p className="text-muted-foreground">
                                Controla fiados, historial de compras y envía recordatorios automáticos de pago o promociones.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
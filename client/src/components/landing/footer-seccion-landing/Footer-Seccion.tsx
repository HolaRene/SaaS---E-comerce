"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/logo";

export function Footer1() {
    return (
        <footer
            className="bg-background section-padding-y"
            role="contentinfo"
            aria-label="Pie de página"
        >
            <div className="container-padding-x container mx-auto flex flex-col gap-12 lg:gap-16">
                {/* Top Section */}
                <div className="flex w-full flex-col items-center gap-12 text-center">
                    {/* Logo Section */}
                    <Link href="/" aria-label="Ir a la página principal">
                        <Logo />
                    </Link>

                    {/* Main Navigation */}
                    <nav
                        className="flex flex-col items-center gap-6 text-sm md:flex-row md:gap-8"
                        aria-label="Navegación del pie de página"
                    >
                        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                            Inicio
                        </Link>
                        <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                            Funcionalidades
                        </Link>
                        <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                            Cómo funciona
                        </Link>
                        <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                            Preguntas
                        </Link>
                        <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                            Precios
                        </Link>
                        <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                            Contacto
                        </Link>
                    </nav>
                </div>

                {/* Section Divider */}
                <Separator role="presentation" />

                {/* Bottom Section */}
                <div className="flex w-full flex-col-reverse items-center gap-12 text-sm lg:flex-row lg:justify-between lg:gap-6">
                    {/* Copyright Text */}
                    <p className="text-muted-foreground text-center lg:text-left">
                        Desarrollado con ❤️ por{" "}
                        <Link href="https://www.shadcndesign.com/" className="underline" target="_blank">
                            ShadcnDesign
                        </Link>
                        . Todos los derechos reservados.
                    </p>

                    {/* Legal Navigation */}
                    <nav
                        className="flex flex-col items-center gap-6 text-sm md:flex-row md:gap-8"
                        aria-label="Enlaces legales"
                    >
                        <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                            Política de Privacidad
                        </Link>
                        <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                            Términos de Servicio
                        </Link>
                        <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                            Configuración de Cookies
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}

"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";

const MENU_ITEMS = [
    { label: "Comercios", href: "/" },
    { label: "Productos", href: "/product" },
    { label: "Mi tienda", href: "/mi-tienda/productos" },
    // { label: "¿Cómo funciona?", href: "https://images.pexels.com/photos/12941772/pexels-photo-12941772.jpeg" },
    { label: "Empresa", href: "/empresarial" },
    { label: "Precios", href: "#pricing" },
    { label: "Preguntas frecuentes", href: "#faq" },
    { label: "Usuario DashBoard", href: "/user/dashboard" },
] as const;

interface NavMenuItemsProps {
    className?: string;
}

const NavMenuItems = ({ className }: NavMenuItemsProps) => (
    <div className={`flex flex-col gap-1 md:flex-row ${className ?? ""}`}>
        {MENU_ITEMS.map(({ label, href }) => (
            <Link key={label} href={href}>
                <Button variant="ghost" className="w-full md:w-auto">
                    {label}
                </Button>
            </Link>
        ))}
    </div>
);

export function LpNavbar1() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    return (
        <nav className="bg-background sticky top-0 isolate z-50 border-b py-3.5 md:py-4">
            <div className="relative container m-auto flex flex-col justify-between gap-4 px-6 md:flex-row md:items-center md:gap-6">
                <div className="flex items-center justify-between">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <Button
                        variant="ghost"
                        className="flex size-9 items-center justify-center md:hidden"
                        onClick={toggleMenu}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </Button>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden w-full flex-row justify-end gap-5 md:flex">
                    <NavMenuItems />
                    <Link href="#pricing">
                        <Button>Probar ahora</Button>
                    </Link>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="flex w-full flex-col justify-end gap-5 pb-2.5 md:hidden">
                        <NavMenuItems />
                        <Link href="#pricing">
                            <Button className="w-full">Probar ahora</Button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

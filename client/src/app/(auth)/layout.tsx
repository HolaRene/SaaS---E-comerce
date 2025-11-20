
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "MiTienda Digital",
    description: "Dashboard corporativo multi-tienda para gestión de ventas y performance",
    icons: {
        icon: "/logo-flexi.ico",
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <main className="relative h-screen w-full">
            {/* Imagen de fondo en el inicio de sesión y crear cuenta. */}
            <div className="absolute size-full">
                <Image alt="fondo" src={'/images/bg-img.png'} fill className="size-full" />
            </div>
            {children}
        </main>

    );
}
import type { Metadata } from "next";
import '@/app/globals.css'

export const metadata: Metadata = {
    title: "Productos disponibles | FlexiCommerce",
    description:
        "Productos de los comercios",
    icons: {
        icon: "/logo-flexi.ico",
    },
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section>

            {children}
        </section>
    );
}

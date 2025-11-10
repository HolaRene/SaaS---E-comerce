import type React from "react"
import type { Metadata } from "next"
import "../globals.d.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "next-themes"
import { SidebarProvider } from "@/components/ui/sidebar"
import Navegacion from "@/components/Navegacion"
import { cookies } from "next/headers"
import AppSidebarEnterprise from "@/components/AppSideBar-enterprise"
import ConvexClientProvider from "../providers/ConvexProviderWithClerk"

export const metadata: Metadata = {
    title: "Dashboard Corporativo",
    description: "Dashboard corporativo multi-tienda para gestión de ventas y performance",
    icons: {
        icon: "/logo-flexi.ico",
    },
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    // estado = abierto o cerrado
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
    return (
        <html lang="es" suppressHydrationWarning>
            <body className={`antialiased`}>
                <ConvexClientProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <SidebarProvider defaultOpen={defaultOpen}>
                            <AppSidebarEnterprise />
                            <main className="w-full">
                                <Navegacion />
                                <div className="px-2 md:px-4">{children}</div>
                            </main>
                            <Toaster />
                        </SidebarProvider>
                    </ThemeProvider>
                </ConvexClientProvider>
            </body>
        </html>
    )
}

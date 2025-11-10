import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SidebarProvider } from "@/components/user/sidebar-provider"
import '@/app/globals.d.css'
import { Sidebar } from "@/components/user/sidebarUser"
import { Header } from "@/components/user/header"
import ConvexClientProvider from "@/app/providers/ConvexProviderWithClerk"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Dashboard Admin User",
    description: "Admin dashboard Para El Usuario",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ConvexClientProvider>
                    <SidebarProvider>
                        <div className="min-h-screen bg-background">
                            <Sidebar />
                            <div className="">
                                <Header />
                                <main className="p-2 md:p-6 lg:p-8">{children}</main>
                            </div>
                        </div>
                    </SidebarProvider>
                </ConvexClientProvider>
            </body>
        </html>
    )
}

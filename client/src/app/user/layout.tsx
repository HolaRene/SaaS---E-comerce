import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SidebarProvider } from "@/components/user/sidebar-provider"
import '../globals.d.css'

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
                <SidebarProvider>{children}</SidebarProvider>
            </body>
        </html>
    )
}

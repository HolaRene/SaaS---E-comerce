import type React from "react"
import { Header } from "@/components/user/header"
import { SidebarProvider } from "@/components/user/sidebar-provider"
import { Sidebar } from "@/components/user/sidebarUser"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-background">
                <Sidebar />
                <div className="lg:pl-72">
                    <Header />
                    <main className="p-4 md:p-6 lg:p-8">{children}</main>
                </div>
            </div>
        </SidebarProvider>
    )
}

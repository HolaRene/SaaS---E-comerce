

import { SidebarProvider } from "@/components/user/sidebar-provider";
import { Sidebar } from "@/components/user/sidebarUser";
import { Header } from "@/components/user/header";

import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/error/ErrorBoundery";

export const metadata: Metadata = {
    title: "Usuario",
    description: "Sección de usuario",
    icons: {
        icon: "/icons/usuario.png",
    },
};

export default function UserLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="min-h-screen bg-background">

            <SidebarProvider>
                <Sidebar />
                <div>
                    <Header />
                    <ErrorBoundary>
                        <main className="p-2 md:p-6 lg:p-8">{children}</main>
                    </ErrorBoundary>
                </div>
            </SidebarProvider>

        </div>
    );
}

import { SidebarProvider } from "@/components/user/sidebar-provider";
import { Sidebar } from "@/components/user/sidebarUser";
import { Header } from "@/components/user/header";
import "@/app/globals.d.css";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Usuario",
    description: "Tablero del usuario",
    icons: {
        icon: "/logo-flexi.ico",
    },
};
export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <SidebarProvider>
                <Sidebar />
                <div>
                    <Header />
                    <main className="p-2 md:p-6 lg:p-8">{children}</main>
                </div>
            </SidebarProvider>
        </div>
    );
}

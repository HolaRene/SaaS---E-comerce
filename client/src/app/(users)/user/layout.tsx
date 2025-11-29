"use client";

import { SidebarProvider } from "@/components/user/sidebar-provider";
import { Sidebar } from "@/components/user/sidebarUser";
import { Header } from "@/components/user/header";
import { UserIdProvider } from "@/app/providers/UserIdProvider";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";



export default function UserLayout({ children }: { children: React.ReactNode }) {
    const { user: clerkUser, isLoaded } = useUser();

    // Obtener usuario de Convex usando el clerkId
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    );

    // Mientras carga
    if (!isLoaded || !clerkUser || !usuario) {
        return <h1>hola</h1>
    }

    return (
        <div className="min-h-screen bg-background">
            <UserIdProvider idUser={usuario._id}>
                <SidebarProvider>
                    <Sidebar idUser={usuario._id} />
                    <div>
                        <Header />
                        <main className="p-2 md:p-6 lg:p-8">{children}</main>
                    </div>
                </SidebarProvider>
            </UserIdProvider>
        </div>
    );
}

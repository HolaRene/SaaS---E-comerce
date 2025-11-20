
import type { Metadata } from "next";
import { Aladin } from "next/font/google";

import Navegacion from "@/components/Navegacion";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "@/components/AppSideBar";
import { cookies } from "next/headers";
import "./mi-tienda.d.css"

import { ToastContainer } from 'react-toastify';

import "leaflet/dist/leaflet.css";


export const metadata: Metadata = {
  title: "Tu comercio flexi",
  description: "Don Pulperia App",
  icons: {
    icon: "/favicon-32x32.png",
  },
};

// Si la fuente está en Google Fonts
const playwrite = Aladin({
  subsets: ['latin'],
  weight: ['400'], // o los pesos disponibles
  display: 'swap',
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // estado = abierto o cerrado
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSideBar />
      <main className={`w-full ${playwrite.className}`}>
        <Navegacion />
        <div className="px-2">{children}</div>
      </main>
      <ToastContainer />
    </SidebarProvider>
  );
}

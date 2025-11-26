
import type { Metadata } from "next";
import { Aladin, Poppins } from "next/font/google";

import Navegacion from "@/components/Navegacion";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "@/components/AppSideBar";
import { cookies } from "next/headers";
import "./mi-tienda.d.css"

import { ToastContainer } from 'react-toastify';

import "leaflet/dist/leaflet.css";
import { ThemeProvider } from "next-themes";


export const metadata: Metadata = {
  title: "Tu comercio flexi",
  description: "Don Pulperia App",
  icons: {
    icon: "/favicon-32x32.png",
  },
};

// Si la fuente está en Google Fonts
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400'], // o los pesos disponibles
  display: 'swap',
})

export default async function TiendaLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ idTienda: string }>;
}>) {

  // estado = abierto o cerrado
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  const { idTienda } = await params

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSideBar idTienda={idTienda} />
        <main className={`w-full ${poppins.className}`}>
          <Navegacion />
          <div className="px-2">{children}</div>
        </main>
        <ToastContainer />
      </SidebarProvider>
    </ThemeProvider>);
}

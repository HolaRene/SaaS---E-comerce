
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Navegacion from "@/components/Navegacion";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "@/components/AppSideBar";
import { cookies } from "next/headers";
import "./mi-tienda.d.css"

import { ToastContainer } from 'react-toastify';

import "leaflet/dist/leaflet.css";
import ConvexClientProvider from "@/app/providers/ConvexProviderWithClerk";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tu comercio flexi",
  description: "Don Pulperia App",
  icons: {
    icon: "/favicon-32x32.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // estado = abierto o cerrado
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSideBar />
              <main className="w-full">
                <Navegacion />
                <div className="px-2">{children}</div>
              </main>
              <ToastContainer />
            </SidebarProvider>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}

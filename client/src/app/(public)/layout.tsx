import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./public.d.css";
import { LpNavbar1 } from "@/components/landing/nav/LpNavbar1";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MiComercio Digital",
  description:
    "Tu Negocio conectado y siempre bajo control en tiempo real",
  icons: {
    icon: "/logo-flexi.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className={`${onest.variable} relative antialiased`}>
      <LpNavbar1 />
      {children}
    </section>

  );
}

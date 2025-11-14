import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./public.d.css";
import { LpNavbar1 } from "@/components/landing/nav/LpNavbar1";
import ConvexClientProvider from "../providers/ConvexProviderWithClerk";
import { ClerkProvider } from '@clerk/nextjs'

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MiTienda Digital",
  description:
    "Tu tienda conectada y siempre bajo control",
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
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${onest.variable} relative antialiased`}>
        <LpNavbar1 />
        <ClerkProvider appearance={{
          layout: {
            socialButtonsVariant: 'iconButton',
            logoImageUrl: '/logo.png'
          },
          variables: {
            colorBackground: '#15171c',
            colorPrimary: '',
            colorText: 'white',
            colorInputBackground: '#1b1f29',
            colorInputText: 'white',
          }
        }}>
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

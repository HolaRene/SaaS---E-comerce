import type { Metadata } from "next";
import "./globals.d.css";
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from "./providers/ConvexProviderWithClerk";
import { Alice } from 'next/font/google'
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next"

// Si la fuente está en Google Fonts
const playwrite = Alice({
    subsets: ['latin'],
    weight: ['400'], // o los pesos disponibles
    display: 'swap',
})

export const metadata: Metadata = {
    title: "PodCastr",
    description: "Crea y comparte tus podcasts fácilmente",
    icons: {
        icon: "/icons/logo.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={playwrite.className}>
                <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string} appearance={{
                    layout: {
                        socialButtonsVariant: 'iconButton',
                        logoImageUrl: '/icons/auth-logo.svg',

                    },
                    variables: {
                        colorBackground: '#15171c',
                        colorPrimary: '',
                        colorText: '#ffffff',
                        colorInput: '#fff',
                        colorInputBackground: '#1b1f29',
                    }
                }}>
                    <ConvexClientProvider>
                        {children}
                        <Toaster />
                        <SpeedInsights />
                    </ConvexClientProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}

import { ClerkProvider } from "@clerk/nextjs";
import Image from "next/image";
import ConvexClientProvider from "../providers/ConvexProviderWithClerk";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <head />
            <body >
                <main className="relative w-full">
                    <ClerkProvider appearance={{
                        layout: {
                            socialButtonsVariant: 'iconButton',
                            logoImageUrl: '/logo.png'
                        },
                        variables: {
                            colorBackground: '#16171c',
                            colorPrimary: '',
                            colorText: 'white',
                            colorInputBackground: '#1b1f29',
                            colorInputText: 'white',
                        }
                    }}>
                        <ConvexClientProvider>
                            {/* Imagen de fondo en el inicio de sesión y crear cuenta. */}
                            <div className="absolute size-full">
                                <Image alt="fondo" src={'/images/bg-img.png'} fill className="size-full" />
                            </div>
                            {children}
                        </ConvexClientProvider>
                    </ClerkProvider>
                </main>
            </body>
        </html>

    );
}
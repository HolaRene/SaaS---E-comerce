import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./public.d.css";
import { LpNavbar1 } from "@/components/landing/nav/LpNavbar1";
import ConvexClientProvider from "../providers/ConvexProviderWithClerk";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

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
        <ClerkProvider>
          <ConvexClientProvider>

            <header className="flex justify-end items-center p-4 gap-4 h-16">
              <SignedOut>
                <SignInButton />
                <SignUpButton>
                  <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
            {children}
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

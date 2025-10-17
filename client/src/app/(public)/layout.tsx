import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./public.d.css";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MiPulpería Digital",
  description:
    "Tu tienda conectada y siempre bajo control",
  icons: {
    icon: "/favicon-32x32.png",
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
        {children}
      </body>
    </html>
  );
}

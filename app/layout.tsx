import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import PenaltyChecker from "@/components/PenaltyChecker";
import { Toaster } from "@/components/Toast";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MMA Mode",
  description: "Rastreador Personal de Entrenamientos MMA",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${bebasNeue.variable} ${inter.variable} dark`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground font-sans min-h-screen antialiased transition-colors duration-300">
        <PenaltyChecker />
        <Toaster />
        <NavBar />
        <main className="pb-24 md:pb-8 md:pl-64">{children}</main>
      </body>
    </html>
  );
}

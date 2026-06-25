import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

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
  title: "KHABIB MODE",
  description: "Rastreador Personal de Entrenamientos MMA",
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
        <NavBar />
        <main className="pb-20 md:pb-8 md:pl-64">{children}</main>
      </body>
    </html>
  );
}

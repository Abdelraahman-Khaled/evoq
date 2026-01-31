import type { Metadata } from "next";
import { Inter, Playfair_Display, Cairo } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });

import StoreInitializer from "@/components/StoreInitializer";

export const metadata: Metadata = {
  title: "ÉVOQUÉ | Sensory Dining Experience",
  description: "A fine dining restaurant in Najran offering a contemporary culinary experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={cn(
        inter.variable,
        playfair.variable,
        cairo.variable,
        "min-h-screen bg-background text-foreground antialiased overflow-x-hidden"
      )}>
        <StoreInitializer />
        {children}
      </body>
    </html>
  );
}

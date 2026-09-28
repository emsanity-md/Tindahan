import type { Metadata } from "next";
import { Gabarito, Instrument_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-gabarito",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tindahan — Inventory and POS for small stores",
  description:
    "A demo inventory and point-of-sale system for small stores. Keep track of products, stock levels, and every transaction in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${gabarito.variable} ${instrument.variable}`}>
      <body className="min-h-svh antialiased">
        <StoreProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster position="top-center" richColors />
        </StoreProvider>
      </body>
    </html>
  );
}

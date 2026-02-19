import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { IntlProvider } from "@/providers/intl-provider";
import type { ReactNode } from "react";

const bisalomSans = Manrope({
  variable: "--font-bisalom-sans",
  subsets: ["latin"],
  display: "swap",
});

const bisalomMono = JetBrains_Mono({
  variable: "--font-bisalom-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bisalom Comunidad",
  description:
    "Plataforma iBMS minimalista para comunicación, incidencias, reservas y pagos en comunidades residenciales.",
  metadataBase: new URL("https://bisalom.example"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${bisalomSans.variable} ${bisalomMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <IntlProvider>{children}</IntlProvider>
      </body>
    </html>
  );
}

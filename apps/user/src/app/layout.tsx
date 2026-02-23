import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { IntlProvider } from "@/providers/intl-provider";
import { env } from "@/lib/env";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import {
  getActiveTenantBranding,
  getEffectiveUserBranding,
  paletteToCssVariables,
} from "@/lib/tenant-branding";
import "./globals.css";

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

const tenantBranding = getActiveTenantBranding();
const userBranding = getEffectiveUserBranding();
const socialPreviewImage =
  userBranding.assets.socialImageContrast ??
  userBranding.assets.socialImage ??
  userBranding.assets.logoContrast ??
  userBranding.assets.logo;

function resolveMetadataBase(): URL {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_BASE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    env.NEXT_PUBLIC_APP_BASE_URL,
    "http://localhost:3000",
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      return new URL(candidate);
    } catch {
      continue;
    }
  }

  return new URL("http://localhost:3000");
}

const metadataBase = resolveMetadataBase();
const socialPreviewUrl = new URL(socialPreviewImage, metadataBase).toString();

export const metadata: Metadata = {
  title: `${userBranding.displayName} | App Residentes`,
  description: tenantBranding.platformDescription,
  metadataBase,
  icons: {
    icon: [
      { url: userBranding.assets.faviconIcoContrast ?? userBranding.assets.faviconIco },
      {
        url: userBranding.assets.favicon16Contrast ?? userBranding.assets.favicon16,
        type: "image/png",
        sizes: "16x16",
      },
      {
        url: userBranding.assets.favicon32Contrast ?? userBranding.assets.favicon32,
        type: "image/png",
        sizes: "32x32",
      },
    ],
    apple: [
      {
        url: userBranding.assets.appleTouchIconContrast ?? userBranding.assets.appleTouchIcon,
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },
  openGraph: {
    title: `${userBranding.displayName} | App Residentes`,
    description: tenantBranding.platformDescription,
    images: [
      {
        url: socialPreviewUrl,
        width: 512,
        height: 512,
        alt: `Imagen de ${userBranding.displayName}`,
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${userBranding.displayName} | App Residentes`,
    description: tenantBranding.platformDescription,
    images: [socialPreviewUrl],
  },
  manifest: userBranding.assets.manifest,
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
        style={paletteToCssVariables(tenantBranding.palette)}
      >
        <IntlProvider>
          {children}
          <PwaInstallPrompt />
        </IntlProvider>
      </body>
    </html>
  );
}

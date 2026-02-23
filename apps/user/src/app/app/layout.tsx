import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getEffectiveUserBranding } from "@/lib/tenant-branding";
import { AppShell } from "./shell";

const userBranding = getEffectiveUserBranding();

export const metadata: Metadata = {
  title: `${userBranding.displayName} | App Residentes`,
};

export default function Layout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

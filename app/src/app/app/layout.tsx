import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "./shell";

export const metadata: Metadata = {
  title: "User App - Bisalom",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

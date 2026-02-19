"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  CalendarClock,
  Home,
  QrCode,
  ShieldAlert,
  Users,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";
import { getEffectiveUserBranding, paletteToCssVariables } from "@/lib/tenant-branding";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
};

const navItems: NavItem[] = [
  { href: "/user/home", label: "Inicio", icon: Home },
  {
    href: "/user/incidents",
    label: "Incidencias",
    icon: ShieldAlert,
  },
  {
    href: "/user/bookings",
    label: "Reservas",
    icon: CalendarClock,
  },
  { href: "/user/community", label: "Comunidad", icon: Users },
  { href: "/user/wallet", label: "Billetera", icon: Wallet },
  { href: "/user/passes", label: "Accesos", icon: QrCode },
];

function isItemActive(pathname: string | null, item: NavItem) {
  if (!pathname) return false;
  const normalizedPath = pathname.startsWith("/app/")
    ? pathname.replace("/app/", "/user/")
    : pathname === "/app"
      ? "/user"
      : pathname;
  return normalizedPath.startsWith(item.href);
}

function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-white/95 backdrop-blur-md lg:hidden">
      <div className="mx-auto w-full max-w-md">
        <ul className="grid grid-cols-6 px-2 py-2 text-xs font-semibold text-[var(--muted)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(pathname, item);
            return (
              <li key={item.href} className="flex flex-col items-center">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-1 rounded-md px-2 py-1 transition ${
                    active ? "text-[var(--primary)]" : "hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden gap-2 overflow-x-auto pb-2 pt-1 lg:flex">
      {navItems.map((item) => {
        const active = isItemActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              active
                ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                : "border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--primary)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const activeCommunityId =
    typeof window === "undefined"
      ? undefined
      : window.localStorage.getItem("nms_active_community_id")?.trim() || undefined;
  const userBranding = getEffectiveUserBranding(activeCommunityId);

  async function onLogout() {
    window.localStorage.removeItem("nms_active_community_id");
    await signOut({ callbackUrl: "/sign-in" });
  }

  return (
    <div
      className="min-h-screen bg-[var(--background)] pb-24 lg:pb-8"
      style={paletteToCssVariables(userBranding.palette)}
    >
      <div className="mx-auto w-full max-w-md lg:max-w-[1120px] lg:px-6">
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/95 backdrop-blur lg:top-4 lg:rounded-2xl lg:border lg:shadow-sm">
          <div className="mx-auto flex w-full items-center justify-between px-4 py-3 lg:px-5">
            <div className="flex items-center gap-3">
              <Image
                src={userBranding.logo}
                alt={`Logo ${userBranding.displayName}`}
                width={112}
                height={30}
                priority
                className="h-7 w-auto"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  User App
                </p>
                <h1 className="text-lg font-bold text-[var(--foreground)]">{userBranding.displayName}</h1>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void onLogout()}
              className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)]"
            >
              Salir
            </button>
          </div>
          <div className="px-4 lg:px-5">
            <DesktopNav />
          </div>
        </header>

        <main className="mx-auto w-full px-3 py-4 lg:px-0 lg:py-8">
          <div className="lg:mx-auto lg:max-w-[920px] lg:rounded-2xl lg:border lg:border-[var(--border)] lg:bg-white lg:p-6 lg:shadow-sm">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

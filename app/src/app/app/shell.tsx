"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarClock,
  Home,
  QrCode,
  ShieldAlert,
  Users,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { href: "/app/home", label: "Inicio", icon: Home },
  { href: "/app/incidents", label: "Incidencias", icon: ShieldAlert },
  { href: "/app/bookings", label: "Reservas", icon: CalendarClock },
  { href: "/app/community", label: "Comunidad", icon: Users },
  { href: "/app/wallet", label: "Billetera", icon: Wallet },
  { href: "/app/passes", label: "Accesos", icon: QrCode },
];

function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-white/95 backdrop-blur-md">
      <ul className="grid grid-cols-6 px-2 py-2 text-xs font-semibold text-[var(--muted)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname?.startsWith(item.href);
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
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();

  async function onLogout() {
    await fetch("/api/auth/local-logout", { method: "POST" });
    router.replace("/sign-in");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--border)] bg-white/95 px-4 py-3 backdrop-blur">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Comunidad
          </p>
          <h1 className="text-lg font-bold text-[var(--foreground)]">Bisalom Residencial</h1>
        </div>
        <button
          type="button"
          onClick={() => void onLogout()}
          className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)]"
        >
          Salir
        </button>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
      <BottomNav />
    </div>
  );
}

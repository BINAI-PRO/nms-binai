"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/access", label: "Accesos" },
  { href: "/admin/incidents", label: "Incidencias" },
  { href: "/admin/bookings", label: "Reservas" },
  { href: "/admin/payments", label: "Pagos" },
  { href: "/admin/documents", label: "Documentos" },
  { href: "/admin/settings", label: "Config" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function onLogout() {
    await fetch("/api/auth/local-logout", { method: "POST" });
    router.replace("/sign-in");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              NMS BInAI
            </p>
            <h1 className="text-lg font-bold text-[var(--foreground)]">Panel administrativo</h1>
          </div>
          <button
            type="button"
            onClick={() => void onLogout()}
            className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)]"
          >
            Salir
          </button>
        </div>

        <nav className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 pb-3">
          {adminNav.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-[var(--primary)] text-white"
                    : "border border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--primary)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-5">{children}</main>
    </div>
  );
}

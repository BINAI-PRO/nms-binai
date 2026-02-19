"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BarChart3,
  Building2,
  CalendarClock,
  ClipboardList,
  CreditCard,
  FileText,
  QrCode,
  Settings,
  ShieldAlert,
  UsersRound,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";
import { getActiveTenantBranding } from "@/lib/tenant-branding";

type AdminNavItem = {
  href: string;
  label: string;
  icon: typeof BarChart3;
};

const adminNav: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/access", label: "Accesos QR", icon: QrCode },
  { href: "/admin/clients", label: "Clientes", icon: UsersRound },
  { href: "/admin/suppliers", label: "Proveedores", icon: Wrench },
  { href: "/admin/availability", label: "Disponibilidad", icon: CalendarClock },
  { href: "/admin/facilities", label: "Areas", icon: Building2 },
  { href: "/admin/incidents", label: "Incidencias", icon: ShieldAlert },
  { href: "/admin/payments", label: "Pagos", icon: CreditCard },
  { href: "/admin/documents", label: "Documentos", icon: FileText },
  { href: "/admin/reports", label: "Reportes", icon: ClipboardList },
  { href: "/admin/settings", label: "Configuracion", icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const tenantBranding = getActiveTenantBranding();

  async function onLogout() {
    await signOut({ callbackUrl: "/sign-in" });
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Image
              src={tenantBranding.assets.logo}
              alt={`Logo ${tenantBranding.companyName}`}
              width={112}
              height={30}
              priority
              className="h-7 w-auto"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              {tenantBranding.adminAppName}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void onLogout()}
            className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)]"
          >
            Salir
          </button>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3">
          {adminNav.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
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
                <span className="inline-flex items-center gap-1.5">
                  <Icon size={14} />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px]">
        <aside className="hidden lg:flex lg:h-screen lg:w-72 lg:flex-col lg:sticky lg:top-0 lg:border-r lg:border-[var(--border)] lg:bg-white">
          <div className="px-5 py-6">
            <Image
              src={tenantBranding.assets.logo}
              alt={`Logo ${tenantBranding.companyName}`}
              width={148}
              height={40}
              priority
              className="h-9 w-auto"
            />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              {tenantBranding.adminAppName}
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {tenantBranding.adminDescription}
            </p>
          </div>

          <nav className="flex-1 space-y-1 px-3 pb-4">
            {adminNav.map((item) => {
              const active = pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--foreground)] hover:bg-slate-100"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon size={16} />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[var(--border)] p-4">
            <button
              type="button"
              onClick={() => void onLogout()}
              className="w-full rounded-lg bg-[var(--primary)]/10 px-3 py-2 text-sm font-semibold text-[var(--primary)]"
            >
              Cerrar sesion
            </button>
          </div>
        </aside>

        <main className="w-full flex-1 px-4 py-5 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

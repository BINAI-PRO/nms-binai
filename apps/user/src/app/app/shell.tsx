"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  CalendarClock,
  ChevronDown,
  Home,
  LogOut,
  QrCode,
  ShieldAlert,
  UserCircle2,
  Users,
  Wallet,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { getActiveTenantBranding, getEffectiveUserBranding, paletteToCssVariables } from "@/lib/tenant-branding";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
};

type SessionSummary = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
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

function getUserInitials(name?: string | null, email?: string | null) {
  const source = (name && name.trim().length > 0 ? name : email)?.trim() ?? "";
  if (!source) return "US";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

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
                  className={`flex w-full flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition ${
                    active ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "hover:text-[var(--foreground)]"
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
                ? "border-transparent bg-[var(--primary)] text-white"
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

function PoweredFooter() {
  const tenantBranding = getActiveTenantBranding();

  return (
    <footer className="px-3 pb-24 pt-2 lg:px-0 lg:pb-8">
      <div className="mx-auto w-full max-w-md lg:max-w-[920px]">
        <div className="card flex items-center justify-center gap-3 px-4 py-3 text-xs text-[var(--muted)]">
          <Image
            src={tenantBranding.assets.logo}
            alt={`Logo ${tenantBranding.companyName}`}
            width={176}
            height={48}
            className="h-10 w-auto opacity-90"
          />
          <span>BISALOM Administrador Residencial</span>
        </div>
      </div>
    </footer>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const userBranding = getEffectiveUserBranding();
  const pathname = usePathname();
  const [menuOpenPath, setMenuOpenPath] = useState<string | null>(null);
  const [sessionSummary, setSessionSummary] = useState<SessionSummary>({});
  const [failedAvatarSrc, setFailedAvatarSrc] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const normalizedPath = pathname?.startsWith("/app/")
    ? pathname.replace("/app/", "/user/")
    : pathname === "/app"
      ? "/user"
      : pathname;
  const showPoweredFooter = !normalizedPath?.startsWith("/user/home");
  const menuOpen = Boolean(pathname && menuOpenPath === pathname);
  const avatarInitials = useMemo(
    () => getUserInitials(sessionSummary.name, sessionSummary.email),
    [sessionSummary.email, sessionSummary.name]
  );

  useEffect(() => {
    const controller = new AbortController();
    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) return;
        const payload = (await response.json()) as { user?: SessionSummary | null };
        setSessionSummary(payload.user ?? {});
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setSessionSummary({});
        }
      }
    }
    void loadSession();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenPath(null);
      }
    }
    if (!menuOpen) return;
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen]);

  async function onLogout() {
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
                width={132}
                height={38}
                priority
                className="h-8 w-auto"
              />
              <p className="hidden text-sm font-semibold text-[var(--foreground)] sm:block">App Residentes</p>
            </div>
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() =>
                  setMenuOpenPath((current) => (current === pathname || !pathname ? null : pathname))
                }
                className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-2 py-1 text-xs font-semibold text-[var(--foreground)] shadow-sm transition hover:border-[var(--primary)]"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                aria-label="Abrir menu de cuenta"
              >
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[var(--primary)]/15 text-[11px] font-bold uppercase text-[var(--primary)]">
                  {sessionSummary.image && sessionSummary.image !== failedAvatarSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sessionSummary.image}
                      alt={sessionSummary.name ? `Foto de ${sessionSummary.name}` : "Foto de perfil"}
                      className="h-full w-full object-cover"
                      onError={() => setFailedAvatarSrc(sessionSummary.image ?? null)}
                    />
                  ) : (
                    avatarInitials
                  )}
                </span>
                <ChevronDown size={14} className={`${menuOpen ? "rotate-180" : ""} transition`} />
              </button>

              {menuOpen ? (
                <div className="absolute right-0 top-11 z-50 w-52 overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-lg">
                  <div className="border-b border-[var(--border)] px-3 py-2">
                    <p className="line-clamp-1 text-xs font-semibold text-[var(--foreground)]">
                      {sessionSummary.name ?? "Mi cuenta"}
                    </p>
                    <p className="line-clamp-1 text-[11px] text-[var(--muted)]">{sessionSummary.email ?? ""}</p>
                  </div>
                  <Link
                    href="/user/profile"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--foreground)] transition hover:bg-[var(--primary)]/10"
                    onClick={() => setMenuOpenPath(null)}
                  >
                    <UserCircle2 size={16} />
                    Perfil
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpenPath(null);
                      void onLogout();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--foreground)] transition hover:bg-[var(--primary)]/10"
                  >
                    <LogOut size={16} />
                    Cerrar sesion
                  </button>
                </div>
              ) : null}
            </div>
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
      {showPoweredFooter ? <PoweredFooter /> : null}
      <BottomNav />
    </div>
  );
}

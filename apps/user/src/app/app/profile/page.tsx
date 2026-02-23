"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Building2, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  active_community_id?: string | null;
  unit_id_optional?: string | null;
  building_id_optional?: string | null;
};

function getInitials(name?: string | null, email?: string | null) {
  const source = (name && name.trim().length > 0 ? name : email)?.trim() ?? "";
  if (!source) return "US";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export default function ProfilePage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [failedAvatarSrc, setFailedAvatarSrc] = useState<string | null>(null);
  const initials = useMemo(() => getInitials(user?.name, user?.email), [user?.email, user?.name]);

  useEffect(() => {
    const controller = new AbortController();
    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) return;
        const payload = (await response.json()) as { user?: SessionUser | null };
        setUser(payload.user ?? null);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setUser(null);
        }
      }
    }
    void loadSession();
    return () => controller.abort();
  }, []);

  return (
    <section className="space-y-4">
      <div className="card p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Perfil</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[var(--primary)]/15 text-lg font-bold uppercase text-[var(--primary)]">
            {user?.image && user?.image !== failedAvatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user?.name ? `Foto de ${user.name}` : "Foto de perfil"}
                className="h-full w-full object-cover"
                onError={() => setFailedAvatarSrc(user.image ?? null)}
              />
            ) : (
              initials
            )}
          </span>
          <div>
            <p className="text-base font-bold text-[var(--foreground)]">{user?.name ?? "Usuario"}</p>
            <p className="text-sm text-[var(--muted)]">{user?.email ?? "Sin correo"}</p>
          </div>
        </div>
      </div>

      <div className="card divide-y divide-[var(--border)]">
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--foreground)]">
          <ShieldCheck size={16} className="text-[var(--primary)]" />
          <span>Rol: {user?.role ?? "resident"}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--foreground)]">
          <Building2 size={16} className="text-[var(--primary)]" />
          <span>Comunidad activa: {user?.active_community_id ?? "No asignada"}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--foreground)]">
          <UserRound size={16} className="text-[var(--primary)]" />
          <span>Unidad: {user?.unit_id_optional ?? "No asignada"}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--foreground)]">
          <Mail size={16} className="text-[var(--primary)]" />
          <span>Edificio: {user?.building_id_optional ?? "No asignado"}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href="/user/home"
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary)]"
        >
          Volver al inicio
        </Link>
        <button
          type="button"
          onClick={() => void signOut({ callbackUrl: "/sign-in" })}
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          Cerrar sesion
        </button>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { getActiveTenantBranding } from "@/lib/tenant-branding";

type SessionPayload = {
  user?: {
    role?: string;
  };
};

export default function SignInPage() {
  const router = useRouter();
  const tenantBranding = getActiveTenantBranding();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [communityId, setCommunityId] = useState(() => {
    const fallbackCommunityId = process.env.NEXT_PUBLIC_DEFAULT_COMMUNITY_ID ?? "";
    if (typeof window === "undefined") return fallbackCommunityId;
    return window.localStorage.getItem("nms_active_community_id")?.trim() || fallbackCommunityId;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("supabase-password", {
        email,
        password,
        communityId: communityId || undefined,
        redirect: false,
      });

      if (!result || result.error) {
        throw new Error("Correo o password incorrecto");
      }

      const selectedCommunityId = communityId.trim();
      if (selectedCommunityId) {
        window.localStorage.setItem("nms_active_community_id", selectedCommunityId);
      } else {
        window.localStorage.removeItem("nms_active_community_id");
      }

      const sessionResponse = await fetch("/api/auth/session", { cache: "no-store" });
      const session = (await sessionResponse.json()) as SessionPayload;
      const role = session?.user?.role ?? "resident";

      if (role === "admin" || role === "staff") {
        await signOut({ redirect: false });
        throw new Error("Tu cuenta es administrativa. Usa la app admin.");
      }
      router.replace("/user/home");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar sesion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <section className="card w-full max-w-md space-y-6 p-6">
        <header className="space-y-1 text-center">
          <div className="flex justify-center">
            <Image
              src={tenantBranding.assets.logo}
              alt={`Logo ${tenantBranding.companyName}`}
              width={168}
              height={46}
              priority
              className="h-11 w-auto"
            />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            {tenantBranding.userAppName}
          </p>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Acceso por Supabase Auth</h1>
          <p className="text-sm text-[var(--muted)]">
            Ingresa con correo y password registrados en Supabase.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--foreground)]">Correo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
              placeholder="tu@email.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--foreground)]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
              placeholder="********"
            />
          </div>

          <div className="space-y-2">
            <details className="rounded-lg border border-[var(--border)] bg-slate-50 px-3 py-2">
              <summary className="cursor-pointer text-sm font-semibold text-[var(--foreground)]">
                Opcional: seleccionar comunidad
              </summary>
              <input
                type="text"
                value={communityId}
                onChange={(event) => setCommunityId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
                placeholder="UUID de comunidad"
              />
            </details>
          </div>

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}

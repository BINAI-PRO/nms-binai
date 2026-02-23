"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { getActiveTenantBranding, getEffectiveUserBranding, paletteToCssVariables } from "@/lib/tenant-branding";

type SessionPayload = {
  user?: {
    role?: string;
  };
};

export default function SignInPage() {
  const router = useRouter();
  const tenantBranding = getActiveTenantBranding();
  const userBranding = getEffectiveUserBranding();
  const fixedCommunityId = (process.env.NEXT_PUBLIC_DEFAULT_COMMUNITY_ID ?? "").trim();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!fixedCommunityId) {
        throw new Error("Falta NEXT_PUBLIC_DEFAULT_COMMUNITY_ID en .env.local");
      }

      const result = await signIn("supabase-password", {
        email,
        password,
        communityId: fixedCommunityId,
        redirect: false,
      });

      if (!result || result.error) {
        throw new Error("Correo o password incorrecto");
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
    <main
      className="flex min-h-screen items-center justify-center px-4 py-8"
      style={paletteToCssVariables(userBranding.palette)}
    >
      <section className="card w-full max-w-md overflow-hidden">
        <div className="relative h-40 w-full">
          <Image
            src="/encino/portada.webp"
            alt="Portada Residencial Encino"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.16em]">Acceso residentes</p>
            <p className="text-lg font-bold">{tenantBranding.userAppName}</p>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <header className="space-y-1 text-center">
            <div className="flex justify-center">
              <Image
                src={userBranding.logo}
                alt={`Logo ${userBranding.displayName}`}
                width={180}
                height={48}
                priority
                className="h-11 w-auto"
              />
            </div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">Acceso seguro</h1>
            <p className="text-sm text-[var(--muted)]">Ingresa con correo y password registrados en Supabase.</p>
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

            {error ? <p className="text-sm font-medium text-[var(--danger)]">{error}</p> : null}

            <button
              disabled={loading}
              className="w-full rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <footer className="flex items-center justify-center gap-3 border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">
            <Image
              src={tenantBranding.assets.logo}
              alt={`Logo ${tenantBranding.companyName}`}
              width={176}
              height={48}
              className="h-10 w-auto opacity-90"
            />
            <span>BISALOM Administrador Residencial</span>
          </footer>
        </div>
      </section>
    </main>
  );
}

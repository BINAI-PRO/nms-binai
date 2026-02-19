"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/local-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "No se pudo iniciar sesion");
      }

      router.replace(data.redirectPath ?? "/app/home");
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
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            NMS BInAI
          </p>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Acceso a plataforma</h1>
          <p className="text-sm text-[var(--muted)]">
            Login simple temporal con usuario y password.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--foreground)]">Usuario</label>
            <input
              type="text"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
              placeholder="admin o residente"
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

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="rounded-lg border border-dashed border-[var(--border)] bg-white px-3 py-3 text-xs text-[var(--muted)]">
          <p className="font-semibold text-[var(--foreground)]">Credenciales de prueba</p>
          <p>Admin: LOCAL_ADMIN_USER / LOCAL_ADMIN_PASS</p>
          <p>Residente: LOCAL_RESIDENT_USER / LOCAL_RESIDENT_PASS</p>
        </div>
      </section>
    </main>
  );
}

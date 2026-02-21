"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error("App route error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Error en la aplicación</h1>
      <p className="text-sm text-[var(--muted)]">
        Ocurrió un problema al cargar esta vista. Puedes intentar nuevamente.
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        Reintentar
      </button>
    </main>
  );
}

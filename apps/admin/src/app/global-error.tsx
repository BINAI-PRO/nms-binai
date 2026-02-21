"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="bg-[var(--background)] text-[var(--foreground)]">
        <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-2xl font-bold">Error crítico</h1>
          <p className="text-sm opacity-80">
            {error?.message || "Se presentó un error inesperado."}
          </p>
          <button
            onClick={reset}
            className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}

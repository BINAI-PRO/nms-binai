import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <section className="card w-full max-w-md space-y-4 p-6 text-center">
        <h1 className="text-xl font-bold text-[var(--foreground)]">Registro no habilitado</h1>
        <p className="text-sm text-[var(--muted)]">
          El alta de usuarios se realiza en Supabase Auth o desde procesos administrativos.
        </p>
        <Link
          href="/sign-in"
          className="inline-flex items-center justify-center rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Ir a iniciar sesion
        </Link>
      </section>
    </main>
  );
}

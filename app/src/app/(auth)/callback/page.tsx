export default function CallbackPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="card w-full max-w-md space-y-4 p-6 text-center">
        <h1 className="text-lg font-bold text-[var(--foreground)]">Callback no activo</h1>
        <p className="text-sm text-[var(--muted)]">
          Este flujo de callback no esta en uso. Inicia sesion desde /sign-in con correo y password de Supabase Auth.
        </p>
      </div>
    </main>
  );
}

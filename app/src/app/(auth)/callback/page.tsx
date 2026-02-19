export default function CallbackPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="card w-full max-w-md space-y-4 p-6 text-center">
        <h1 className="text-lg font-bold text-[var(--foreground)]">Callback no activo</h1>
        <p className="text-sm text-[var(--muted)]">
          El proyecto esta usando login local temporal. Regresa a /sign-in para entrar con usuario y password.
        </p>
      </div>
    </main>
  );
}

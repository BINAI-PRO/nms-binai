import Image from "next/image";
import Link from "next/link";
import { getActiveTenantBranding } from "@/lib/tenant-branding";

export default function Home() {
  const tenantBranding = getActiveTenantBranding();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10">
      <section className="grid w-full gap-4 md:grid-cols-2">
        <article className="card space-y-3 p-6">
          <Image
            src={tenantBranding.assets.logo}
            alt={`Logo ${tenantBranding.companyName}`}
            width={170}
            height={46}
            priority
            className="h-10 w-auto"
          />
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            User App
          </p>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{tenantBranding.userAppName}</h1>
          <p className="text-sm text-[var(--muted)]">
            {tenantBranding.userDescription}
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/user"
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
            >
              Abrir user app
            </Link>
            <Link
              href="/sign-in"
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
            >
              Iniciar sesion
            </Link>
          </div>
        </article>

        <article className="card space-y-3 p-6">
          <Image
            src={tenantBranding.assets.logo}
            alt={`Logo ${tenantBranding.companyName}`}
            width={170}
            height={46}
            priority
            className="h-10 w-auto"
          />
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Admin App
          </p>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">{tenantBranding.adminAppName}</h2>
          <p className="text-sm text-[var(--muted)]">
            {tenantBranding.adminDescription}
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="rounded-lg bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-white"
            >
              Abrir admin app
            </Link>
            <Link
              href="/sign-in"
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
            >
              Iniciar sesion
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}

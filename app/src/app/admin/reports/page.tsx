import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

type ReportMetric = {
  label: string;
  table: string;
};

const REPORT_METRICS: ReportMetric[] = [
  { label: "Usuarios", table: "users" },
  { label: "Membresias", table: "memberships" },
  { label: "Proveedores", table: "suppliers" },
  { label: "Incidencias", table: "incidents" },
  { label: "Reservas", table: "bookings" },
  { label: "Pases QR", table: "access_passes" },
  { label: "Wallet TX", table: "wallet_transactions" },
  { label: "Documentos", table: "documents" },
];

async function tableCount(table: string) {
  if (!supabaseAdmin) return null;
  const res = await supabaseAdmin.from(table).select("*", { count: "exact", head: true });
  if (res.error) return null;
  return res.count ?? 0;
}

export default async function AdminReportsPage() {
  if (!supabaseAdmin) {
    return (
      <section className="card space-y-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Admin - reportes
        </p>
        <h2 className="text-lg font-bold text-[var(--foreground)]">Configuracion pendiente</h2>
        <p className="text-sm text-[var(--muted)]">
          Faltan variables de Supabase para generar reportes ejecutivos.
        </p>
      </section>
    );
  }

  const metrics = await Promise.all(
    REPORT_METRICS.map(async (metric) => ({
      ...metric,
      count: await tableCount(metric.table),
    }))
  );

  return (
    <section className="space-y-4">
      <header className="card space-y-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Admin - reportes
        </p>
        <h2 className="text-lg font-bold text-[var(--foreground)]">Reporte operativo consolidado</h2>
        <p className="text-sm text-[var(--muted)]">
          Seguimiento de operacion, seguridad, finanzas y documentacion con trazabilidad.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.table} className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
              {metric.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">
              {metric.count === null ? "--" : metric.count}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">{metric.table}</p>
          </article>
        ))}
      </div>

      <section className="card space-y-3 p-5">
        <h3 className="text-sm font-bold text-[var(--foreground)]">Rutas de gestion</h3>
        <div className="grid gap-2 md:grid-cols-2">
          {[
            { href: "/admin/dashboard", label: "Dashboard general" },
            { href: "/admin/access", label: "Accesos QR y tokens" },
            { href: "/admin/clients", label: "Altas y bajas de clientes" },
            { href: "/admin/availability", label: "Disponibilidad y calendario" },
            { href: "/admin/payments", label: "Cobros y movimientos" },
            { href: "/admin/audit", label: "Auditoria de eventos" },
          ].map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary)]"
            >
              {route.label}
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}

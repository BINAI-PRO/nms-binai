import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

type MetricCard = {
  label: string;
  table: string;
};

const METRICS: MetricCard[] = [
  { label: "Usuarios", table: "users" },
  { label: "Membresias", table: "memberships" },
  { label: "Incidencias", table: "incidents" },
  { label: "Reservas", table: "bookings" },
  { label: "Transacciones", table: "wallet_transactions" },
  { label: "Pases QR", table: "access_passes" },
  { label: "Documentos", table: "documents" },
];

const ADMIN_LINKS = [
  { href: "/admin/access", label: "Control de accesos" },
  { href: "/admin/clients", label: "Clientes y roles" },
  { href: "/admin/availability", label: "Disponibilidad de areas" },
  { href: "/admin/suppliers", label: "Proveedores" },
  { href: "/admin/incidents", label: "Incidencias" },
  { href: "/admin/bookings", label: "Reservas" },
  { href: "/admin/payments", label: "Pagos" },
  { href: "/admin/reports", label: "Reportes" },
];

async function tableCount(table: string) {
  if (!supabaseAdmin) return null;
  const countRes = await supabaseAdmin.from(table).select("*", { count: "exact", head: true });
  if (countRes.error) return null;
  return countRes.count ?? 0;
}

export default async function AdminDashboardPage() {
  if (!supabaseAdmin) {
    return (
      <section className="card space-y-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Admin - dashboard
        </p>
        <h2 className="text-lg font-bold text-[var(--foreground)]">Configuracion pendiente</h2>
        <p className="text-sm text-[var(--muted)]">
          Faltan variables de Supabase para habilitar el control administrativo.
        </p>
      </section>
    );
  }

  const metrics = await Promise.all(
    METRICS.map(async (metric) => ({
      ...metric,
      value: await tableCount(metric.table),
    }))
  );

  return (
    <section className="space-y-4">
      <header className="card space-y-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Admin - dashboard
        </p>
        <h2 className="text-lg font-bold text-[var(--foreground)]">Centro de control NMS BInAI</h2>
        <p className="text-sm text-[var(--muted)]">
          Vista operativa central para administrar comunidad, accesos, incidencias, reservas, pagos y
          documentos.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((item) => (
          <article key={item.table} className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
              {item.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">
              {item.value === null ? "--" : item.value}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">{item.table}</p>
          </article>
        ))}
      </div>

      <section className="card space-y-3 p-5">
        <h3 className="text-sm font-bold text-[var(--foreground)]">Modulos admin</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {ADMIN_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}

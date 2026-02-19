import Link from "next/link";
import { mockIncidents } from "@/data/mock";
import { ArrowUpRight } from "lucide-react";

export default function Page() {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Incidencias
          </p>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Seguimiento</h1>
        </div>
        <Link
          href="/app/incidents/new"
          className="rounded-full bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
        >
          Reportar
        </Link>
      </header>

      <div className="grid gap-3">
        {mockIncidents.map((incident) => (
          <Link
            href={`/app/incidents/${incident.id}`}
            key={incident.id}
            className="card block p-4 hover:border-[var(--primary)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  {incident.category}
                </p>
                <h3 className="text-base font-semibold text-[var(--foreground)]">
                  {incident.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--muted)] line-clamp-2">
                  {incident.description}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="chip bg-[var(--primary)]/10 text-[var(--primary)]">{incident.status}</span>
                  <span className="chip bg-amber-50 text-amber-700">Prioridad {incident.priority}</span>
                  <span className="text-[var(--muted)]">{incident.createdAt}</span>
                </div>
              </div>
              <ArrowUpRight size={16} className="text-[var(--muted)]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

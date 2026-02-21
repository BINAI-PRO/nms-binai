import { notFound } from "next/navigation";
import { CheckCircle2, Clock } from "lucide-react";
import { mockIncidents } from "@/data/mock";

type PageProps = { params: Promise<{ id: string }> };

export default async function IncidentDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const incident = mockIncidents.find((item) => item.id === resolvedParams.id);
  if (!incident) return notFound();

  return (
    <div className="space-y-4">
      <div className="card space-y-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          {incident.category}
        </p>
        <h1 className="text-xl font-bold text-[var(--foreground)]">{incident.title}</h1>
        <p className="text-sm text-[var(--muted)]">{incident.description}</p>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="chip bg-[var(--primary)]/10 text-[var(--primary)]">{incident.status}</span>
          <span className="chip bg-amber-50 text-amber-700">Prioridad {incident.priority}</span>
          <span className="text-[var(--muted)]">{incident.createdAt}</span>
        </div>
      </div>

      <div className="card space-y-3 p-5">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Linea de tiempo</h3>
        <div className="space-y-2">
          <TimelineItem label="Creada" detail="Reporte recibido" />
          <TimelineItem label="En progreso" detail="Tecnico asignado" active />
          <TimelineItem label="Resuelta" detail="Pendiente" muted />
        </div>
      </div>

      <div className="card space-y-2 p-5">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Comentarios</h3>
        <div className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--muted)]">
          Anade tu actualizacion aqui...
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  label,
  detail,
  active,
  muted,
}: {
  label: string;
  detail: string;
  active?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`mt-0.5 rounded-full p-1 ${
          active ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "bg-[var(--border)] text-[var(--muted)]"
        }`}
      >
        {active ? <CheckCircle2 size={16} /> : <Clock size={14} />}
      </div>
      <div className={muted ? "opacity-60" : ""}>
        <p className="text-sm font-semibold text-[var(--foreground)]">{label}</p>
        <p className="text-xs text-[var(--muted)]">{detail}</p>
      </div>
    </div>
  );
}

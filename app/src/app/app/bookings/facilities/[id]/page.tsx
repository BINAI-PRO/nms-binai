import { notFound } from "next/navigation";
import { CalendarClock, CheckCircle } from "lucide-react";
import { mockFacilities } from "@/data/mock";

type PageProps = { params: Promise<{ id: string }> };

export default async function FacilityDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const facility = mockFacilities.find((item) => item.id === resolvedParams.id);
  if (!facility) return notFound();

  return (
    <div className="space-y-4">
      <div className="card space-y-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          {facility.type}
        </p>
        <h1 className="text-xl font-bold text-[var(--foreground)]">{facility.name}</h1>
        <p className="text-sm text-[var(--muted)]">{facility.location}</p>
        <span className="inline-flex w-fit rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)]">
          {facility.status}
        </span>
      </div>

      <div className="card space-y-3 p-5">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Horarios disponibles</h3>
        <div className="space-y-2 text-sm text-[var(--foreground)]">
          <Slot label="Hoy" time="18:00 - 19:00" />
          <Slot label="Hoy" time="19:00 - 20:00" />
          <Slot label="Manana" time="09:00 - 10:00" />
        </div>
      </div>
    </div>
  );
}

function Slot({ label, time }: { label: string; time: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2">
      <div className="flex items-center gap-2 text-sm text-[var(--foreground)]">
        <CalendarClock size={16} className="text-[var(--muted)]" />
        <span className="font-semibold">{label}</span>
        <span className="text-[var(--muted)]">{time}</span>
      </div>
      <button className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white">
        <CheckCircle size={14} />
        Reservar
      </button>
    </div>
  );
}

import { notFound } from "next/navigation";
import {
  CircleSlash,
  Clock3,
  Dumbbell,
  ShieldCheck,
  TicketCheck,
  Trophy,
  Waves,
} from "lucide-react";
import { mockFacilities } from "@/data/mock";

type PageProps = { params: Promise<{ id: string }> };

function AmenityIcon({ facilityId, size = 18 }: { facilityId: string; size?: number }) {
  if (facilityId.includes("pool")) return <Waves size={size} />;
  if (facilityId.includes("padel")) return <Trophy size={size} />;
  return <Dumbbell size={size} />;
}

function slotStatusClasses(status: string) {
  if (status === "available") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (status === "booked") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }
  return "border-rose-200 bg-rose-50 text-rose-800";
}

function slotActionLabel(status: string) {
  if (status === "available") return "Reservar";
  if (status === "booked") return "Ver detalle";
  return "Bloqueado";
}

export default async function FacilityDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const facility = mockFacilities.find((item) => item.id === resolvedParams.id);
  if (!facility) return notFound();

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden p-0">
        <div className={`bg-gradient-to-r p-4 text-white ${facility.accentClass}`}>
          <div className="flex items-center gap-2">
            <AmenityIcon facilityId={facility.id} />
            <p className="text-sm font-semibold">{facility.type}</p>
          </div>
          <h1 className="mt-1 text-2xl font-bold">{facility.name}</h1>
          <p className="text-sm text-white/90">{facility.location}</p>
        </div>

        <div className="grid gap-2 p-4 text-xs sm:grid-cols-2">
          <p className="rounded-lg border border-[var(--border)] bg-slate-50 px-2 py-2 text-[var(--muted)]">
            <span className="font-semibold text-[var(--foreground)]">Intervalo:</span> {facility.slotIntervalMinutes} min
          </p>
          <p className="rounded-lg border border-[var(--border)] bg-slate-50 px-2 py-2 text-[var(--muted)]">
            <span className="font-semibold text-[var(--foreground)]">Duracion maxima:</span> {Math.floor(facility.maxDurationMinutes / 60)} h
          </p>
          <p className="rounded-lg border border-[var(--border)] bg-slate-50 px-2 py-2 text-[var(--muted)]">
            <span className="font-semibold text-[var(--foreground)]">Paso:</span> {facility.durationStepMinutes} min
          </p>
          <p className="rounded-lg border border-[var(--border)] bg-slate-50 px-2 py-2 text-[var(--muted)]">
            <span className="font-semibold text-[var(--foreground)]">Capacidad:</span> {facility.maxCapacity}
          </p>
        </div>
      </div>

      <div className="card space-y-3 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Reglas de uso</h2>
        <div className="grid gap-2">
          {facility.rules.map((rule) => (
            <div
              key={rule}
              className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)]"
            >
              <ShieldCheck size={16} className="mt-0.5 text-[var(--primary)]" />
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card space-y-3 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Disponibilidad de hoy</h2>
        <div className="space-y-2">
          {facility.slots.map((slot) => {
            const isAvailable = slot.status === "available";
            return (
              <div
                key={slot.id}
                className={`rounded-xl border px-3 py-2 ${slotStatusClasses(slot.status)}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {slot.start} - {slot.end}
                    </p>
                    {slot.note ? <p className="text-xs">{slot.note}</p> : null}
                    {typeof slot.remaining === "number" && typeof slot.capacity === "number" ? (
                      <p className="text-xs">
                        Disponibles: {slot.remaining}/{slot.capacity}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      isAvailable
                        ? "bg-[var(--primary)] text-white"
                        : "bg-white/80 text-[var(--foreground)]"
                    }`}
                  >
                    {slot.status === "blocked" ? <CircleSlash size={14} /> : <TicketCheck size={14} />}
                    {slotActionLabel(slot.status)}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card flex items-center justify-between p-4">
        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <Clock3 size={16} className="text-[var(--primary)]" />
          Horarios con cortes cada 30 minutos.
        </div>
      </div>
    </div>
  );
}

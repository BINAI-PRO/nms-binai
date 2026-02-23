import Link from "next/link";
import { ArrowRight, Dumbbell, Info, Trophy, Waves } from "lucide-react";
import { mockFacilities } from "@/data/mock";

function AmenityIcon({ facilityId, size = 18 }: { facilityId: string; size?: number }) {
  if (facilityId.includes("pool")) return <Waves size={size} />;
  if (facilityId.includes("padel")) return <Trophy size={size} />;
  return <Dumbbell size={size} />;
}

function bookingModelLabel(model: string) {
  if (model === "zoned") return "Por espacios";
  if (model === "capacity") return "Por aforo";
  return "Exclusiva";
}

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Reservas</p>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Instalaciones de Encino</h1>
        </div>
        <Link href="/user/bookings" className="text-sm font-semibold text-[var(--primary)]">
          Mis reservas
        </Link>
      </div>

      <div className="grid gap-3">
        {mockFacilities.map((facility) => {
          return (
            <Link
              key={facility.id}
              href={`/user/bookings/facilities/${facility.id}`}
              className="card block overflow-hidden p-0 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`bg-gradient-to-r px-4 py-3 text-white ${facility.accentClass}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AmenityIcon facilityId={facility.id} />
                    <p className="text-sm font-semibold">{facility.name}</p>
                  </div>
                  <ArrowRight size={15} />
                </div>
              </div>

              <div className="space-y-3 p-4">
                <p className="text-sm text-[var(--muted)]">{facility.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border border-[var(--border)] bg-slate-50 px-2 py-2 text-[var(--muted)]">
                    <span className="font-semibold text-[var(--foreground)]">Modelo: </span>
                    {bookingModelLabel(facility.bookingModel)}
                  </div>
                  <div className="rounded-lg border border-[var(--border)] bg-slate-50 px-2 py-2 text-[var(--muted)]">
                    <span className="font-semibold text-[var(--foreground)]">Intervalo: </span>
                    {facility.slotIntervalMinutes} min
                  </div>
                  <div className="rounded-lg border border-[var(--border)] bg-slate-50 px-2 py-2 text-[var(--muted)]">
                    <span className="font-semibold text-[var(--foreground)]">Maximo: </span>
                    {Math.floor(facility.maxDurationMinutes / 60)} h
                  </div>
                  <div className="rounded-lg border border-[var(--border)] bg-slate-50 px-2 py-2 text-[var(--muted)]">
                    <span className="font-semibold text-[var(--foreground)]">Capacidad: </span>
                    {facility.maxCapacity}
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--primary)]">
                  <Info size={13} />
                  Ver reglas y horarios
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

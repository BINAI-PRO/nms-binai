import Link from "next/link";
import { ArrowRight, CircleCheck, Clock3, Dumbbell, Trophy, Waves } from "lucide-react";
import { mockFacilities, mockMyBookings } from "@/data/mock";

function AmenityIcon({ facilityId, size = 20 }: { facilityId: string; size?: number }) {
  if (facilityId.includes("pool")) return <Waves size={size} />;
  if (facilityId.includes("padel")) return <Trophy size={size} />;
  return <Dumbbell size={size} />;
}

export default function Page() {
  const totalConfirmed = mockMyBookings.filter((booking) => booking.status === "Confirmada").length;

  return (
    <div className="space-y-5">
      <div className="card overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--primary-accent)]/80 text-white">
        <div className="space-y-3 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/80">Reservaciones activas</p>
          <h1 className="text-2xl font-bold">{totalConfirmed} confirmadas</h1>
          <p className="text-sm text-white/90">
            Agenda por bloques de 30 minutos para alberca, padel y gimnasio.
          </p>
          <Link
            href="/user/bookings/facilities"
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-[var(--primary)]"
          >
            Ver instalaciones <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[var(--foreground)]">Mis proximas reservas</h2>
        <div className="grid gap-3">
          {mockMyBookings.map((booking) => {
            const isConfirmed = booking.status === "Confirmada";
            return (
              <article key={booking.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-[var(--primary)]/10 p-2.5 text-[var(--primary)]">
                      <AmenityIcon facilityId={booking.facilityId} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{booking.facilityName}</p>
                      <p className="text-xs text-[var(--muted)]">{booking.date}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">{booking.slot}</p>
                      <p className="text-xs text-[var(--muted)]">{booking.detail}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      isConfirmed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[var(--foreground)]">Reglas rapidas por amenidad</h2>
        <div className="grid gap-3">
          {mockFacilities.map((facility) => {
            return (
              <article key={facility.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-[var(--primary)]/10 p-2.5 text-[var(--primary)]">
                      <AmenityIcon facilityId={facility.id} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{facility.name}</p>
                      <p className="text-xs text-[var(--muted)]">{facility.location}</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        Maximo: {Math.floor(facility.maxDurationMinutes / 60)}h ? Paso: {facility.durationStepMinutes} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-2 py-1 text-xs font-semibold text-[var(--primary)]">
                    {facility.bookingModel === "exclusive" ? <CircleCheck size={13} /> : <Clock3 size={13} />}
                    {facility.slotIntervalMinutes} min
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

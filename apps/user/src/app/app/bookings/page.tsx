import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarClock, CircleCheck, Clock3, Dumbbell, Trophy, Wallet, Waves } from "lucide-react";
import { mockFacilities, mockMyBookings, mockTransactions } from "@/data/mock";

function AmenityIcon({ facilityId, size = 20 }: { facilityId: string; size?: number }) {
  if (facilityId.includes("pool")) return <Waves size={size} />;
  if (facilityId.includes("padel")) return <Trophy size={size} />;
  return <Dumbbell size={size} />;
}

export default function Page() {
  const totalConfirmed = mockMyBookings.filter((booking) => booking.status === "Confirmada").length;
  const pendingReservations = mockMyBookings.filter((booking) => booking.status === "Pendiente").length;
  const balance = mockTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const reservationCredit = Math.max(balance, 0);
  const nextMaintenanceDate = "15 Mar 2026";
  const maintenanceAmount = 2150;

  return (
    <div className="space-y-5">
      <div className="card overflow-hidden text-white">
        <div className="relative">
          <Image
            src="/encino/portada_am.webp"
            alt="Portada de amenidades en Residencial Encino"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/70 to-[var(--primary)]/75" />

          <div className="relative space-y-3 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/80">Resumen de billetera</p>
            <h1 className="text-2xl font-bold">
              {balance.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
            </h1>
            <p className="text-sm text-white/90">Saldo disponible para pagos, cuotas y reservas.</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-white/75">Mantenimiento</p>
                <p className="text-sm font-semibold">Al corriente</p>
                <p className="text-[11px] text-white/75">
                  Proximo {nextMaintenanceDate} -{" "}
                  {maintenanceAmount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                </p>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-white/75">Creditos y reservas</p>
                <p className="text-sm font-semibold">
                  {reservationCredit.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                </p>
                <p className="text-[11px] text-white/75">Pendientes: {pendingReservations}</p>
              </div>
            </div>
            <p className="text-xs text-white/85">
              Reservaciones activas: <span className="font-semibold">{totalConfirmed} confirmadas</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/user/wallet"
                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-900"
              >
                <Wallet size={15} />
                Ver billetera
              </Link>
              <Link
                href="/user/bookings/facilities"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white"
              >
                <CalendarClock size={15} />
                Ver instalaciones <ArrowRight size={15} />
              </Link>
            </div>
          </div>
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

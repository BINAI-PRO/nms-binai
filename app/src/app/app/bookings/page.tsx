import Link from "next/link";
import { mockFacilities } from "@/data/mock";

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Reservas</p>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Próximas</h1>
        </div>
        <Link href="/app/bookings/facilities" className="text-sm font-semibold text-[var(--primary)]">Ver instalaciones</Link>
      </div>

      <div className="grid gap-3">
        {mockFacilities.map((facility) => (
          <div key={facility.id} className="card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{facility.type}</p>
                <h3 className="text-base font-semibold text-[var(--foreground)]">{facility.name}</h3>
                <p className="text-sm text-[var(--muted)]">{facility.location}</p>
              </div>
              <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)]">{facility.status}</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-[var(--muted)]">
              <span className="h-2 w-2 rounded-full bg-[var(--success)]" /> Hoy, 18:00 - 19:00
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

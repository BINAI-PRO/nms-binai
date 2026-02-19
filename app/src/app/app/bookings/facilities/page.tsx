import Link from "next/link";
import { mockFacilities } from "@/data/mock";

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[var(--foreground)]">Instalaciones</h1>
        <Link href="/user/bookings" className="text-sm font-semibold text-[var(--primary)]">Mis reservas</Link>
      </div>
      <div className="grid gap-3">
        {mockFacilities.map((facility) => (
          <Link key={facility.id} href={`/user/bookings/facilities/${facility.id}`} className="card block p-4 hover:border-[var(--primary)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{facility.type}</p>
                <h3 className="text-base font-semibold text-[var(--foreground)]">{facility.name}</h3>
                <p className="text-sm text-[var(--muted)]">{facility.location}</p>
              </div>
              <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)]">{facility.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

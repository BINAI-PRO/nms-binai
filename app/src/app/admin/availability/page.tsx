import { supabaseAdmin } from "@/lib/supabase";

type FacilityRow = {
  id: string;
  name: string;
  type: string | null;
  status: string | null;
  location: string | null;
};

type BookingRow = {
  facility_id: string;
  starts_at: string;
  status: string;
};

export default async function AdminAvailabilityPage() {
  if (!supabaseAdmin) {
    return (
      <section className="card space-y-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Admin - disponibilidad
        </p>
        <h2 className="text-lg font-bold text-[var(--foreground)]">Configuracion pendiente</h2>
        <p className="text-sm text-[var(--muted)]">
          Faltan variables de Supabase para monitorear disponibilidad y reservas.
        </p>
      </section>
    );
  }

  const now = new Date().toISOString();
  const [facilitiesRes, bookingsRes] = await Promise.all([
    supabaseAdmin.from("facilities").select("id,name,type,status,location").order("name"),
    supabaseAdmin
      .from("bookings")
      .select("facility_id,starts_at,status")
      .gte("starts_at", now)
      .in("status", ["pending", "confirmed"])
      .order("starts_at", { ascending: true }),
  ]);

  if (facilitiesRes.error) {
    return (
      <section className="card space-y-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Admin - disponibilidad
        </p>
        <h2 className="text-lg font-bold text-[var(--foreground)]">
          No se pudo cargar disponibilidad
        </h2>
        <p className="text-sm text-[var(--muted)]">{facilitiesRes.error.message}</p>
      </section>
    );
  }

  const bookingsByFacility = new Map<string, BookingRow[]>();
  for (const booking of (bookingsRes.data ?? []) as BookingRow[]) {
    const prev = bookingsByFacility.get(booking.facility_id) ?? [];
    prev.push(booking);
    bookingsByFacility.set(booking.facility_id, prev);
  }

  const facilities = (facilitiesRes.data ?? []) as FacilityRow[];

  return (
    <section className="space-y-4">
      <header className="card space-y-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Admin - disponibilidad
        </p>
        <h2 className="text-lg font-bold text-[var(--foreground)]">Disponibilidad de amenidades</h2>
        <p className="text-sm text-[var(--muted)]">
          Vista de ocupacion para planear bloqueos, capacidad y horarios.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {facilities.map((facility) => {
          const upcomingBookings = bookingsByFacility.get(facility.id) ?? [];
          return (
            <article key={facility.id} className="card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                    {facility.type || "Amenidad"}
                  </p>
                  <h3 className="text-base font-bold text-[var(--foreground)]">{facility.name}</h3>
                  <p className="text-sm text-[var(--muted)]">{facility.location || "Sin ubicacion"}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                  {facility.status || "available"}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  Reservas proximas: {upcomingBookings.length}
                </p>
                <ul className="space-y-1 text-xs text-[var(--muted)]">
                  {upcomingBookings.slice(0, 4).map((booking, index) => (
                    <li key={`${facility.id}-${booking.starts_at}-${index}`}>
                      {new Date(booking.starts_at).toLocaleString("es-MX")} - {booking.status}
                    </li>
                  ))}
                  {!upcomingBookings.length ? <li>No hay reservas proximas.</li> : null}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

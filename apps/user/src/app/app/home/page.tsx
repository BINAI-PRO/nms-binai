import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarClock,
  Dumbbell,
  House,
  ShieldCheck,
  Trophy,
  Wallet,
  Waves,
} from "lucide-react";
import {
  mockAnnouncements,
  mockFacilities,
  mockIncidents,
  mockMyBookings,
  mockTransactions,
} from "@/data/mock";
import { getActiveTenantBranding } from "@/lib/tenant-branding";

function AmenityIcon({ facilityId, size = 20 }: { facilityId: string; size?: number }) {
  if (facilityId.includes("pool")) return <Waves size={size} />;
  if (facilityId.includes("padel")) return <Trophy size={size} />;
  return <Dumbbell size={size} />;
}

export default function HomePage() {
  const tenantBranding = getActiveTenantBranding();
  const balance = mockTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const reservationCredit = Math.max(balance, 0);
  const pendingReservations = mockMyBookings.filter((booking) => booking.status === "Pendiente").length;
  const nextMaintenanceDate = "15 Mar 2026";

  return (
    <div className="space-y-6">
      <section className="card overflow-hidden p-0">
        <div className="relative h-48 w-full">
          <Image
            src="/encino/portada.webp"
            alt="Portada Residencial Encino"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-black/10" />
          <div className="absolute bottom-0 w-full p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.14em]"></p>
            <h1 className="text-2xl font-bold">Residencial Encino</h1>
            <p className="text-sm text-white/90">Torre de 30 departamentos + 50 casas en privadas</p>
          </div>
        </div>
      </section>

      <section className="card flex items-center justify-center gap-3 px-4 py-3 text-xs text-[var(--muted)]">
        <Image
          src={tenantBranding.assets.logoContrast ?? tenantBranding.assets.logo}
          alt={`Logo ${tenantBranding.companyName}`}
          width={176}
          height={48}
          className="h-10 w-auto opacity-90"
        />
        <span className="font-semibold">BISALOM Administrador Residencial</span>
      </section>

      <section className="card p-5">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Micro resumen de propiedad
          </p>
          <h2 className="text-xl font-bold text-[var(--foreground)]">DEP-001 - Departamento</h2>
          <p className="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
            <House size={15} className="text-[var(--primary)]" />
            Torre Encino, Nivel 1, Residencial Encino
          </p>
          <p className="inline-flex items-center gap-2 text-sm text-emerald-700">
            <ShieldCheck size={15} />
            Mantenimiento al corriente
          </p>
          <p className="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
            <CalendarClock size={15} className="text-[var(--primary)]" />
            Proximo mantenimiento: {nextMaintenanceDate}
          </p>
          <p className="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
            <Wallet size={15} className="text-[var(--primary)]" />
            Credito para reservas:{" "}
            {reservationCredit > 0
              ? reservationCredit.toLocaleString("es-MX", { style: "currency", currency: "MXN" })
              : "Sin saldo a favor"}
          </p>
          <p className="text-sm text-[var(--muted)]">
            Reservas pendientes: <span className="font-semibold text-[var(--foreground)]">{pendingReservations}</span>
          </p>
          <div className="pt-1">
            <Link
              href="/user/wallet"
              className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-sm font-semibold text-[var(--primary)]"
            >
              Ver billetera <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <Header title="Reservar amenidades" href="/user/bookings/facilities" />
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
                      <p className="text-base font-semibold text-[var(--foreground)]">{facility.name}</p>
                      <p className="text-sm text-[var(--muted)]">{facility.description}</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        Intervalos de {facility.slotIntervalMinutes} min - Maximo {Math.floor(facility.maxDurationMinutes / 60)} h
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                    {facility.status}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <Header title="Proximas reservas" href="/user/bookings" />
        <div className="grid gap-3">
          {mockMyBookings.map((booking) => (
            <article key={booking.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{booking.facilityName}</p>
                  <p className="text-xs text-[var(--muted)]">{booking.date}</p>
                </div>
                <span className="rounded-full bg-[var(--primary)]/10 px-2 py-1 text-xs font-semibold text-[var(--primary)]">
                  {booking.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {booking.slot} - {booking.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <Header title="Incidencias recientes" href="/user/incidents" />
        <div className="grid gap-3">
          {mockIncidents.map((incident) => (
            <article key={incident.id} className="card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{incident.category}</p>
                  <h3 className="text-base font-semibold text-[var(--foreground)]">{incident.title}</h3>
                  <p className="text-sm text-[var(--muted)]">{incident.description}</p>
                </div>
                <AlertTriangle size={17} className="mt-1 text-[var(--warning)]" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <Header title="Comunidad" href="/user/community" />
        <div className="grid gap-3">
          {mockAnnouncements.map((announcement) => (
            <article key={announcement.id} className="card overflow-hidden">
              <div className="relative h-36 w-full">
                <Image src={announcement.image} alt={announcement.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 600px" />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-[var(--primary)]">
                  {announcement.tag}
                </span>
              </div>
              <div className="space-y-1 p-4">
                <h3 className="text-base font-semibold text-[var(--foreground)]">{announcement.title}</h3>
                <p className="text-sm text-[var(--muted)]">{announcement.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Header({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>
      {href ? (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)]"
        >
          Ver todo <ArrowUpRight size={16} />
        </Link>
      ) : null}
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Camera,
  MessageCircle,
  MoreHorizontal,
  TicketCheck,
} from "lucide-react";
import {
  mockAnnouncements,
  mockFacilities,
  mockIncidents,
  mockTransactions,
} from "@/data/mock";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              alt="Perfil"
              src="https://picsum.photos/seed/carlos/100"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full border-2 border-white shadow-sm"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[var(--success)]" />
          </div>
          <div>
            <p className="text-sm text-[var(--muted)]">Bienvenido,</p>
            <h1 className="text-lg font-bold leading-tight text-[var(--foreground)]">
              Carlos Ufano
            </h1>
          </div>
        </div>
        <Link
          href="/app/notifications"
          className="relative rounded-full p-2 text-[var(--primary)] hover:bg-[var(--primary)]/5"
        >
          <BadgeCheck size={22} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--danger)]" />
        </Link>
      </section>

      <section className="card relative overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[#2a7a87] text-white">
        <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-4 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">Saldo actual</p>
              <h2 className="text-3xl font-bold mt-1">$12,430.50 MXN</h2>
            </div>
            <TicketCheck className="text-white/60" />
          </div>
          <div className="mt-2 flex items-center gap-2 border-t border-white/10 pt-4 text-sm text-white/90">
            <span className="rounded-full bg-white/15 px-2 py-1 text-xs font-semibold">
              Unidad 1C
            </span>
            <span>Residencial Bosques</span>
          </div>
        </div>
      </section>

      <QuickActions />

      <section className="space-y-3">
        <Header title="Incidencias recientes" href="/app/incidents" />
        <div className="grid gap-3">
          {mockIncidents.map((incident) => (
            <article key={incident.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[var(--foreground)]">
                    {incident.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted)] line-clamp-2">
                    {incident.description}
                  </p>
                </div>
                <MoreHorizontal size={18} className="text-[var(--muted)]" />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="chip bg-[var(--primary)]/10 text-[var(--primary)]">
                  {incident.status}
                </span>
                <span className="chip bg-amber-50 text-amber-700">
                  Prioridad {incident.priority}
                </span>
                <span className="text-[var(--muted)]">{incident.createdAt}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <Header title="Próximas reservas" href="/app/bookings" />
        <div className="grid gap-3 sm:grid-cols-2">
          {mockFacilities.map((facility) => (
            <article key={facility.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    {facility.type}
                  </p>
                  <h3 className="text-base font-semibold text-[var(--foreground)]">
                    {facility.name}
                  </h3>
                  <p className="text-sm text-[var(--muted)]">{facility.location}</p>
                </div>
                <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                  {facility.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <Header title="Movimientos de billetera" href="/app/wallet" />
        <div className="grid gap-3">
          {mockTransactions.map((tx) => (
            <div
              key={tx.id}
              className="card flex items-center justify-between px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {tx.title}
                </p>
                <p className="text-xs text-[var(--muted)]">{tx.date}</p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-bold ${
                    tx.amount >= 0 ? "text-[var(--success)]" : "text-[var(--foreground)]"
                  }`}
                >
                  {tx.amount >= 0 ? "+" : ""}
                  {tx.amount.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </p>
                <p className="text-xs text-[var(--muted)]">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <Header title="Comunidad" href="/app/community" />
        <div className="grid gap-3">
          {mockAnnouncements.map((a) => (
            <article key={a.id} className="card overflow-hidden">
              <div className="relative h-40 w-full">
                <Image
                  src={a.image}
                  alt={a.title}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 600px"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                  {a.tag}
                </span>
              </div>
              <div className="space-y-1 p-4">
                <h3 className="text-base font-semibold text-[var(--foreground)]">{a.title}</h3>
                <p className="text-sm text-[var(--muted)]">{a.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function QuickActions() {
  return (
    <section className="grid grid-cols-3 gap-3">
      {[
        { label: "Reportar", icon: Camera, href: "/app/incidents/new" },
        { label: "Reservar", icon: TicketCheck, href: "/app/bookings/facilities" },
        { label: "Comentar", icon: MessageCircle, href: "/app/community" },
      ].map((action) => (
        <Link
          href={action.href}
          key={action.label}
          className="card flex flex-col items-center gap-2 px-3 py-4 text-center text-sm font-semibold text-[var(--foreground)] hover:border-[var(--primary)]"
        >
          <div className="rounded-full bg-[var(--primary)]/10 p-3 text-[var(--primary)]">
            <action.icon size={20} />
          </div>
          {action.label}
        </Link>
      ))}
    </section>
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

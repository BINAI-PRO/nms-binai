import { mockAnnouncements, mockIncidents } from "@/data/mock";
import Image from "next/image";

export default function Page() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Comunidad</p>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Novedades</h1>
        </div>
        <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)]">En línea</span>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Anuncios</h2>
        <div className="grid gap-3">
          {mockAnnouncements.map((a) => (
            <article key={a.id} className="card overflow-hidden">
              <div className="relative h-40 w-full">
                <Image src={a.image} alt={a.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 600px" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--primary)]">{a.tag}</span>
              </div>
              <div className="space-y-1 p-4">
                <h3 className="text-base font-semibold text-[var(--foreground)]">{a.title}</h3>
                <p className="text-sm text-[var(--muted)]">{a.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Incidencias destacadas</h2>
        <div className="grid gap-3">
          {mockIncidents.slice(0, 1).map((incident) => (
            <article key={incident.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{incident.category}</p>
                  <h3 className="text-base font-semibold text-[var(--foreground)]">{incident.title}</h3>
                  <p className="text-sm text-[var(--muted)]">{incident.description}</p>
                </div>
                <span className="chip bg-[var(--primary)]/10 text-[var(--primary)]">{incident.status}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
